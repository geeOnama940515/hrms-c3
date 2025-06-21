import { NextRequest, NextResponse } from 'next/server';
import { approveLeaveByDepartmentHead } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approvedBy, comments } = await request.json();
    
    if (!approvedBy) {
      return NextResponse.json(
        { error: 'approvedBy is required' },
        { status: 400 }
      );
    }

    const updatedLeave = await approveLeaveByDepartmentHead(
      params.id,
      approvedBy,
      comments
    );

    return NextResponse.json({
      success: true,
      data: updatedLeave
    });

  } catch (error) {
    console.error('Approve leave error:', error);
    return NextResponse.json(
      { error: 'Failed to approve leave application' },
      { status: 500 }
    );
  }
}