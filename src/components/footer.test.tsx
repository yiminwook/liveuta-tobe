import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './footer'

describe('Footer', () => {
  it('exposes the TanStack social destinations with accessible names', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Follow TanStack on X' }),
    ).toHaveAttribute('href', 'https://x.com/tan_stack')
    expect(
      screen.getByRole('link', { name: 'Go to TanStack GitHub' }),
    ).toHaveAttribute('href', 'https://github.com/TanStack')
  })
})
