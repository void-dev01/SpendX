import React, { useState, useEffect, useRef } from 'react';
import {
  aiAssistantService,
  ConversationRecord,
  ChatMessage,
} from '@/services/aiAssistantService';
import { AssistantHeader } from '@/components/ai-assistant/AssistantHeader';
import { ConversationSidebar } from '@/components/ai-assistant/ConversationSidebar';
import { ChatWelcome } from '@/components/ai-assistant/ChatWelcome';
import { ChatMessageItem } from '@/components/ai-assistant/ChatMessageItem';
import { TypingIndicator } from '@/components/ai-assistant/TypingIndicator';
import { MessageComposer } from '@/components/ai-assistant/MessageComposer';

export const AiAssistantPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [activeId, setActiveId] = useState<string>('conv-initial-welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const list = aiAssistantService.getConversations();
    const active = aiAssistantService.getActiveConversationId();
    setConversations(list);
    setActiveId(active);
  }, []);

  const activeConversation =
    conversations.find((c) => c.id === activeId) || conversations[0];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    aiAssistantService.setActiveConversationId(id);
  };

  const handleNewChat = () => {
    const newConv = aiAssistantService.createConversation();
    setConversations(aiAssistantService.getConversations());
    setActiveId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    const updated = aiAssistantService.deleteConversation(id);
    setConversations(updated);
    setActiveId(aiAssistantService.getActiveConversationId());
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toISOString(),
    };

    // 1. Append user message
    const convId = activeConversation ? activeConversation.id : activeId;
    const currentMessages = activeConversation ? [...activeConversation.messages, userMessage] : [userMessage];

    // Auto-title conversation from first user query
    const shouldRename =
      activeConversation &&
      (activeConversation.title === 'New Financial Chat' ||
        activeConversation.messages.length === 0);

    const updatedTitle = shouldRename
      ? queryText.length > 28
        ? `${queryText.slice(0, 26)}...`
        : queryText
      : activeConversation?.title || 'Financial Chat';

    const updatedList = aiAssistantService.updateConversation(convId, (conv) => ({
      ...conv,
      title: updatedTitle,
      messages: currentMessages,
    }));
    setConversations(updatedList);
    setIsLoading(true);

    // 2. Fetch AI response
    try {
      const history = currentMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await aiAssistantService.sendMessage(queryText, history);

      const assistantMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: result.answer,
        card: result.card,
        timestamp: new Date().toISOString(),
      };

      const finalUpdated = aiAssistantService.updateConversation(convId, (conv) => ({
        ...conv,
        messages: [...conv.messages, assistantMessage],
      }));
      setConversations(finalUpdated);
    } catch {
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content:
          'I encountered a communication timeout with the financial intelligence service. Please check your network and try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      const finalUpdated = aiAssistantService.updateConversation(convId, (conv) => ({
        ...conv,
        messages: [...conv.messages, errorMessage],
      }));
      setConversations(finalUpdated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const msgs = activeConversation?.messages || [];
    const lastUserMsg = [...msgs].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const isWelcomeScreen =
    !activeConversation ||
    activeConversation.messages.length === 0 ||
    (activeConversation.messages.length === 1 &&
      activeConversation.messages[0].id === 'msg-welcome-ai');

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <AssistantHeader
        onNewChat={handleNewChat}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 2. Workspace: Sidebar + Chat Panel */}
      <div className="flex gap-4 items-start min-h-[420px] sm:min-h-[540px]">
        {/* Conversation History Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          onDelete={handleDeleteConversation}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Chat Panel */}
        <div className="flex-1 glass-panel rounded-3xl p-3 sm:p-6 flex flex-col justify-between min-h-[420px] sm:min-h-[540px] h-[calc(100dvh-13rem)] relative overflow-hidden">
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar">
            {isWelcomeScreen ? (
              <ChatWelcome onSelectPrompt={handleSendMessage} />
            ) : (
              activeConversation.messages.map((m) => (
                <ChatMessageItem
                  key={m.id}
                  message={m}
                  onRetry={handleRetry}
                />
              ))
            )}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Composer */}
          <div className="pt-3 border-t border-slate-100/60 dark:border-white/5">
            <MessageComposer
              onSend={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
