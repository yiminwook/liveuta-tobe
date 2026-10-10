import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-14 pb-8">
      <section className="relative overflow-hidden rounded-panel border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-20 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_66%)]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_70%,transparent),transparent_66%)]" />
        <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">TanStack Start Base Template</p>
        <h1 className="mb-5 max-w-3xl text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-6xl">
          Start simple, ship quickly.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          This base starter intentionally keeps things light: two routes, clean
          structure, and the essentials you need to build from scratch.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/about"
            className="rounded-control border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary no-underline transition-colors hover:bg-primary/20"
          >
            About This Starter
          </a>
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-control border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Router Guide
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Type-Safe Routing',
            'Routes and links stay in sync across every page.',
          ],
          [
            'Server Functions',
            'Call server code from your UI without creating API boilerplate.',
          ],
          [
            'Streaming by Default',
            'Ship progressively rendered responses for faster experiences.',
          ],
          [
            'Tailwind Native',
            'Design quickly with utility-first styling and reusable tokens.',
          ],
        ].map(([title, desc]) => (
          <article
            key={title}
            className="rounded-card border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="mb-2 text-base font-semibold text-card-foreground">
              {title}
            </h2>
            <p className="m-0 text-sm text-muted-foreground">{desc}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-card border border-border bg-card p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/header.tsx</code> and{' '}
            <code>src/components/footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{' '}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>
    </main>
  )
}
