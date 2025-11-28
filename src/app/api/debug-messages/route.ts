import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  // Hardcoded for debug reliability
  const supabaseUrl = 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("Testing get_contact_messages RPC...");
    
    const { data, error } = await supabase.rpc('get_contact_messages');

    if (error) {
      console.error("RPC Error:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error,
        hint: "Did you run the SQL to create get_contact_messages?" 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length, data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
