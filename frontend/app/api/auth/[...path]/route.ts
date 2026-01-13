import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = (path: string) => {
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return `${BACKEND_URL}/api/auth/${path}`;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const awaitedParams = await params;
  const path = awaitedParams.path.join('/');
  const backendUrl = getBackendUrl(path);

  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
    });

    // Check if the response is ok before parsing JSON
    const responseBody = await response.text(); // Use text() to handle non-JSON responses
    let data;

    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (parseError) {
      // If parsing fails, return the raw text or an error
      data = { error: 'Invalid JSON response', raw: responseBody };
    }

    const res = Response.json(data, { status: response.status });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  } catch (error) {
    const res = Response.json({ error: 'Proxy error', details: (error as Error).message }, { status: 500 });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const awaitedParams = await params;
  const path = awaitedParams.path.join('/');
  const backendUrl = getBackendUrl(path);

  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: JSON.stringify(body),
    });

    // Check if the response is ok before parsing JSON
    const responseBody = await response.text(); // Use text() to handle non-JSON responses
    let data;

    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (parseError) {
      // If parsing fails, return the raw text or an error
      data = { error: 'Invalid JSON response', raw: responseBody };
    }

    const res = Response.json(data, { status: response.status });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  } catch (error) {
    const res = Response.json({ error: 'Proxy error', details: (error as Error).message }, { status: 500 });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const awaitedParams = await params;
  const path = awaitedParams.path.join('/');
  const backendUrl = getBackendUrl(path);

  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: JSON.stringify(body),
    });

    // Check if the response is ok before parsing JSON
    const responseBody = await response.text(); // Use text() to handle non-JSON responses
    let data;

    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (parseError) {
      // If parsing fails, return the raw text or an error
      data = { error: 'Invalid JSON response', raw: responseBody };
    }

    const res = Response.json(data, { status: response.status });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  } catch (error) {
    const res = Response.json({ error: 'Proxy error', details: (error as Error).message }, { status: 500 });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const awaitedParams = await params;
  const path = awaitedParams.path.join('/');
  const backendUrl = getBackendUrl(path);

  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
    });

    // Check if the response is ok before parsing JSON
    const responseBody = await response.text(); // Use text() to handle non-JSON responses
    let data;

    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (parseError) {
      // If parsing fails, return the raw text or an error
      data = { error: 'Invalid JSON response', raw: responseBody };
    }

    const res = Response.json(data, { status: response.status });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  } catch (error) {
    const res = Response.json({ error: 'Proxy error', details: (error as Error).message }, { status: 500 });

    // Add CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
  }
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  const response = new Response(null, {
    status: 200,
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}