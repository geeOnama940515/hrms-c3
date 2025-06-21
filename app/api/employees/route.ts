import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, createEmployee } from '@/lib/employees';
import { Employee } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const employees = await getEmployees();
    
    let filteredEmployees = employees;
    
    if (companyId) {
      filteredEmployees = filteredEmployees.filter(emp => emp.companyId === companyId);
    }
    
    if (departmentId) {
      filteredEmployees = filteredEmployees.filter(emp => emp.departmentId === departmentId);
    }
    
    if (status) {
      filteredEmployees = filteredEmployees.filter(emp => emp.employmentStatus === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredEmployees,
      total: filteredEmployees.length
    });

  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'employeeNumber', 'companyId'];
    for (const field of requiredFields) {
      if (!employeeData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newEmployee = await createEmployee(employeeData);

    return NextResponse.json({
      success: true,
      data: newEmployee
    }, { status: 201 });

  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}