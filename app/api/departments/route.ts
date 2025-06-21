import { NextRequest, NextResponse } from 'next/server';
import { getDepartments, createDepartment } from '@/lib/employees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const departments = await getDepartments();
    
    let filteredDepartments = departments;
    
    if (companyId) {
      filteredDepartments = filteredDepartments.filter(dept => dept.companyId === companyId);
    }

    return NextResponse.json({
      success: true,
      data: filteredDepartments,
      total: filteredDepartments.length
    });

  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const departmentData = await request.json();
    
    if (!departmentData.name || !departmentData.companyId) {
      return NextResponse.json(
        { error: 'Name and companyId are required' },
        { status: 400 }
      );
    }

    const newDepartment = await createDepartment(departmentData);

    return NextResponse.json({
      success: true,
      data: newDepartment
    }, { status: 201 });

  } catch (error) {
    console.error('Create department error:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}