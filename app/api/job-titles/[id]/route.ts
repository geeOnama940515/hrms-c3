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

    return NextResponse.json({
      success: true,
      data: jobTitle
    });

  } catch (error) {
    console.error('Get job title error:', error);
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
    const updatedJobTitle = await updateJobTitle(params.id, updates);

    return NextResponse.json({
      success: true,
      data: updatedJobTitle
    });

  } catch (error) {
    console.error('Update job title error:', error);
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

    return NextResponse.json({
      success: true,
      message: 'Job title deleted successfully'
    });

  } catch (error) {
    console.error('Delete job title error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job title' },
      { status: 500 }
    );
  }
}