import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'laundry_talktalk_frontend'
    },
    { status: 200 }
  );
}
