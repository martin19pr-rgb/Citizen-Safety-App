
"use client";

import React, { useState } from 'react';
import { GlassCard } from './glass-card';
import { MessageCircle, X, Send, Bot, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const EmergencyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'I am your Emergency AI Guardian. How can I assist you right now?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Analyzing your situation... I have alerted the nearest command center. Stay calm and follow standard safety protocols.' 
      }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 p-4 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-105 transition-transform z-40 glow-accent"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-6 bottom-32 top-20 z-50 md:left-auto md:right-6 md:w-96 flex flex-col"
          >
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-accent/20">
              <div className="p-4 border-b border-white/10 bg-accent/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Emergency AI</h3>
                    <p className="text-[10px] text-accent font-medium">Command System Linked</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed",
                    msg.role === 'assistant' ? "bg-white/5 text-white/80 self-start" : "bg-accent/20 text-white self-end border border-accent/20"
                  )}>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/5 flex gap-2">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for guidance..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 ring-accent"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
