import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChatMessage, getAiProvider, sendChatMessage } from '@/lib/aiClient';

const WELCOME = "Hi! I'm your CloudVR tour guide. Ask me about destinations, VR tours, or tips!";

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'You are a friendly tour guide for a VR travel website called CloudVR Tours. Be concise and helpful.' },
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const provider = useMemo(() => getAiProvider(), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const onSend = async () => {
    const question = input.trim();
    if (!question || loading) return;
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const reply = await sendChatMessage(next);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error answering. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSend();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary text-primary-foreground p-4 shadow-lg hover:shadow-xl focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw]"
          >
            <Card className="border shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur">
                <div className="font-semibold">Tour Guide Assistant</div>
                <div className="text-xs text-muted-foreground">Provider: {provider}</div>
                <button aria-label="Close chat" className="p-1 hover:opacity-80" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-muted/20">
                {messages
                  .filter(m => m.role !== 'system')
                  .map((m, idx) => (
                    <div key={idx} className={m.role === 'assistant' ? 'text-sm bg-background border rounded-lg p-3' : 'text-sm bg-primary text-primary-foreground rounded-lg p-3 ml-auto max-w-[85%]'}>
                      {m.content}
                    </div>
                  ))}
                {loading && (
                  <div className="text-sm text-muted-foreground">Thinking…</div>
                )}
                <div ref={endRef} />
              </div>

              <div className="flex items-center gap-2 p-3 border-t">
                <Input
                  placeholder="Ask about tours, tips, or help…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <Button onClick={onSend} disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;


