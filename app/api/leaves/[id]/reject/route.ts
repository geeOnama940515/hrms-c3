import { NextRequest, NextResponse } from 'next/server';
import { rejectLeaveApplication } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { rejectedBy, comments } = await request.json();
    const leave = await rejectLeaveApplication(params.id, rejectedBy, comments);
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error rejecting leave application:', error);
    return NextResponse.json(
      { error: 'Failed to reject leave application' },
      { status: 500 }
    );
  }
}