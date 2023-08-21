import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req) {
  const { prompt } = await req.json();

  if (!openai.apiKey) {
    NextResponse.json({ error: "OpenAI API key not configured, please follow instructions in README.md", status: 500 });
    return;
  }

  const city = prompt || "";
  if (city.trim().length === 0) {
    NextResponse.json({error: 'Please enter a valid city', status: 400})
    return;
  }
 
  // Ask OpenAI for a streaming completion given the prompt
 
  const response = await openai.completions.create({
    model: 'text-davinci-003',
    stream: true,
    temperature: 0.9,
    max_tokens: 2000,
    prompt: generatePrompt(city),
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

function generatePrompt(city) {
    const capitalizedCity = city[0].toUpperCase() + city.slice(1).toLowerCase();
    return `Usted es un amable guia turistico que brinda informacion real, no miente y si no conoce la ciudad aclara que no puede ayudar.
    Genere 1 lugar a visitar en ${capitalizedCity} ordenados por distancia al centro historico de la ciudad.
    
      El formato de respuesta tiene que ser con la siguiente informacion, comenzando desde la etiqueta <div> inclusive:
  
      <div style="margin-top:20px;">
      <h1 style="font-weight: bold; font-size: 18px;">Recomendacion numero :</h1>
      <ul>
      <li>🏰 Nombre del lugar: </li>
      <li>ℹ Informacion: (description) </li>
      <li>📏 Distancia estimada al centro historico:  </li>
      <li>🕚 Horario de visita: </li>
      <li>🎫 Requiere comprar entrada: si / no </li>
      <li>💲 Precio estimado </li>
      <li>📍 Direccion: (para buscar en google maps, separa la direccion con el signo "+" ejemplo: 1600+Amphitheatre+Parkway,+Mountain+View,+CA para mostrarla en el anchor tag. Para la direccion escrita no es necesario separar con el signo "+") ejemplo: 1600 Amphitheatre Parkway, Mountain View, CA <a href="https://www.google.com/maps/search/1600+Amphitheatre+Parkway,+Mountain+View,+CA" target="_blank" style"text-decoration: underline">Abrir en Google Maps</a>
      </li>
      </ul>
      </div>`;
  }