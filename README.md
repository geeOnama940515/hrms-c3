# VMIS-HRMS - Vendor Management & HR System

A comprehensive SaaS platform for vendor management and human resources built with Next.js, TypeScript, and Tailwind CSS.

## Features

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

### System Features
- **Multi-tenant SaaS Architecture**: Support for multiple companies
- **Role-based Access Control**: Granular permissions system
- **RESTful API**: Complete API endpoints for all operations
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: Live data synchronization

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Context API
- **API**: Next.js API Routes
- **Authentication**: JWT-based authentication (mock implementation)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vmis-hrms
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

The system includes demo accounts for testing different user roles:

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| hr.manager@company.com | password123 | HR Manager | Full system access |
| hr.supervisor@company.com | password123 | HR Supervisor | Company-wide HR operations |
| hr.company@company.com | password123 | HR Company Level | Company-specific HR operations |
| dept.head@company.com | password123 | Department Head | Department employee management |
| employee@company.com | password123 | Employee | Limited employee access |

## API Endpoints

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

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application
├── components/
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── departments/        # Department management
│   ├── employees/          # Employee management
│   ├── jobtitles/          # Job title management
│   ├── layout/             # Layout components
│   ├── leaves/             # Leave management
│   ├── profile/            # User profile
│   └── ui/                 # Reusable UI components
├── contexts/               # React contexts
├── lib/                    # Utility libraries
├── types/                  # TypeScript type definitions
└── middleware.ts           # Next.js middleware
```

## User Roles & Permissions

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

## Development

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

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.