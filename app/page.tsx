import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3, ArrowRight, PieChart, LineChart, DollarSign, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1">
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern z-0"></div>
        <div className="absolute top-0 z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))]"></div>
        <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Run Your Household Like a <span className="text-primary">Business</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                ValYou helps you track income, expenses, and your household profit margin—giving you the clarity of a CEO with tools built for your personal financial success.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row mt-4">
              <Link href="/sign-up">
                <Button size="lg" className="px-8 gap-2">
                  Maximize Your Value
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
                Financial Clarity
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Your Household Dashboard
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                More than just budgeting—ValYou gives you a clean, intuitive interface that works like a personal profit & loss statement, helping you measure progress and build financial resilience.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Profit Margin Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Value-Aligned Spending</span>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Financial Growth</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:justify-end">
              <div className="relative flex h-[350px] w-full items-center justify-center rounded-lg border bg-background p-8 shadow-md">
                <div className="absolute -top-3 -right-3 h-16 w-16 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="w-full max-w-sm space-y-5">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 rounded-md p-1.5 bg-primary/10 text-primary" />
                    <div className="space-y-0.5 flex-1">
                      <div className="h-4 w-2/3 rounded-full bg-muted"></div>
                      <div className="h-3 w-1/3 rounded-full bg-muted"></div>
                    </div>
                  </div>
                  <div className="h-40 w-full rounded-md bg-muted flex items-center justify-center">
                    <BarChart3 className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded-md bg-muted"></div>
                    <div className="h-10 rounded-md bg-muted"></div>
                    <div className="h-10 rounded-md bg-muted"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#303030_1px,transparent_1px),linear-gradient(to_bottom,#303030_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="mx-auto flex max-w-5xl flex-col items-center space-y-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Align Your Money With Your Values
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Create a financial plan that's not just smart—it's fulfilling. Connect your spending habits to what truly matters to you.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
              <Link href="/sign-up">
                <Button size="lg" className="px-8 gap-2">
                  Start Your Value Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 