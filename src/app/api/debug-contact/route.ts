import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Debug Route Hit - Hardcoded Client");
  
  const supabaseUrl = 'https://lzvxpamfvfzkchbqfxgt.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dnhwYW1mdmZ6a2NoYnFmeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjExNDQsImV4cCI6MjA2NDUzNzE0NH0.BxvV5yhtvjELIU3mcWbjTwrxXAZRgARY2OKivQ6JdNs';

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check Env Vars
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log("Env Var Check:", {
      url_exists: !!envUrl,
      url_match: envUrl === supabaseUrl,
      key_exists: !!envKey
    });

    // 2. Test RPC Function
    console.log("Testing RPC...");
    const testData = {
      p_name: 'Debug User',
      p_email: 'debug@example.com',
      p_message: 'This is a debug message ' + new Date().toISOString(),
      p_ip: '127.0.0.1'
    };

    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_contact_message', testData);


    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return NextResponse.json({ 
        status: 'error', 
        step: 'rpc_call', 
        message: rpcError.message, 
        details: rpcError 
      }, { status: 500 });
    }
    console.log("RPC OK:", rpcData);

    return NextResponse.json({ 
      status: 'success', 
      connection: 'ok', 
      rpc_result: rpcData 
    });

  } catch (e: unknown) {
    console.error("Unexpected Error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ 
      status: 'error', 
      step: 'unexpected', 
      message: errorMessage 
    }, { status: 500 });
  }
}
