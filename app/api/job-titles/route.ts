import { NextRequest, NextResponse } from 'next/server';
import { getJobTitles, createJobTitle } from '@/lib/employees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    const jobTitles = await getJobTitles(departmentId || undefined);

    return NextResponse.json({
      success: true,
      data: jobTitles,
      total: jobTitles.length
    });

  } catch (error) {
    console.error('Get job titles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job titles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobTitleData = await request.json();
    
    if (!jobTitleData.title || !jobTitleData.departmentId) {
      return NextResponse.json(
        { error: 'Title and departmentId are required' },
        { status: 400 }
      );
    }

    const newJobTitle = await createJobTitle(jobTitleData);

    return NextResponse.json({
      success: true,
      data: newJobTitle
    }, { status: 201 });

  } catch (error) {
    console.error('Create job title error:', error);
    return NextResponse.json(
      { error: 'Failed to create job title' },
      { status: 500 }
    );
  }
}