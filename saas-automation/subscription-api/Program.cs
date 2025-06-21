using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseRouting();
app.MapControllers();

// Subscription endpoint
app.MapPost("/api/subscribe", async ([FromBody] SubscriptionRequest request) =>
{
    try
    {
        var deploymentService = new DeploymentService();
        var result = await deploymentService.DeployClientAsync(request);
        
        return Results.Ok(new { success = true, data = result });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, error = ex.Message });
    }
});

app.Run();

// Models
public record SubscriptionRequest(
    string CompanyName,
    string ContactEmail,
    string ContactName,
    string SubdomainPreference,
    string Plan = "basic"
);

public record DeploymentResult(
    string CompanyName,
    string Subdomain,
    string ContainerName,
    string Url,
    int Port,
    string Status
);

// Deployment Service
public class DeploymentService
{
    private readonly string _serverPath = "/home/hrms-deployments";
    private readonly string _domain = "yourdomain.com";
    private readonly string _cloudflareToken = Environment.GetEnvironmentVariable("CLOUDFLARE_TOKEN") ?? "";
    private readonly string _cloudflareZoneId = Environment.GetEnvironmentVariable("CLOUDFLARE_ZONE_ID") ?? "";
    
    public async Task<DeploymentResult> DeployClientAsync(SubscriptionRequest request)
    {
        // 1. Validate and sanitize company name
        var companyCode = SanitizeCompanyName(request.CompanyName);
        var subdomain = request.SubdomainPreference.ToLower().Trim();
        
        // 2. Check if subdomain is available
        if (await IsSubdomainTaken(subdomain))
        {
            throw new Exception($"Subdomain '{subdomain}' is already taken");
        }
        
        // 3. Find available port
        var port = await FindAvailablePort();
        
        // 4. Create deployment directory
        var deploymentPath = Path.Combine(_serverPath, companyCode);
        Directory.CreateDirectory(deploymentPath);
        
        // 5. Generate docker-compose file
        await GenerateDockerComposeFile(deploymentPath, companyCode, subdomain, port);
        
        // 6. Deploy container
        await DeployContainer(deploymentPath, companyCode);
        
        // 7. Create DNS record
        await CreateDnsRecord(subdomain);
        
        // 8. Configure Nginx Proxy Manager
        await ConfigureNginxProxy(subdomain, port);
        
        // 9. Save deployment info to database
        await SaveDeploymentInfo(request, companyCode, subdomain, port);
        
        return new DeploymentResult(
            CompanyName: request.CompanyName,
            Subdomain: subdomain,
            ContainerName: $"{companyCode.ToLower()}-hrms",
            Url: $"https://{subdomain}.{_domain}",
            Port: port,
            Status: "deployed"
        );
    }
    
    private string SanitizeCompanyName(string companyName)
    {
        // Remove special characters and spaces, convert to uppercase
        return new string(companyName.Where(c => char.IsLetterOrDigit(c)).ToArray()).ToUpper();
    }
    
