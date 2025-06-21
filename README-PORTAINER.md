# Portainer Template Deployment Guide

This guide shows you how to deploy the HRMS application as a Portainer template for easy SaaS deployment.

## 🎯 Overview

The HRMS application is **ready for Portainer template deployment** with these features:

✅ **Dynamic Branding** - Each instance gets custom company branding  
✅ **Environment Variables** - Easy configuration per client  
✅ **Docker Compose** - Production-ready container setup  
✅ **API Endpoints** - Complete REST API  
✅ **Health Checks** - Built-in monitoring  

## 🚀 Quick Setup

### 1. Setup Portainer Template

```bash
# Make script executable
chmod +x scripts/portainer-setup.sh

# Run setup (replace with your Portainer details)
./scripts/portainer-setup.sh http://your-portainer:9000 admin your-password
```

### 2. Deploy New Client Instance

**Option A: Via Portainer UI**
1. Go to **App Templates** in Portainer
2. Find **"VMIS-HRMS SaaS Instance"**
3. Click **"Deploy the stack"**
4. Fill in client details:
   - **Company Brand Prefix**: `VDC`
   - **Container Name**: `vdc-hrms`
   - **Port**: `3001`
   - **Domain**: `vdc-hrms.yourdomain.com`
5. Click **Deploy**

**Option B: Via API Script**
```bash
# Set your Portainer JWT token
export PORTAINER_TOKEN="your-jwt-token-here"

# Deploy new client
./scripts/deploy-via-portainer.sh VDC vdc-hrms 3001
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_BRAND_PREFIX` | Company branding code | `VDC`, `ABC`, `XYZ` |
| `NEXT_PUBLIC_API_URL` | Full application URL | `https://vdc-hrms.yourdomain.com` |
| `CONTAINER_NAME` | Unique container name | `vdc-hrms` |
| `DOMAIN` | Domain for Traefik routing | `vdc-hrms.yourdomain.com` |
| `PORT` | External port mapping | `3001`, `3002`, etc. |

### Example Deployments

**Client 1: VDC Corporation**
```bash
NEXT_PUBLIC_APP_BRAND_PREFIX=VDC
CONTAINER_NAME=vdc-hrms
PORT=3001
DOMAIN=vdc-hrms.yourdomain.com
```

**Client 2: ABC Company**
```bash
NEXT_PUBLIC_APP_BRAND_PREFIX=ABC
CONTAINER_NAME=abc-hrms
PORT=3002
DOMAIN=abc-hrms.yourdomain.com
```

## 🎨 What Each Client Gets

### Branded Experience
- **Login Screen**: Shows "VDC-HRMS" instead of "VMIS-HRMS"
- **Sidebar**: Company branding throughout
- **Page Titles**: Custom branded titles
- **URLs**: Unique subdomain per client

### Isolated Environment
- **Separate Container**: Each client has their own container
- **Unique Port**: No port conflicts
- **Independent Updates**: Update clients individually
- **Custom Configuration**: Per-client settings

## 🔄 Management Operations

### List All HRMS Instances
```bash
# Via Docker
docker ps | grep hrms

# Via Portainer API
curl -H "Authorization: Bearer $PORTAINER_TOKEN" \
  "http://your-portainer:9000/api/stacks" | \
  jq '.[] | select(.Name | contains("hrms"))'
```

### Update Client Instance
```bash
# Stop existing
docker stop vdc-hrms

# Deploy updated version
./scripts/deploy-via-portainer.sh VDC vdc-hrms 3001
```

### Remove Client Instance
```bash
# Via Portainer UI: Stacks → Select Stack → Delete

# Via API
curl -X DELETE \
  -H "Authorization: Bearer $PORTAINER_TOKEN" \
  "http://your-portainer:9000/api/stacks/{stack-id}?external=false&endpointId=1"
```

## 🌐 Network Setup

### With Traefik (Recommended)
The template includes Traefik labels for automatic reverse proxy:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.vdc-hrms.rule=Host(`vdc-hrms.yourdomain.com`)"
  - "traefik.http.services.vdc-hrms.loadbalancer.server.port=3000"
```

### With Nginx Proxy Manager
1. Create proxy host in NPM
2. Point to `localhost:3001` (or client's port)
3. Enable SSL certificate

### Direct Access
Each instance is accessible on its assigned port:
- VDC: `http://your-server:3001`
- ABC: `http://your-server:3002`

## 📊 Monitoring

### Health Checks
Each container includes health checks:
```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# View health check logs
docker inspect vdc-hrms | jq '.[0].State.Health'
```

### Resource Usage
```bash
# Monitor all HRMS containers
docker stats $(docker ps --format "{{.Names}}" | grep hrms)
```

## 🔒 Security

### Best Practices
1. **Unique Ports**: Each client gets a unique port
2. **Network Isolation**: Containers run in separate networks
3. **Environment Isolation**: No shared environment variables
4. **SSL Certificates**: Use Let's Encrypt for HTTPS
5. **Access Control**: Portainer team-based access control

### Labels for Management
```yaml
labels:
  - "hrms.client=VDC"
  - "hrms.type=saas-instance"
  - "hrms.version=1.0"
  - "io.portainer.accesscontrol.teams=administrators"
```

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
netstat -tuln | grep :3001

# Find available port
for port in {3001..3100}; do
  if ! netstat -tuln | grep -q ":$port "; then
    echo "Port $port is available"
    break
  fi
done
```

**Container Won't Start**
```bash
# Check container logs
docker logs vdc-hrms

# Check Portainer stack logs
# Go to Portainer → Stacks → Select Stack → Logs
```

**Template Not Showing**
```bash
# Re-run template setup
./scripts/portainer-setup.sh http://your-portainer:9000 admin your-password

# Check Portainer logs
docker logs portainer
```

## 🎉 Success!

Your HRMS application is now **ready for production SaaS deployment** with:

✅ **Portainer Template** - Easy deployment via UI  
✅ **API Automation** - Scriptable deployments  
✅ **Dynamic Branding** - Custom branding per client  
✅ **Isolated Instances** - Separate containers per client  
✅ **Production Ready** - Health checks, monitoring, SSL  

**Deploy your first client now!** 🚀