import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('SPENDX Frontend Application', () => {
  it('renders SPENDX Brand and Financial Overview', () => {
    render(<App />);
    expect(screen.getAllByText('SPENDX').length).toBeGreaterThan(0);
    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
  });
});