    private async Task<bool> IsSubdomainTaken(string subdomain)
    {
        // Check against existing deployments
        var deployments = Directory.GetDirectories(_serverPath);
        foreach (var deployment in deployments)
        {
            var envFile = Path.Combine(deployment, ".env");
            if (File.Exists(envFile))
            {
                var content = await File.ReadAllTextAsync(envFile);
                if (content.Contains($"DOMAIN={subdomain}.{_domain}"))
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    private async Task<int> FindAvailablePort()
    {
        var startPort = 3001;
        var maxPort = 3100;
        
        for (int port = startPort; port <= maxPort; port++)
        {
            if (!await IsPortInUse(port))
            {
                return port;
            }
        }
        
        throw new Exception("No available ports found");
    }
    
    private async Task<bool> IsPortInUse(int port)
    {
        try
        {
            var result = await RunCommand($"netstat -tuln | grep :{port}");
            return !string.IsNullOrEmpty(result);
        }
        catch
        {
            return false;
        }
    }
    
    private async Task GenerateDockerComposeFile(string deploymentPath, string companyCode, string subdomain, int port)
    {
        var dockerCompose = $@"version: '3.8'

services:
  {companyCode.ToLower()}-hrms:
    build: 
      context: /path/to/hrms-template
      args:
        NEXT_PUBLIC_APP_BRAND_PREFIX: {companyCode}
        NEXT_PUBLIC_API_URL: https://{subdomain}.{_domain}
    container_name: {companyCode.ToLower()}-hrms
    ports:
      - ""{port}:3000""
    environment:
      - NEXT_PUBLIC_APP_BRAND_PREFIX={companyCode}
      - NEXT_PUBLIC_API_URL=https://{subdomain}.{_domain}
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - ""traefik.enable=true""
      - ""traefik.http.routers.{companyCode.ToLower()}-hrms.rule=Host(`{subdomain}.{_domain}`)""
      - ""traefik.http.routers.{companyCode.ToLower()}-hrms.tls=true""
      - ""traefik.http.routers.{companyCode.ToLower()}-hrms.tls.certresolver=letsencrypt""

networks:
  proxy:
    external: true";

        await File.WriteAllTextAsync(Path.Combine(deploymentPath, "docker-compose.yml"), dockerCompose);
        
        var envFile = $@"NEXT_PUBLIC_APP_BRAND_PREFIX={companyCode}
NEXT_PUBLIC_API_URL=https://{subdomain}.{_domain}
CONTAINER_NAME={companyCode.ToLower()}-hrms
DOMAIN={subdomain}.{_domain}
PORT={port}";

        await File.WriteAllTextAsync(Path.Combine(deploymentPath, ".env"), envFile);
    }
    
    private async Task DeployContainer(string deploymentPath, string companyCode)
    {
        var command = $"cd {deploymentPath} && docker-compose up -d --build";
        await RunCommand(command);
    }
    
    private async Task CreateDnsRecord(string subdomain)
    {
        if (string.IsNullOrEmpty(_cloudflareToken)) return;
        
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_cloudflareToken}");
        
        var payload = new
        {
            type = "CNAME",
            name = subdomain,
            content = $"server.{_domain}",
            ttl = 1
        };
        
        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
        
        await client.PostAsync($"https://api.cloudflare.com/client/v4/zones/{_cloudflareZoneId}/dns_records", content);
    }
    
    private async Task ConfigureNginxProxy(string subdomain, int port)
    {
        // Configure Nginx Proxy Manager via API
        // This would integrate with your NPM API
        var client = new HttpClient();
        
        var proxyConfig = new
        {
            domain_names = new[] { $"{subdomain}.{_domain}" },
            forward_scheme = "http",
            forward_host = "localhost",
            forward_port = port,
            ssl_forced = true,
            caching_enabled = false,
            block_exploits = true,
            advanced_config = "",
            meta = new { },
            access_list_id = 0,
            certificate_id = 0,
            ssl_forced_hsts_enabled = true,
            ssl_forced_hsts_subdomains = true,
            http2_support = true
        };
        
        // Implementation depends on your NPM API setup
        // await client.PostAsync("http://npm-api:81/api/nginx/proxy-hosts", content);
    }
    
    private async Task SaveDeploymentInfo(SubscriptionRequest request, string companyCode, string subdomain, int port)
    {
        // Save to your database
        var deployment = new
        {
            CompanyName = request.CompanyName,
            CompanyCode = companyCode,
            ContactEmail = request.ContactEmail,
            ContactName = request.ContactName,
            Subdomain = subdomain,
            Port = port,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            Url = $"https://{subdomain}.{_domain}"
        };
        
        // Insert into database
        // await _dbContext.Deployments.AddAsync(deployment);
        // await _dbContext.SaveChangesAsync();
    }
    
    private async Task<string> RunCommand(string command)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"{command}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };
        
        process.Start();
        var output = await process.StandardOutput.ReadToEndAsync();
        var error = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();
        
        if (process.ExitCode != 0)
        {
            throw new Exception($"Command failed: {error}");
        }
        
        return output;
    }
}