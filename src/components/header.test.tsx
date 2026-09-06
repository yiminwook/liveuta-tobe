import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Header from './Header'

function createTestRouter() {
  const rootRoute = createRootRoute({ component: Header })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })
  const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
  })

  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute, aboutRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

describe('Header', () => {
  it('offers application navigation and the external documentation link', async () => {
    const router = createTestRouter()

    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about',
    )
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://tanstack.com/start/latest/docs/framework/react/overview',
    )
  })
})
