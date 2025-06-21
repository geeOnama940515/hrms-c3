import { NextRequest, NextResponse } from 'next/server';
import { getCompanies } from '@/lib/employees';

export async function GET(request: NextRequest) {
  try {
    const companies = await getCompanies();

    return NextResponse.json({
      success: true,
      data: companies,
      total: companies.length
    });

  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyData = await request.json();
    
    if (!companyData.name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // For now, we'll just return a mock response since we don't have createCompany implemented
    const newCompany = {
      id: Date.now().toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newCompany
    }, { status: 201 });

  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}