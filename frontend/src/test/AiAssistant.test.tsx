import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AiAssistantPage } from '../features/ai-assistant/AiAssistantPage';
import { useAuthStore } from '../stores/authStore';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('SPENDX AI Financial Assistant Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    useAuthStore.getState().setToken('test-token');
    useAuthStore.getState().setUser({
      id: 'usr_shubham',
      email: 'shubham@spendx.app',
      fullName: 'Shubham',
      currency: 'INR',
    });

    localStorage.clear();
  });

  const renderAssistant = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/ai-assistant']}>
          <AiAssistantPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders AI Assistant header with title and status badge', () => {
    renderAssistant();
    expect(
      screen.getByRole('heading', { name: 'Your AI Financial Assistant', level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(/your money questions, answered intelligently/i)).toBeInTheDocument();
  });

  it('renders welcome screen with smart finance conversation messaging', () => {
    renderAssistant();
    expect(
      screen.getByRole('heading', {
        name: /your finances deserve smarter conversations/i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ask spendx anything about your money/i)
    ).toBeInTheDocument();
  });

  it('renders all suggested financial prompt cards', () => {
    renderAssistant();
    expect(screen.getByText('Analyze my spending this month')).toBeInTheDocument();
    expect(screen.getByText('Where is most of my money going?')).toBeInTheDocument();
    expect(screen.getByText('Am I within my monthly budget?')).toBeInTheDocument();
    expect(screen.getByText('Help me create a savings strategy')).toBeInTheDocument();
    expect(screen.getByText('Compare my income and expenses')).toBeInTheDocument();
    expect(screen.getByText('Find opportunities to reduce spending')).toBeInTheDocument();
  });

  it('allows user to type a message in composer and send it', async () => {
    renderAssistant();
    const input = screen.getByLabelText(/message input/i);
    const sendBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, {
      target: { value: 'How much money did I spend on food this month?' },
    });
    fireEvent.click(sendBtn);

    expect(
      await screen.findByText('How much money did I spend on food this month?')
    ).toBeInTheDocument();

    // Verify AI response arrives
    await waitFor(
      () => {
        expect(
          screen.getByText(/based on your verified financial ledger/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('triggers query when a suggested prompt card is clicked', async () => {
    renderAssistant();
    const promptBtn = screen.getByText('Am I within my monthly budget?');
    fireEvent.click(promptBtn);

    expect(
      await screen.findByText('Am I within my monthly budget?')
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByText(/budget adherence analysis/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('toggles conversation history sidebar and renders history items', () => {
    renderAssistant();
    const historyBtn = screen.getByRole('button', { name: /toggle conversation history/i });
    fireEvent.click(historyBtn);

    expect(screen.getByText('Conversation History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new conversation/i })).toBeInTheDocument();
  });
});
