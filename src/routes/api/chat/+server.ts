import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This endpoint handles chat requests, forwarding them to the n8n webhook
export const POST: RequestHandler = async ({ request,cookies }) => {
	const { chatInput,backend} = await request.json()
  const url = (backend==='form')? env.N8N_CHAT_FORM_URL: env.N8N_CHAT_URL ||''
  console.log(backend,url,chatInput)
	let sessionId = cookies.get('sessionId')
  if (!sessionId){
    sessionId = 'chat_' + Math.random().toString(36).substr(2, 9); // Unique ID
    cookies.set('sessionId', sessionId, {
      // send cookie for every page
      path: '/',
      // server side only cookie so you can't use `document.cookie`
      httpOnly: true,
      // only requests from same site can send cookies
      // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
      sameSite: 'strict',
      // only sent over HTTPS in production
      secure: process.env.NODE_ENV === 'production',
      // set cookie to expire after a month
      maxAge: 60 * 60 * 24 * 30,
    })

  }
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({sessionId,chatInput})
	});
	if (!res.ok) {
		console.error('Error in chat request:', res.status, res.statusText);
		return json({ error: 'Failed to process chat input' }, { status: res.status });
	}
  const n8nResponse = await res.json()
  console.log("N8N Response",n8nResponse)
	return json(n8nResponse)
};
