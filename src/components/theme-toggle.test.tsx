import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from './theme-toggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })

  it('restores the stored theme and persists the next mode selected by the user', async () => {
    window.localStorage.setItem('theme', 'dark')
    const user = userEvent.setup()

    render(<ThemeToggle />)

    const toggle = await screen.findByRole('button', {
      name: /Theme mode: dark/,
    })
    expect(toggle).toHaveTextContent('Dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')

    await user.click(toggle)

    expect(
      screen.getByRole('button', { name: /Theme mode: auto/ }),
    ).toHaveTextContent('Auto')
    expect(window.localStorage.getItem('theme')).toBe('auto')
    expect(document.documentElement).not.toHaveAttribute('data-theme')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
