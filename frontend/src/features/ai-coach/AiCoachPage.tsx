import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Send } from 'lucide-react';
import { apiClient } from '@/services/api';

export const AiCoachPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await apiClient.post('/ai/coach', { query: userText });
      const answer = res.data?.data?.answer || 'Response received from SPENDX AI Core.';
      setMessages((prev) => [...prev, { sender: 'assistant', text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Backend service communication error. Ensure backend server is running on port 5000.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Financial Coach</h1>
        <p className="text-sm text-muted-foreground">
          Conversational financial guidance driven by Google Gemini models.
        </p>
      </div>

      <Card className="min-h-[480px] flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>SPENDX Intelligence Advisor</CardTitle>
          </div>
          <CardDescription>
            Ask questions regarding budget distribution, debt reduction strategies, and financial milestones.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary opacity-60" />
              <p className="text-sm">Start a conversation with your AI Financial Coach.</p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    m.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
        </CardContent>

        <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., How can I reduce my dining out expenses by 20%?"
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            <Send className="w-4 h-4 mr-1.5" />
            {loading ? 'Thinking...' : 'Send'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
