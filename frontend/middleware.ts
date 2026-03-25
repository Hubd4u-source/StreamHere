import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight in-memory rate limiter (per-instance)
// For a production-ready global solution on Vercel, use @upstash/ratelimit
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50; // Max 50 requests per minute per IP

export function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    let rateData = rateLimitMap.get(ip);
    
    if (!rateData || (now - rateData.lastReset) > RATE_LIMIT_WINDOW) {
      rateData = { count: 0, lastReset: now };
    }
    
    rateData.count++;
    rateLimitMap.set(ip, rateData);
    
    if (rateData.count > MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests', message: 'Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((RATE_LIMIT_WINDOW - (now - rateData.lastReset)) / 1000).toString()
          } 
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
