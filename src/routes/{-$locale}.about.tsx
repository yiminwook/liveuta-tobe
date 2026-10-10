import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/{-$locale}/about')({
  component: About,
})

function About() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <section className="rounded-card border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">About</p>
        <h1 className="mb-3 text-4xl font-bold text-card-foreground sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-muted-foreground">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
