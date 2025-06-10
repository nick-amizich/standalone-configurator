import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    
    // List of allowed origins
    const allowedOrigins = [
      'https://squirrrelscramble.myshopify.com',
      'https://standalone-configurator.vercel.app',
      'http://localhost:3000',
      // Add more Shopify domains as needed
    ];
    
    // Check if the origin is allowed or if it's a Shopify domain
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.myshopify.com') ||
                      origin.includes('shopify.com');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowed ? origin : 'https://squirrrelscramble.myshopify.com',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Domain, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Handle actual requests
    const response = NextResponse.next();
    
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', 'https://squirrrelscramble.myshopify.com');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Shopify-Domain, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};