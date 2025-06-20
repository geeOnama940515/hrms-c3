import { NextRequest, NextResponse } from 'next/server';
import { getJobTitles, createJobTitle } from '@/lib/employees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    
    const jobTitles = await getJobTitles(departmentId || undefined);
    return NextResponse.json(jobTitles);
  } catch (error) {
    console.error('Error fetching job titles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job titles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobTitleData = await request.json();
    const jobTitle = await createJobTitle(jobTitleData);
    return NextResponse.json(jobTitle);
  } catch (error) {
    console.error('Error creating job title:', error);
    return NextResponse.json(
      { error: 'Failed to create job title' },
      { status: 500 }
    );
  }
}