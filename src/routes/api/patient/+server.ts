import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This endpoint handles chat requests, forwarding them to the n8n webhook
export const POST: RequestHandler = async ({ request, cookies }) => {
	const { chatInput } = await request.json();
	const url = env.N8N_PATIENT_FORM_CHAT_URL;
	console.log(url, chatInput);
	let sessionId = cookies.get('sessionId');
	if (!sessionId) {
		sessionId = 'chat_' + Math.random().toString(36).substr(2, 9); // Unique ID
		cookies.set('sessionId', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});
	}
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sessionId, chatInput })
	});
	if (!res.ok) {
		console.error('Error in chat request:', res.status, res.statusText);
		return json({ error: 'Failed to process chat input' }, { status: res.status });
	}
	const n8nResponse = await res.json();
	console.log('N8N Response', JSON.stringify(n8nResponse, null, 2));
	return json(n8nResponse);
};

// Submit Form with PUT and POST to n8n webhook
export const PUT: RequestHandler = async ({ request }) => {
	const formData = await request.json();
	const url = env.N8N_PATIENT_FORM_WEBHOOK_URL;
	console.log('POST', url, formData);
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formData)
	});
	if (!res.ok) {
		console.error('Error in PUT Form request:', res.status, res.statusText);
		return json({ error: 'Failed to process chat input' }, { status: res.status });
	}
	const n8nResponse = await res.json();
	console.log('From webhook Response', JSON.stringify(n8nResponse, null, 2));
	return json(n8nResponse);
};
