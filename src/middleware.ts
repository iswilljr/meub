import { NextResponse } from 'next/server'

export default function middleware() {
  return NextResponse.next({
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  })
}

export const config = {
  matcher: '/',
}
