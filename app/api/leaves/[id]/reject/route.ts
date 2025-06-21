import { NextRequest, NextResponse } from 'next/server';
import { rejectLeaveApplication } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rejectedBy, comments } = await request.json();
    
    if (!rejectedBy || !comments) {
      return NextResponse.json(
        { error: 'rejectedBy and comments are required' },
        { status: 400 }
      );
    }

    const updatedLeave = await rejectLeaveApplication(
      params.id,
      rejectedBy,
      comments
    );

    return NextResponse.json({
      success: true,
      data: updatedLeave
    });

  } catch (error) {
    console.error('Reject leave error:', error);
    return NextResponse.json(
      { error: 'Failed to reject leave application' },
      { status: 500 }
    );
  }
}