export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'World';
  
    return new Response(`Hello, ${name}!`);
  }
  