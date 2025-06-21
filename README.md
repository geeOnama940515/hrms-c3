# Dynamic SaaS HRMS Template

A comprehensive SaaS platform template for vendor management and human resources built with Next.js, TypeScript, and Tailwind CSS. This template is designed for multi-tenant deployment with dynamic branding.

## 🚀 Features

### HR Management
- **Employee Management**: Complete employee lifecycle management
- **Leave Management**: Advanced leave application and approval workflow
- **Department Management**: Organize employees by departments
- **Job Title Management**: Define and manage job positions
- **User Roles**: Multi-level access control (HR Manager, HR Supervisor, Department Head, Employee)

### Vendor Management (Coming Soon)
- **Vendor Registration**: Onboard and manage vendor information
- **Contract Management**: Track vendor contracts and agreements
- **Performance Monitoring**: Monitor vendor performance metrics
- **Payment Processing**: Handle vendor payments and invoicing

### SaaS Features
- **Dynamic Branding**: Customizable company branding via environment variables
- **Multi-tenant Architecture**: Support for multiple companies
- **Role-based Access Control**: Granular permissions system
- **RESTful API**: Complete API endpoints for all operations
- **Responsive Design**: Mobile-first responsive interface
- **Docker Ready**: Containerized for easy deployment

## 🎨 Dynamic Branding

The application supports dynamic branding through environment variables, making it perfect for SaaS deployment:

### Environment Variable
```env
NEXT_PUBLIC_APP_BRAND_PREFIX=VDC
```

This will change:
- **VMIS-HRMS** → **VDC-HRMS**
- Page titles, login screen, sidebar branding
- All references throughout the application

### Default Behavior
If no environment variable is set, the application defaults to "VMIS" branding.

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Context API
- **API**: Next.js API Routes
- **Authentication**: JWT-based authentication (mock implementation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd hrms-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_APP_BRAND_PREFIX=YOUR_COMPANY" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t hrms-template .
```

2. Run with custom branding:
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_APP_BRAND_PREFIX=VDC hrms-template
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  hrms:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_APP_BRAND_PREFIX=VDC
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 🔧 SaaS Automation Setup

For automated deployment when new clients subscribe:

### 1. Environment Variables
```bash
# Client-specific variables
NEXT_PUBLIC_APP_BRAND_PREFIX=CLIENT_NAME
NEXT_PUBLIC_API_URL=https://client-api.yourdomain.com
DATABASE_URL=postgresql://user:pass@db:5432/client_db
```

### 2. Dynamic Docker Compose Generation
```bash
#!/bin/bash
CLIENT_NAME=$1
SUBDOMAIN=$2

# Generate docker-compose file
cat > docker-compose-${CLIENT_NAME}.yml << EOF
version: '3.8'
services:
  ${CLIENT_NAME}-hrms:
    build: .
    container_name: ${CLIENT_NAME}-hrms
    ports:
      - "0:3000"  # Let Docker assign port
    environment:
      - NEXT_PUBLIC_APP_BRAND_PREFIX=${CLIENT_NAME}
      - NEXT_PUBLIC_API_URL=https://${SUBDOMAIN}.yourdomain.com
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${CLIENT_NAME}.rule=Host(\`${SUBDOMAIN}.yourdomain.com\`)"

networks:
  proxy:
    external: true
EOF

# Deploy
docker-compose -f docker-compose-${CLIENT_NAME}.yml up -d
```

### 3. Cloudflare DNS Automation
```bash
#!/bin/bash
# Add DNS record via Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${CF_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "'${SUBDOMAIN}'",
    "content": "your-server.com",
    "ttl": 1
  }'
```

## 📋 Demo Accounts

The system includes demo accounts for testing different user roles:

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| hr.manager@company.com | password123 | HR Manager | Full system access |
| hr.supervisor@company.com | password123 | HR Supervisor | Company-wide HR operations |
| hr.company@company.com | password123 | HR Company Level | Company-specific HR operations |
| dept.head@company.com | password123 | Department Head | Department employee management |
| employee@company.com | password123 | Employee | Limited employee access |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `GET /api/departments/[id]` - Get department by ID
- `PUT /api/departments/[id]` - Update department
- `DELETE /api/departments/[id]` - Delete department

### Job Titles
- `GET /api/job-titles` - Get all job titles
- `POST /api/job-titles` - Create new job title
- `GET /api/job-titles/[id]` - Get job title by ID
- `PUT /api/job-titles/[id]` - Update job title
- `DELETE /api/job-titles/[id]` - Delete job title

### Leave Management
- `GET /api/leaves` - Get leave applications
- `POST /api/leaves` - Create leave application
- `GET /api/leaves/[id]` - Get leave application by ID
- `PUT /api/leaves/[id]` - Update leave application
- `DELETE /api/leaves/[id]` - Delete leave application
- `POST /api/leaves/[id]/approve` - Approve leave application
- `POST /api/leaves/[id]/acknowledge` - HR acknowledge leave
- `POST /api/leaves/[id]/reject` - Reject leave application

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create new company

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout (dynamic branding)
│   └── page.tsx            # Main application (dynamic branding)
├── components/
│   ├── auth/               # Authentication components (dynamic branding)
│   ├── dashboard/          # Dashboard components
│   ├── departments/        # Department management
│   ├── employees/          # Employee management
│   ├── jobtitles/          # Job title management
│   ├── layout/             # Layout components (dynamic branding)
│   ├── leaves/             # Leave management
│   ├── profile/            # User profile
│   └── ui/                 # Reusable UI components
├── contexts/               # React contexts
├── lib/                    # Utility libraries
├── types/                  # TypeScript type definitions
├── middleware.ts           # Next.js middleware
├── Dockerfile              # Docker configuration
└── docker-compose.yml      # Docker Compose template
```

## 👥 User Roles & Permissions

### HR Manager
- Full system access across all companies
- Can manage employees, departments, job titles
- Can approve and acknowledge leave applications
- Access to all reports and analytics

### HR Supervisor
- Company-wide HR operations
- Can manage employees within company
- Can acknowledge leave applications
- Access to company reports

### HR Company Level
- Company-specific HR operations
- Can manage employees and job titles
- Can acknowledge leave applications

### Department Head
- Department employee management
- Can approve leave applications for department employees
- Limited access to department data

### Employee
- Limited access to personal information
- Can apply for leave
- Can view own profile and leave history

## 🔧 Development

### Adding New Features

1. **API Endpoints**: Add new routes in `app/api/`
2. **Components**: Create reusable components in `components/`
3. **Types**: Define TypeScript types in `types/index.ts`
4. **Utilities**: Add helper functions in `lib/`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement responsive design
- Add proper error handling

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_APP_BRAND_PREFIX=YOUR_COMPANY
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Docker Production Build

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
ARG NEXT_PUBLIC_APP_BRAND_PREFIX
ENV NEXT_PUBLIC_APP_BRAND_PREFIX=$NEXT_PUBLIC_APP_BRAND_PREFIX
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "out", "-l", "3000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**Perfect for SaaS deployment with dynamic branding and multi-tenant architecture!**