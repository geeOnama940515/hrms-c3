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
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error fetching leave application:', error);
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
    const leave = await updateLeaveApplication(params.id, updates);
    return NextResponse.json(leave);
  } catch (error) {
    console.error('Error updating leave application:', error);
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting leave application:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave application' },
      { status: 500 }
    );
  }
}