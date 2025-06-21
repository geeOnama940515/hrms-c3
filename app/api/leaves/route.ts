import { NextRequest, NextResponse } from 'next/server';
import { getLeaveApplications, createLeaveApplication } from '@/lib/leaves';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: any = {};
    if (employeeId) filters.employeeId = employeeId;
    if (departmentId) filters.departmentId = departmentId;
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const leaves = await getLeaveApplications(filters);

    return NextResponse.json({
      success: true,
      data: leaves,
      total: leaves.length
    });

  } catch (error) {
    console.error('Get leave applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leaveData = await request.json();
    
    const requiredFields = ['employeeId', 'leaveType', 'startDate', 'endDate', 'reason'];
    for (const field of requiredFields) {
      if (!leaveData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newLeave = await createLeaveApplication(leaveData);

    return NextResponse.json({
      success: true,
      data: newLeave
    }, { status: 201 });

  } catch (error) {
    console.error('Create leave application error:', error);
    return NextResponse.json(
      { error: 'Failed to create leave application' },
      { status: 500 }
    );
  }
}