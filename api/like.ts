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

    // Get the client's IP address from Vercel headers
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const ipKey = `portfolio_liked_ip_${ip}`;

    if (request.method === 'POST') {
      // Check if this IP has already liked
      const alreadyLiked = await redis.get(ipKey);
      
      if (alreadyLiked) {
         const likes = (await redis.get('portfolio_likes_v3')) || 0;
         return new Response(JSON.stringify({ likes, error: "Already liked" }), {
           status: 200,
           headers: { 'Content-Type': 'application/json', ...headers },
         });
      }

      // Mark IP as liked and increment counter
      await redis.set(ipKey, 'true');
      const likes = await redis.incr('portfolio_likes_v3');
      
      return new Response(JSON.stringify({ likes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...headers },
      });
    } else {
      // GET method
      const likes = (await redis.get('portfolio_likes_v3')) || 0;
      const hasLiked = await redis.get(ipKey) === 'true';
      
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
