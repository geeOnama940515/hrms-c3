import { NextRequest, NextResponse } from 'next/server';
import { getJobTitleById, updateJobTitle, deleteJobTitle } from '@/lib/employees';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobTitle = await getJobTitleById(params.id);
    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(jobTitle);
  } catch (error) {
    console.error('Error fetching job title:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job title' },
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
    const jobTitle = await updateJobTitle(params.id, updates);
    return NextResponse.json(jobTitle);
  } catch (error) {
    console.error('Error updating job title:', error);
    return NextResponse.json(
      { error: 'Failed to update job title' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteJobTitle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job title:', error);
    return NextResponse.json(
      { error: 'Failed to delete job title' },
      { status: 500 }
    );
  }
}