import { useEffect, useState } from 'react'

const themes = [
  { id: 'theme1', label: 'Theme 1 · Pink' },
  { id: 'theme2', label: 'Theme 2 · Green' },
  { id: 'theme3', label: 'Theme 3 · Sky' },
  { id: 'theme4', label: 'Theme 4 · Night' },
  { id: 'theme5', label: 'Theme 5 · Red' },
] as const

type Theme = (typeof themes)[number]['id']

function isTheme(value: string | null): value is Theme {
  return themes.some((theme) => theme.id === value)
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark = theme === 'theme4' || theme === 'theme5'

  root.setAttribute('color', theme)
  root.classList.toggle('dark', isDark)
  root.classList.toggle('light', !isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('theme1')

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const initialTheme = isTheme(stored) ? stored : 'theme1'

    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  function handleThemeChange(value: string) {
    if (!isTheme(value)) return

    setTheme(value)
    applyTheme(value)
    window.localStorage.setItem('theme', value)
  }

  return (
    <label className="sr-only" htmlFor="theme-select">
      Theme
      <select
        id="theme-select"
        aria-label="Theme"
        value={theme}
        onChange={(event) => handleThemeChange(event.currentTarget.value)}
        className="not-sr-only rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
      >
        {themes.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
