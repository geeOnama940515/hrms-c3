import { NextRequest, NextResponse } from 'next/server';
import { getLeaveApplications, createLeaveApplication } from '@/lib/leaves';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: any = {};
    
    if (searchParams.get('employeeId')) {
      filters.employeeId = searchParams.get('employeeId');
    }
    if (searchParams.get('departmentId')) {
      filters.departmentId = searchParams.get('departmentId');
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    if (searchParams.get('startDate')) {
      filters.startDate = searchParams.get('startDate');
    }
    if (searchParams.get('endDate')) {
      filters.endDate = searchParams.get('endDate');
    }
    
    const leaves = await getLeaveApplications(filters);
    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leaveData = await request.json();
    const leave = await createLeaveApplication(leaveData);
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error creating leave application:', error);
    return NextResponse.json(
      { error: 'Failed to create leave application' },
      { status: 500 }
    );
  }
}