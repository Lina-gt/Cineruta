import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API route for Cinema Advisor
app.post('/api/cinema-advisor', async (req, res) => {
  try {
    const { question, locationContext, nearbyCinemas } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Falta la pregunta del usuario' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        answer: `Como experto en cine español en la zona de ${locationContext || 'España'}, te sugiero visitar cines como ${nearbyCinemas?.[0]?.name || 'el cine de referencia local'}, prestando especial atención a las salas en versión original (VOSE) y las tarifas reducidas de los miércoles en el Día del Espectador.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `Eres un sabio y apasionado proyeccionista cinematográfico y experto en salas de cine de España (CineRuta España).
Tu misión es aconsejar al espectador sobre cines cercanos, calidad técnica (35mm/70mm, IMAX, Dolby Atmos, proyección láser), versiones originales VOSE, películas en cartelera, día del espectador y recomendaciones cinéfilas con un tono culto, acogedor, elegante y vintage pero práctico.
Ubicación actual del usuario: ${locationContext || 'España'}.
Cines detectados en la base de datos para esta zona: ${JSON.stringify(nearbyCinemas || [])}.
Responde en español de forma concisa, útil y apasionada por el séptimo arte.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nPregunta del usuario: ${question}` }
          ]
        }
      ]
    });

    const replyText = response.text || 'Disfruta de la magia del cine en la gran pantalla.';
    res.json({ answer: replyText });
  } catch (error: any) {
    console.error('Error in /api/cinema-advisor:', error);
    res.status(200).json({
      answer: 'Para disfrutar de la mejor experiencia cinematográfica, te recomendamos consultar las sesiones en versión original (VOSE) y salas con sonido Dolby Atmos o IMAX.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineRuta server listening on port ${PORT}`);
  });
}

startServer();
