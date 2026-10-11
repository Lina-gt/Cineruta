import React, { useState } from 'react';
import { X, Sparkles, Send, Film, MapPin, Compass, Lightbulb, Ticket } from 'lucide-react';
import { Cinema } from '../types/cinema';

interface CinemaGuideAiProps {
  isOpen: boolean;
  onClose: () => void;
  activeCityOrProvince: string;
  nearbyCinemas: Cinema[];
  onSelectCinemaByName?: (name: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: { cinemaName: string; reason: string }[];
}

export const CinemaGuideAi: React.FC<CinemaGuideAiProps> = ({
  isOpen,
  onClose,
  activeCityOrProvince,
  nearbyCinemas,
  onSelectCinemaByName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `¡Saludos, cinéfilo! Soy el Proyeccionista y Guía Cinematográfico de CineRuta. Te ayudo a descubrir los mejores cines en ${activeCityOrProvince || 'España'}, salas con versión original (VOSE), proyecciones históricas en 70mm, sonido inmersivo Dolby Atmos o recomendaciones de cartelera. ¿Qué te gustaría consultar hoy?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    '¿Cuáles son los mejores cines VOSE aquí?',
    '¿Qué cine tiene mejor sonido o pantalla IMAX?',
    '¿Qué cines tienen día del espectador más económico?',
    'Recomiéndame una joya de cine independiente o clásico',
  ];

  const handleSend = async (userQuestion?: string) => {
    const questionText = userQuestion || input;
    if (!questionText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Try backend proxy with Gemini
      const response = await fetch('/api/cinema-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          locationContext: activeCityOrProvince,
          nearbyCinemas: nearbyCinemas.map(c => ({
            name: c.name,
            brand: c.brand,
            city: c.city,
            hasVOSE: c.hasVOSE,
            screens: c.screens,
            pricingInfo: c.pricingInfo,
            services: c.services
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.answer || 'Aquí tienes mi recomendación cinematográfica.',
            recommendations: data.recommendations,
          },
        ]);
        setLoading(false);
        return;
      }
    } catch (err) {
      // Server error or standalone mode: fallback to local expert rule engine
    }

    // Local Expert Cinephile Generator
    setTimeout(() => {
      let reply = '';
      const q = questionText.toLowerCase();

      if (q.includes('vose') || q.includes('original') || q.includes('idioma')) {
        const voseCinemas = nearbyCinemas.filter(c => c.hasVOSE);
        if (voseCinemas.length > 0) {
          reply = `Para disfrutar de películas en Versión Original Subtitulada (VOSE) en tu zona, te recomiendo encarecidamente:\n\n` +
            voseCinemas.slice(0, 3).map(c => `• **${c.name}** (${c.city}): ${c.description}`).join('\n\n') +
            `\n\nTodos ellos ofrecen sonido limpio original y subtítulos minuciosamente sincronizados.`;
        } else {
          reply = `En las grandes ciudades cercanas tienes cines emblemáticos en VOSE como **Cines Verdi**, **Cine Doré (Filmoteca Española)**, **Yelmo Ideal** en Madrid, y **Phenomena Experience** o **Cines Verdi** en Barcelona.`;
        }
      } else if (q.includes('sonido') || q.includes('imax') || q.includes('atmos') || q.includes('pantalla')) {
        const techCinemas = nearbyCinemas.filter(c => c.services.imax || c.services.atmosSound);
        if (techCinemas.length > 0) {
          reply = `Para una experiencia audiovisual suprema de gran formato:\n\n` +
            techCinemas.map(c => `• **${c.name}**: ${c.services.imax ? 'Dispone de pantalla IMAX colosal. ' : ''}${c.services.atmosSound ? 'Equipado con acústica envolvente Dolby Atmos.' : ''}`).join('\n') +
            `\n\nIdeales para superproducciones de ciencia ficción y épicas cinematográficas.`;
        } else {
          reply = `Los cines de referencia en España para tecnología punta son **Kinépolis Madrid Ciudad de la Imagen** (con IMAX Láser y 25 salas), **Cinesa Diagonal Mar IMAX** en Barcelona, y **Phenomena Experience** (con copias en 70 mm y Dolby Atmos de vanguardia).`;
        }
      } else if (q.includes('espectador') || q.includes('barato') || q.includes('precio') || q.includes('tarifa')) {
        reply = `El tradicional **Día del Espectador** en España suele celebrarse los **miércoles** (en algunos cines independientes también los lunes). Por ejemplo:\n\n` +
          `• Cines Verdi: Miércoles a ~5,50€\n` +
          `• Cines Groucho / Babel / Albéniz: Sesiones a 4,50€ - 5,00€\n` +
          `• Filmotecas Oficiales (Cine Doré, Filmoteca de Catalunya, Rialto): Tarifas habituales de 2,50€ a 3,00€ toda la semana.\n\n` +
          `¡Aprovecha siempre estas promociones reservando con antelación!`;
      } else {
        reply = `Como amante del séptimo arte en ${activeCityOrProvince || 'España'}, te sugiero visitar cines que cuidan tanto la calidad de proyección como la atmósfera cinéfila. Te recomiendo explorar **${nearbyCinemas[0]?.name || 'el cine de autor de tu zona'}** para ver los estrenos de autor o consultar las sesiones de tarde noche para evitar aglomeraciones.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: reply,
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-[#141622] border-2 border-[#d4af37]/60 rounded-2xl shadow-2xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d2e40] bg-[#0e1018] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2b2210] to-[#141622] border border-[#d4af37]/50 flex items-center justify-center text-[#ffd97d]">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#f7ede1]">
                El Guía Cinéfilo & Proyeccionista
              </h3>
              <p className="text-xs text-[#a09d94]">
                Experto en salas, versiones VOSE, acústica y carteleras de España
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a1c28] text-[#8e8b83] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#201d16] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-1">
                  <Film className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#d4af37] text-[#0d0e12] font-medium shadow-md'
                    : 'bg-[#1a1c29] text-[#e0ded8] border border-[#2e3146]'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#201d16] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0">
                <Film className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#1a1c29] border border-[#2e3146] text-[#b8b5ad] rounded-xl p-3 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                <span>Consultando archivos cinematográficos y carteleras...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions chips */}
        <div className="px-4 py-2 bg-[#0e1018] border-t border-[#25283a] overflow-x-auto flex gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded bg-[#181a26] border border-[#2e3248] text-[#a09d94] hover:text-[#ffd97d] hover:border-[#d4af37]/50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-[#2d2e40] bg-[#10121c] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre cines, películas, VOSE o formatos..."
            className="flex-1 bg-[#181a28] border border-[#32364c] focus:border-[#d4af37] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#f0ede6] placeholder-[#6b6861] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ba9427] text-[#0d0e12] font-semibold hover:from-[#e3be44] hover:to-[#cda532] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Enviar consulta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
