import { NextRequest, NextResponse } from 'next/server';
import { approveLeaveByDepartmentHead } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approvedBy, comments } = await request.json();
    const leave = await approveLeaveByDepartmentHead(params.id, approvedBy, comments);
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error approving leave application:', error);
    return NextResponse.json(
      { error: 'Failed to approve leave application' },
      { status: 500 }
    );
  }
}