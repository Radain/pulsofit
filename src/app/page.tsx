import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  Dumbbell,
  HeartPulse,
  TrendingUp,
} from "lucide-react";
import { LegalFooter } from "@/components/legal-footer";
import { SiteHeader } from "@/components/site-header";

const week = [
  ["Mon", "Lower Body", "Strength", true],
  ["Tue", "Upper Body", "Push", true],
  ["Wed", "Active", "Recovery", false],
  ["Thu", "Lower Body", "Power", false],
  ["Fri", "Upper Body", "Pull", false],
  ["Sat", "Conditioning", "HIIT", false],
  ["Sun", "Rest", "Day", false],
];

const features = [
  {
    icon: CalendarDays,
    title: "Smart Training Plans",
    body: "Adaptive weekly plans that fit your goals and schedule.",
  },
  {
    icon: Check,
    title: "Habit Tracking",
    body: "Build consistency with simple daily targets.",
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    body: "Visualize what matters and stay on track.",
  },
  {
    icon: HeartPulse,
    title: "Recovery Intelligence",
    body: "Understand readiness before you train hard.",
  },
];

function ProgressRing({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="grid h-20 w-20 place-items-center rounded-md"
        style={{
          background: `conic-gradient(${color} 0 78%, #ece7df 78% 100%)`,
        }}
      >
        <div className="grid h-[64px] w-[64px] place-items-center rounded-md bg-white text-lg font-semibold text-[#101418]">
          {value}
        </div>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#101418]">{label}</p>
        <p className="text-[11px] text-[#657168]">{detail}</p>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative rounded-md border border-[#e2ddd4] bg-white shadow-[0_24px_80px_rgba(36,31,23,0.09)]">
      <div className="grid min-h-[620px] overflow-hidden rounded-md lg:grid-cols-[150px_1fr] 2xl:grid-cols-[150px_1fr_260px]">
        <aside className="hidden border-r border-[#eee8df] p-5 lg:block">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold">
            <HeartPulse size={18} className="text-[#178a41]" />
            PulsoFit
          </div>
          {["Overview", "Workouts", "Plan", "Habits", "Progress", "Recovery"].map(
            (item, index) => (
              <div
                className={`mb-2 rounded-md px-3 py-3 text-xs ${
                  index === 0
                    ? "bg-[#edf6ef] font-semibold text-[#178a41]"
                    : "text-[#4d584f]"
                }`}
                key={item}
              >
                {item}
              </div>
            ),
          )}
        </aside>
        <section className="p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-[#101418]">Overview</p>
              <p className="text-sm text-[#657168]">May 12 - May 18</p>
            </div>
            <span className="rounded-md border border-[#e6e1d8] px-3 py-2 text-xs text-[#4d584f]">
              This week
            </span>
          </div>
          <div className="rounded-md border border-[#e6e1d8] p-4">
            <p className="mb-4 text-sm font-semibold">Weekly Plan</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {week.map(([day, main, sub, done], index) => (
                <div
                  className={`rounded-md border p-3 ${
                    index === 1
                      ? "border-[#178a41] bg-[#f3fbf5]"
                      : "border-[#eee8df]"
                  }`}
                  key={`${day}-${main}`}
                >
                  <p className="text-xs font-semibold text-[#101418]">{day}</p>
                  <p className="mt-4 text-xs text-[#101418]">{main}</p>
                  <p className="text-xs text-[#657168]">{sub}</p>
                  <span
                    className={`mt-4 block h-3 w-3 rounded-sm ${
                      done ? "bg-[#178a41]" : "border border-[#bfc6bf]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-[#e6e1d8] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Today&apos;s Workout</p>
                <span className="rounded-sm bg-[#f2eee7] px-2 py-1 text-[11px]">
                  Planned
                </span>
              </div>
              {["Barbell Bench Press", "Incline Dumbbell Press", "Overhead Press", "Cable Fly"].map(
                (item) => (
                  <div className="mb-3 flex items-center gap-3" key={item}>
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-[#f5f1ea] text-[#178a41]">
                      <Dumbbell size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold">{item}</p>
                      <p className="text-[11px] text-[#657168]">3 x 8-10</p>
                    </div>
                  </div>
                ),
              )}
              <Link
                href="/login"
                className="focus-ring mt-3 inline-flex h-10 items-center justify-center rounded-md bg-[#178a41] px-4 text-xs font-semibold text-white"
              >
                Open App
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-[#e6e1d8] p-4">
                <p className="mb-4 text-sm font-semibold">Progress</p>
                <div className="flex justify-between gap-3">
                  <ProgressRing
                    label="Workouts"
                    value="78%"
                    detail="5 / 6"
                    color="#178a41"
                  />
                  <ProgressRing
                    label="Sessions"
                    value="12"
                    detail="12 / 20"
                    color="#f07053"
                  />
                  <ProgressRing
                    label="Minutes"
                    value="245"
                    detail="245 / 300"
                    color="#f3ad3e"
                  />
                </div>
              </div>
              <div className="rounded-md border border-[#e6e1d8] p-4">
                <p className="mb-4 text-sm font-semibold">Habit Checklist</p>
                {["10k Steps", "Protein Goal", "Hydration", "Mobility"].map(
                  (item, index) => (
                    <div
                      className="mb-3 flex items-center justify-between text-xs"
                      key={item}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-sm ${
                            index < 3
                              ? "bg-[#178a41] text-white"
                              : "border border-[#cbd0c9]"
                          }`}
                        >
                          {index < 3 ? <Check size={11} /> : null}
                        </span>
                        {item}
                      </span>
                      <span className="text-[#657168]">{index < 3 ? "Done" : "0 / 10"}</span>
                    </div>
                  ),
                )}
              </div>
              <div className="rounded-md border border-[#e6e1d8] p-4 sm:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Workout Intensity</p>
                  <BarChart3 size={17} className="text-[#178a41]" />
                </div>
                <div className="flex h-28 items-end gap-2">
                  {[48, 66, 72, 43, 58, 76, 61, 70, 45].map((height, index) => (
                    <span
                      className="flex-1 rounded-sm bg-[#f07053]/70"
                      style={{ height: `${height}%` }}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <aside className="hidden border-t border-[#eee8df] p-5 lg:border-l lg:border-t-0 2xl:block">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="font-semibold">Upper Body Push</p>
              <p className="text-xs text-[#657168]">60 min · Strength</p>
            </div>
            <ArrowUpRight size={18} className="text-[#657168]" />
          </div>
          <Image
            src="/upper-body-focus.png"
            alt="Upper body muscle focus illustration"
            width={520}
            height={320}
            className="mb-5 h-40 w-full rounded-md border border-[#eee8df] object-cover"
            priority
          />
          <div className="rounded-md border border-[#e6e1d8] p-4">
            <p className="text-xs font-semibold">Recovery Score</p>
            <p className="mt-3 text-4xl font-semibold">82</p>
            <p className="text-sm text-[#657168]">Good. You are ready to perform.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <section className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-14 sm:px-8 lg:min-h-[760px] lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:py-12">
          <div className="max-w-[560px]">
            <p className="mb-6 text-sm font-semibold uppercase text-[#178a41]">
              Fitness intelligence for consistent athletes
            </p>
            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[0] text-[#101418] sm:text-7xl">
              Train smarter every week
            </h1>
            <p className="mt-7 text-xl leading-8 text-[#4d584f]">
              Adaptive workouts, habit tracking, and recovery signals in one
              focused fitness cockpit.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="focus-ring inline-flex h-14 items-center justify-center rounded-md bg-[#178a41] px-8 text-base font-semibold text-white shadow-[0_14px_34px_rgba(23,138,65,0.24)] transition hover:bg-[#0f6f32]"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="focus-ring inline-flex h-14 items-center justify-center rounded-md border border-[#d8d2c8] bg-white px-8 text-base font-semibold text-[#101418] transition hover:border-[#178a41]"
              >
                View pricing
              </Link>
            </div>
            <p className="mt-7 text-xl font-semibold text-[#101418]">
              14,99 EUR{" "}
              <span className="font-normal text-[#657168]">/ month</span>
            </p>
            <p className="mt-3 text-sm text-[#657168]">
              Free plan available. Annual Pro saves 15%.
            </p>
          </div>
          <DashboardPreview />
        </section>

        <section
          id="product"
          className="border-t border-[#e6e1d8] bg-white/62 px-5 py-16 sm:px-8"
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="text-center text-sm font-semibold uppercase text-[#178a41]">
              Built for progress
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl font-semibold leading-tight">
              Everything you need to improve, week after week.
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-4">
              {features.map((feature) => (
                <article
                  className="rounded-md border border-[#e6e1d8] bg-[#fbfaf6] p-6"
                  key={feature.title}
                >
                  <feature.icon className="mb-5 text-[#178a41]" size={24} />
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#657168]">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LegalFooter />
    </div>
  );
}
