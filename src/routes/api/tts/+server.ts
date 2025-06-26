import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from '../$types';
import {geminiTTS,edgeTTS} from '$lib/utils'


export const GET: RequestHandler = async ({ url }) => {
  // const text = url.searchParams.get('text') ?? 'Hello';
  // const voice = url.searchParams.get('voice') ?? 'th-TH-PremwadeeNeural'//'th-TH-NiwatNeural' 

	const text = url.searchParams.get('text') ?? 'Hello';
	const ttsType = url.searchParams.get('ttsType') ?? 'edge'
	let voice = url.searchParams.get('voice')
  if (!text) return json({ error: 'Text is required' }, { status: 400 });

  console.log(ttsType,voice)
  if(ttsType==='edge'){
    voice = voice?? 'th-TH-NiwatNeural'//'th-TH-PremwadeeNeural'
    return new Response(await edgeTTS(text, voice), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' }
    });

  }else if(ttsType==='gemini'){
    const apiKey = env.GOOGLE_API_KEY ||''
    voice = voice?? 'Zephyr'
    return new Response(await geminiTTS(apiKey,text, voice), {
      status: 200,
      headers: { 'Content-Type': 'audio/wav' }
    });
  }else{
    return json({ error: 'Invalid TTS type' }, { status: 400 });
  }

  

};
