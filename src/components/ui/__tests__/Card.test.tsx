import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Card from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies padding class', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('card-padding-lg');
  });

  it('handles click when onClick is provided', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('adds hoverable class', () => {
    const { container } = render(<Card hoverable>Hover me</Card>);
    expect(container.firstChild).toHaveClass('card-hoverable');
  });
});
