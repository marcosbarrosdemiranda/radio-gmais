import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Implement audio streaming
  // This endpoint would serve the radio stream

  return new Response('Stream endpoint - Not implemented yet', {
    status: 501,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
