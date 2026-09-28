import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || 'http://localhost',
  token: process.env.KV_REST_API_TOKEN || 'dummy',
});

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    if (!process.env.KV_REST_API_URL) {
      // Return a dummy value if running locally without KV env vars
      return new Response(JSON.stringify({ likes: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    if (request.method === 'POST') {
      const likes = await redis.incr('portfolio_likes');
      return new Response(JSON.stringify({ likes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      });
    } else {
      const likes = (await redis.get('portfolio_likes')) || 0;
      return new Response(JSON.stringify({ likes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }
}
