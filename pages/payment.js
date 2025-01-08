export async function POST(request) {
    const body = await request.json();
    console.log("body", body);
  
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  