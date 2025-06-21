# HRMS SaaS Automation System

This system automates the deployment of HRMS instances for new subscribers.

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Subscription   │    │   SaaS API       │    │   Docker        │
│  Frontend       │───▶│   (C# .NET)      │───▶│   Containers    │
│  (HTML/JS)      │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Automation     │
                       │   Scripts        │
                       │   • DNS          │
                       │   • Nginx Proxy  │
                       │   • Portainer    │
                       └──────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

- Linux server with Docker and Docker Compose
- Portainer installed
- Nginx Proxy Manager installed
- Cloudflare account with API token
- Domain name configured

### 2. Environment Setup

```bash
# Clone the automation system
git clone <your-repo>
cd saas-automation

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Set up the HRMS template
git clone <hrms-template-repo> /path/to/hrms-template
```

### 3. Deploy SaaS Management System

```bash
# Start the SaaS management system
docker-compose -f docker-compose.saas.yml up -d

# The subscription form will be available at:
# http://your-server:8080

# The API will be available at:
# http://your-server:5000
```

## 🔧 Configuration

### Environment Variables

```bash
# Cloudflare
CLOUDFLARE_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_zone_id

# Nginx Proxy Manager
NPM_URL=http://your-npm:81
NPM_TOKEN=your_npm_jwt_token

# Portainer
PORTAINER_URL=http://your-portainer:9000
PORTAINER_TOKEN=your_portainer_jwt_token

# Database
DATABASE_CONNECTION_STRING=your_db_connection
```

### Portainer Setup

1. **Create Template Stack**:
   - In Portainer, create a stack named `vmis-hrms-template`
   - Use the HRMS docker-compose.yml as the template
   - This will be duplicated for each new client

2. **API Access**:
   - Generate JWT token in Portainer settings
   - Add token to environment variables

### Nginx Proxy Manager Setup

1. **API Access**:
   - Enable API access in NPM settings
   - Generate JWT token
   - Add token to environment variables

## 📋 Usage

### Automatic Deployment (Recommended)

1. **Customer subscribes** via the web form
2. **System automatically**:
   - Validates subdomain availability
   - Finds available port
   - Creates Docker container with custom branding
   - Sets up DNS record in Cloudflare
   - Configures reverse proxy in NPM
   - Sends confirmation email

### Manual Deployment

```bash
# Deploy a new client
./scripts/deploy-client.sh VDC vdc-hrms 3001

# Remove a client
./scripts/remove-client.sh VDC
```

### Portainer Integration

```bash
# Deploy via Portainer API
./scripts/portainer-deploy.sh VDC vdc-hrms 3001
```

## 🔄 Workflow

### New Subscription Process

1. **Form Submission**
   ```
   Customer fills form → API receives request → Validation
   ```

2. **Resource Allocation**
   ```
   Check subdomain → Find available port → Create deployment directory
   ```

3. **Container Deployment**
   ```
   Generate docker-compose → Build container → Start services
   ```

4. **Network Configuration**
   ```
   Create DNS record → Configure reverse proxy → SSL certificate
   ```

5. **Confirmation**
   ```
   Save to database → Send email → Provide access details
   ```

## 🛠 Customization

### Adding New Features

1. **Modify the HRMS template** with new features
2. **Update the deployment scripts** if needed
3. **Rebuild containers** for existing clients (optional)

### Custom Branding

Each client gets:
- Custom company name in the UI
- Branded subdomain
- Isolated container environment
- Separate database (when implemented)

## 📊 Monitoring

### Container Health

```bash
# Check all client containers
docker ps | grep hrms

# Check specific client
docker logs vdc-hrms

# Monitor resources
docker stats
```

### Database Monitoring

```bash
# Connect to SaaS database
docker exec -it hrms-saas-db psql -U saas_user -d hrms_saas

# Check deployments
SELECT * FROM deployments WHERE status = 'active';
```

## 🔒 Security

### Best Practices

1. **Environment Variables**: Store sensitive data in environment variables
2. **Network Isolation**: Each client container runs in isolated network
3. **SSL Certificates**: Automatic SSL via Let's Encrypt
4. **Access Control**: Role-based access within each HRMS instance
5. **Regular Updates**: Keep base images and dependencies updated

### Backup Strategy

```bash
# Backup client data
./scripts/backup-client.sh VDC

# Restore client data
./scripts/restore-client.sh VDC backup-file.tar.gz
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tuln | grep :3001
   
   # Find available ports
   ./scripts/find-available-port.sh
   ```

2. **DNS Issues**
   ```bash
   # Check DNS propagation
   dig vdc-hrms.yourdomain.com
   
   # Recreate DNS record
   ./scripts/cloudflare-dns.sh delete vdc-hrms
   ./scripts/cloudflare-dns.sh create vdc-hrms
   ```

3. **Container Issues**
   ```bash
   # Check container logs
   docker logs vdc-hrms
   
   # Restart container
   docker restart vdc-hrms
   ```

## 📈 Scaling

### Horizontal Scaling

- Deploy on multiple servers
- Use load balancer for SaaS API
- Implement container orchestration (Kubernetes)

### Vertical Scaling

- Increase server resources
- Optimize container resource limits
- Implement caching strategies

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review container logs
3. Contact the development team

---

**Ready for production SaaS deployment!** 🚀