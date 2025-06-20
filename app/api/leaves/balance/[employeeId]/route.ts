import { NextRequest, NextResponse } from 'next/server';
import { getLeaveBalance } from '@/lib/leaves';

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    
    const balance = await getLeaveBalance(
      params.employeeId, 
      year ? parseInt(year) : undefined
    );
    
    return NextResponse.json(balance);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave balance' },
      { status: 500 }
    );
  }
}