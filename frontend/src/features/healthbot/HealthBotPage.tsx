import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import './HealthBotPage.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: Date;
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

const SUGGESTIONS = [
  'What is my wellness score?',
  'When is my next appointment?',
  'What does low iron mean during pregnancy?',
  'How do I use *961# for reminders?',
  'What are signs of malaria in children?',
  'ቀጠሮዬ መቼ ነው?',
];

const GREETING = (name: string) =>
  `ሰላም ${name}! 👋 I'm **TenaBot**, your CloudHeal AI health assistant.\n\nI can help you with:\n- Your health records and appointments\n- Wellness scores and risk factors\n- General health guidance (Amharic & English)\n- USSD *961# instructions\n\n*Remember: I'm not a doctor. Always consult a clinician for medical decisions.*\n\nHow can I help you today?`;

export const HealthBotPage: React.FC = () => {
  const { profile, session } = useAuthStore();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING(firstName), ts: new Date() },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    setInput('');
    setError(null);

    const userMsg: Message = { role: 'user', content, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API}/wellness/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          messages: history,
          patient_context: profile ? {
            name:       profile.full_name,
            fayda_id:   profile.fayda_id,
            region:     profile.region,
            role:       profile.role,
          } : undefined,
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, ts: new Date() }]);
    } catch {
      // Graceful offline fallback
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm currently unable to reach the AI service. 

For urgent health matters please call **907** (Ethiopia Emergency) or visit your nearest facility.

You can still:
- Check your records in **My Health**
- View appointments in **My Appointments**  
- Dial ***961#** on any phone for USSD access`,
        ts: new Date(),
      }]);
      setError('AI service offline — showing guided response');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  // Simple markdown bold renderer
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*'))
        return <em key={i}>{part.slice(1, -1)}</em>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="hb">
      {/* Header */}
      <div className="hb__header">
        <div className="hb__header-left">
          <div className="hb__bot-avatar">
            <Stethoscope size={20} />
          </div>
          <div>
            <h1>TenaBot</h1>
            <div className="hb__status">
              <span className="hb__status-dot" />
              AI Health Assistant · Amharic & English
            </div>
          </div>
        </div>
        <div className="hb__disclaimer">
          <AlertCircle size={13} />
          Not a substitute for professional medical advice
        </div>
      </div>

      {/* Messages */}
      <div className="hb__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`hb__msg hb__msg--${msg.role}`}>
            <div className="hb__msg-avatar">
              {msg.role === 'assistant'
                ? <Bot size={16} />
                : <User size={16} />}
            </div>
            <div className="hb__msg-bubble">
              <div className="hb__msg-content">
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} style={{ margin: line === '' ? '0.4rem 0' : '0 0 0.1rem' }}>
                    {renderContent(line)}
                  </p>
                ))}
              </div>
              <div className="hb__msg-time">
                {msg.ts.toLocaleTimeString('en-ET', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="hb__msg hb__msg--assistant">
            <div className="hb__msg-avatar"><Bot size={16} /></div>
            <div className="hb__msg-bubble hb__msg-bubble--typing">
              <Loader2 size={15} className="hb__typing-icon" />
              <span>TenaBot is thinking…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="hb__error">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only show at start */}
      {messages.length <= 1 && (
        <div className="hb__suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="hb__suggestion" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="hb__input-row" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="hb__input"
          placeholder="Ask TenaBot anything… (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          disabled={loading}
        />
        <button
          type="submit"
          className="hb__send"
          disabled={!input.trim() || loading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
