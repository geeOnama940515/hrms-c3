import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeLeaveByHR } from '@/lib/leaves';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { acknowledgedBy, comments } = await request.json();
    
    if (!acknowledgedBy) {
      return NextResponse.json(
        { error: 'acknowledgedBy is required' },
        { status: 400 }
      );
    }

    const updatedLeave = await acknowledgeLeaveByHR(
      params.id,
      acknowledgedBy,
      comments
    );

    return NextResponse.json({
      success: true,
      data: updatedLeave
    });

  } catch (error) {
    console.error('Acknowledge leave error:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge leave application' },
      { status: 500 }
    );
  }
}