import { NextRequest, NextResponse } from 'next/server';
import { getLeaveApplicationById, updateLeaveApplication, deleteLeaveApplication } from '@/lib/leaves';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leave = await getLeaveApplicationById(params.id);
    
    if (!leave) {
      return NextResponse.json(
        { error: 'Leave application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leave
    });

  } catch (error) {
    console.error('Get leave application error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave application' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const updatedLeave = await updateLeaveApplication(params.id, updates);

    return NextResponse.json({
      success: true,
      data: updatedLeave
    });

  } catch (error) {
    console.error('Update leave application error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteLeaveApplication(params.id);

    return NextResponse.json({
      success: true,
      message: 'Leave application deleted successfully'
    });

  } catch (error) {
    console.error('Delete leave application error:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave application' },
      { status: 500 }
    );
  }
}