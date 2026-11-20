import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  aiAssistantService,
  ConversationRecord,
  ChatMessage,
  DailyQuotaInfo,
  QueuedMessageRecord,
} from '@/services/aiAssistantService';
import { AssistantHeader } from '@/components/ai-assistant/AssistantHeader';
import { ConversationSidebar } from '@/components/ai-assistant/ConversationSidebar';
import { ChatWelcome } from '@/components/ai-assistant/ChatWelcome';
import { ChatMessageItem } from '@/components/ai-assistant/ChatMessageItem';
import { TypingIndicator } from '@/components/ai-assistant/TypingIndicator';
import { MessageComposer } from '@/components/ai-assistant/MessageComposer';
import { QueuedMessagesModal } from '@/components/ai-assistant/QueuedMessagesModal';

export const AiAssistantPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [activeId, setActiveId] = useState<string>('conv-initial-welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quota, setQuota] = useState<DailyQuotaInfo | null>(null);
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessageRecord[]>([]);
  const [isQueuedModalOpen, setIsQueuedModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and daily quota on mount
  useEffect(() => {
    const list = aiAssistantService.getConversations();
    const active = aiAssistantService.getActiveConversationId();
    setConversations(list);
    setActiveId(active);

    aiAssistantService.getDailyQuota().then(setQuota).catch(() => {});
    aiAssistantService.getQueuedMessages().then(setQueuedMessages).catch(() => {});
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

  const handleQueueMessage = async (queryText: string) => {
    if (!queryText.trim()) return;
    try {
      const convId = activeConversation ? activeConversation.id : activeId;
      await aiAssistantService.queueMessage(queryText, convId);
      const updatedList = await aiAssistantService.getQueuedMessages();
      setQueuedMessages(updatedList);
      toast.success('Inquiry scheduled for tomorrow (12:00 AM UTC)!');
    } catch {
      toast.error('Failed to schedule message.');
    }
  };

  const handleUpdateQueued = async (id: string, newText: string) => {
    await aiAssistantService.updateQueuedMessage(id, newText);
    const updated = await aiAssistantService.getQueuedMessages();
    setQueuedMessages(updated);
    toast.success('Queued inquiry updated.');
  };

  const handleCancelQueued = async (id: string) => {
    await aiAssistantService.cancelQueuedMessage(id);
    const updated = await aiAssistantService.getQueuedMessages();
    setQueuedMessages(updated);
    toast.info('Queued inquiry cancelled.');
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    if (quota?.isLimitReached) {
      toast.warning('Daily 200 message quota reached. Please queue your message for tomorrow.');
      return;
    }

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

      if (result.quota) {
        setQuota(result.quota);
      } else {
        aiAssistantService.getDailyQuota().then(setQuota).catch(() => {});
      }

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
    } catch (err: any) {
      if (err?.isQuotaReached) {
        setQuota(err.quota || { limit: 200, used: 200, remaining: 0, resetAt: '', isLimitReached: true });
        const quotaMessage: ChatMessage = {
          id: `msg_quota_${Date.now()}`,
          role: 'assistant',
          content:
            'You have reached your daily allowance of **200 messages**. Your limit resets automatically tonight at midnight UTC.\n\nWould you like to **Queue this message for tomorrow**? Simply enter your query below and tap **Queue for Tomorrow**.',
          timestamp: new Date().toISOString(),
          isError: true,
        };
        const finalUpdated = aiAssistantService.updateConversation(convId, (conv) => ({
          ...conv,
          messages: [...conv.messages, quotaMessage],
        }));
        setConversations(finalUpdated);
      } else {
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
      }
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
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Unified AI Workspace: Sidebar + Single Unified Chat Card */}
      <div className="flex gap-4 items-stretch h-[calc(100dvh-7.5rem)] min-h-[560px]">
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

        {/* Unified All-In-One Chat Card (Merged Header, Message Stream & Composer) */}
        <div className="flex-1 rounded-[22px] bg-surface border border-border flex flex-col justify-between h-full relative overflow-hidden shadow-card">
          {/* Integrated Header Toolbar */}
          <AssistantHeader
            onNewChat={handleNewChat}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            quota={quota || undefined}
            queuedCount={queuedMessages.length}
            onOpenQueuedModal={() => setIsQueuedModalOpen(true)}
            className="px-4 py-3 shrink-0"
          />

          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 no-scrollbar">
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

          {/* Integrated Composer */}
          <div className="p-3 sm:p-4 border-t border-border bg-surface-elevated/20 shrink-0">
            <MessageComposer
              onSend={handleSendMessage}
              isLoading={isLoading}
              isLimitReached={quota?.isLimitReached ?? false}
              onQueueMessage={handleQueueMessage}
            />
          </div>
        </div>
      </div>

      {/* Queued Messages Modal */}
      <QueuedMessagesModal
        isOpen={isQueuedModalOpen}
        onClose={() => setIsQueuedModalOpen(false)}
        queuedMessages={queuedMessages}
        onUpdateMessage={handleUpdateQueued}
        onCancelMessage={handleCancelQueued}
      />
    </div>
  );
};
