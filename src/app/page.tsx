import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

const bars = [
  { i: 62, e: 28 },
  { i: 40, e: 34 },
  { i: 78, e: 30 },
  { i: 55, e: 46 },
  { i: 90, e: 38 },
  { i: 70, e: 26 },
];

const cats = [
  { n: 'Rent', p: 46, c: 'bg-emerald-500' },
  { n: 'Hostel', p: 28, c: 'bg-sky-500' },
  { n: 'Shopping', p: 16, c: 'bg-amber-500' },
  { n: 'Bills', p: 10, c: 'bg-fuchsia-500' },
];

const steps = [
  ['Sign up', 'Use Google, email, phone or continue as a guest.'],
  ['Add a transaction', 'Log income or an expense in a few seconds.'],
  ['See the picture', 'Charts and an AI summary show where your money went.'],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[#04110C]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 17l5-5 4 4 8-9" />
                <path d="M15 7h5v5" />
              </svg>
            </span>
            VERMA &amp; CO.
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              Login
            </Link>
            <Link href="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
          <div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Know where every rupee goes.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Track income and expenses, see your spending by category, and get a plain-language summary of your month.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Start tracking free
              </Link>
              <Link href="/login" className="rounded-xl border border-border bg-muted/60 px-6 py-3 font-semibold transition hover:bg-muted">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="hero-in relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-emerald-400/20 via-transparent to-violet-500/20 blur-2xl" />
            <div className="relative rounded-3xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur sm:p-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Income', '₹62,000', 'text-emerald-600 dark:text-emerald-400'],
                  ['Expenses', '₹14,077', 'text-rose-600 dark:text-rose-400'],
                  ['Balance', '₹47,923', 'text-foreground'],
                ].map(([l, v, c]) => (
                  <div key={l} className="rounded-2xl border border-border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className={`mt-1 text-base font-bold sm:text-xl ${c}`}>{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4">
                <div className="flex h-36 items-end justify-between gap-3">
                  {bars.map((b, k) => (
                    <div key={k} className="flex h-full flex-1 items-end gap-1">
                      <div className="bar-grow w-full rounded-t-md bg-emerald-500" style={{ height: `${b.i}%`, animationDelay: `${0.3 + k * 0.08}s` }} />
                      <div className="bar-grow w-full rounded-t-md bg-violet-500" style={{ height: `${b.e}%`, animationDelay: `${0.35 + k * 0.08}s` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" />Income</span>
                  <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-500" />Expense</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 rounded-2xl border border-border bg-muted/40 p-4">
                {cats.map((c) => (
                  <div key={c.n} className="flex items-center gap-3 text-sm">
                    <span className="w-16 text-foreground/80">{c.n}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className={`bar-wide h-full rounded-full ${c.c}`} style={{ width: `${c.p}%` }} />
                    </div>
                    <span className="w-9 text-right text-muted-foreground">{c.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to stay on top of your money</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-6">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-emerald-400/10 to-transparent p-7 md:col-span-4">
              <h3 className="text-xl font-semibold">Clear charts</h3>
              <p className="mt-2 max-w-md text-muted-foreground">Compare income and expenses over any date range, and see which category takes the biggest share.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7 md:col-span-2">
              <h3 className="text-xl font-semibold">AI summary</h3>
              <p className="mt-2 text-muted-foreground">One tap turns your recent transactions into a short written recap.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7 md:col-span-2">
              <h3 className="text-xl font-semibold">Monthly budgets</h3>
              <p className="mt-2 text-muted-foreground">Set a limit per category and carry unused amounts forward.</p>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-br from-violet-500/10 to-transparent p-7 md:col-span-4">
              <h3 className="text-xl font-semibold">Yours to keep</h3>
              <p className="mt-2 max-w-md text-muted-foreground">Export all your transaction data whenever you want, switch between light and dark, or delete your account in one place.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Up and running in a minute</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map(([t, d], k) => (
              <li key={t} className="rounded-3xl border border-border bg-card p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-600 dark:text-emerald-300">{k + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-1.5 text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 via-card to-violet-500/15 px-6 py-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with your next expense</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">Free to use. No card needed.</p>
            <Link href="/signup" className="mt-8 inline-block rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Create your account
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        ©️ 2026 VERMA &amp; CO. All rights reserved.
      </footer>
    </div>
  );
}
