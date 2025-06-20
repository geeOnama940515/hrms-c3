import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeLeaveByHR } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { acknowledgedBy, comments } = await request.json();
    const leave = await acknowledgeLeaveByHR(params.id, acknowledgedBy, comments);
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error acknowledging leave application:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge leave application' },
      { status: 500 }
    );
  }
}