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
      return new Response(JSON.stringify({ likes: 42, hasLiked: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');

    // Get the client's IP address from Vercel headers as fallback
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
    
    // Use deviceId if available, otherwise fallback to IP
    const identifier = deviceId ? `device_${deviceId}` : `ip_${ip}`;
    const likeKey = `portfolio_liked_v3_${identifier}`;

    if (request.method === 'POST') {
      // Check if this user has already liked
      const alreadyLiked = await redis.get(likeKey);
      
      if (alreadyLiked) {
         const likes = (await redis.get('portfolio_likes_v3')) || 0;
         return new Response(JSON.stringify({ likes, error: "Already liked" }), {
           status: 200,
           headers: { 'Content-Type': 'application/json', ...headers },
         });
      }

      // Mark user as liked and increment counter
      await redis.set(likeKey, 'true');
      const likes = await redis.incr('portfolio_likes_v3');
      
      return new Response(JSON.stringify({ likes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      });
    } else {
      // GET method
      const likes = (await redis.get('portfolio_likes_v3')) || 0;
      const hasLiked = await redis.get(likeKey) === 'true';
      
      return new Response(JSON.stringify({ likes, hasLiked }), {
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
