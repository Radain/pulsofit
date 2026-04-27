"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  LineChart,
  Lock,
  Play,
  Settings,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useMemo, useState } from "react";
import { plans } from "@/lib/plans";

type Workout = {
  name: string;
  day: string;
  focus: string;
  duration: string;
  intensity: number;
  done: boolean;
};

type Exercise = {
  name: string;
  sets: string;
  rpe: number;
};

const workouts: Workout[] = [
  {
    name: "Lower Body Strength",
    day: "Mon",
    focus: "Squat pattern",
    duration: "55 min",
    intensity: 64,
    done: true,
  },
  {
    name: "Upper Body Push",
    day: "Tue",
    focus: "Chest, shoulders, triceps",
    duration: "60 min",
    intensity: 72,
    done: false,
  },
  {
    name: "Active Recovery",
    day: "Wed",
    focus: "Mobility and zone 2",
    duration: "35 min",
    intensity: 38,
    done: false,
  },
  {
    name: "Lower Body Power",
    day: "Thu",
    focus: "Explosive strength",
    duration: "50 min",
    intensity: 76,
    done: false,
  },
  {
    name: "Upper Body Pull",
    day: "Fri",
    focus: "Back and biceps",
    duration: "58 min",
    intensity: 68,
    done: false,
  },
  {
    name: "Conditioning HIIT",
    day: "Sat",
    focus: "Intervals",
    duration: "32 min",
    intensity: 81,
    done: false,
  },
  {
    name: "Rest Day",
    day: "Sun",
    focus: "Sleep and walk",
    duration: "20 min",
    intensity: 18,
    done: false,
  },
];

const exercises: Exercise[] = [
  { name: "Barbell Bench Press", sets: "4 x 6-8", rpe: 7 },
  { name: "Incline Dumbbell Press", sets: "3 x 8-10", rpe: 7 },
  { name: "Overhead Press", sets: "3 x 6-8", rpe: 6 },
  { name: "Cable Fly", sets: "3 x 10-12", rpe: 6 },
  { name: "Triceps Pushdown", sets: "3 x 10-12", rpe: 7 },
];

const startingHabits = [
  { label: "10k Steps", detail: "12,450 steps", done: true },
  { label: "Protein Goal", detail: "125 / 120g", done: true },
  { label: "Hydration", detail: "2.4 / 2L", done: true },
  { label: "Mobility", detail: "0 / 10 min", done: false },
  { label: "No Alcohol", detail: "7 / 7 days", done: true },
];

const nav = [
  { label: "Overview", icon: Activity },
  { label: "Workouts", icon: Dumbbell },
  { label: "Plan", icon: CalendarDays },
  { label: "Habits", icon: ShieldCheck },
  { label: "Progress", icon: LineChart },
  { label: "Recovery", icon: HeartPulse },
  { label: "Settings", icon: Settings },
];

function ScoreRing({ value }: { value: number }) {
  return (
    <div
      className="mx-auto grid h-32 w-32 place-items-center rounded-md"
      style={{
        background: `conic-gradient(#178a41 0 ${value * 0.74}%, #f3ad3e ${
          value * 0.74
        }% ${value * 0.9}%, #f07053 ${value * 0.9}% 100%)`,
      }}
    >
      <div className="grid h-24 w-24 place-items-center rounded-md bg-white">
        <div className="text-center">
          <p className="text-3xl font-semibold">{value}</p>
          <p className="text-xs text-[#657168]">Good</p>
        </div>
      </div>
    </div>
  );
}

type DashboardAppProps = {
  initialMode?: "free" | "pro";
};

function AppWordmark() {
  return (
    <div className="inline-flex items-center gap-3 rounded-md" aria-label="PulsoFit app">
      <span className="grid h-9 w-9 place-items-center rounded-md border border-[#dce8de] bg-white text-[#178a41] shadow-sm">
        <Activity size={21} strokeWidth={2.2} />
      </span>
      <span className="text-xl font-semibold tracking-[0] text-[#101418]">
        PulsoFit
      </span>
    </div>
  );
}

export function DashboardApp({ initialMode = "free" }: DashboardAppProps) {
  const [mode, setMode] = useState<"free" | "pro">(initialMode);
  const [selected, setSelected] = useState(1);
  const [habits, setHabits] = useState(startingHabits);
  const [started, setStarted] = useState(false);

  const isFree = mode === "free";
  const workoutLimit = isFree
    ? plans.free.weeklyWorkoutLimit
    : plans.proMonthly.weeklyWorkoutLimit;
  const habitLimit = isFree ? plans.free.habitLimit : plans.proMonthly.habitLimit;
  const activeSelected = selected >= workoutLimit ? 0 : selected;
  const selectedWorkout = workouts[activeSelected];
  const activeHabits = habits.slice(0, habitLimit);
  const completedHabits = activeHabits.filter((habit) => habit.done).length;

  const readiness = useMemo(() => {
    const habitBoost = completedHabits * 3;
    const loadPenalty = Math.round(selectedWorkout.intensity / 12);
    return Math.min(96, 72 + habitBoost - loadPenalty);
  }, [completedHabits, selectedWorkout.intensity]);

  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr_330px]">
        <aside className="border-b border-[#e6e1d8] bg-white/78 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between lg:block">
            <AppWordmark />
            <Link
              href="/pricing"
              className="focus-ring rounded-md bg-[#178a41] px-4 py-2 text-sm font-semibold text-white lg:hidden"
            >
              Upgrade
            </Link>
          </div>
          <nav className="mt-8 hidden lg:block">
            {nav.map((item, index) => (
              <button
                className={`focus-ring mb-2 flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                  index === 0
                    ? "bg-[#edf6ef] font-semibold text-[#178a41]"
                    : "text-[#4d584f] hover:bg-[#f6f1ea]"
                }`}
                key={item.label}
                type="button"
              >
                <item.icon size={17} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 hidden rounded-md border border-[#e6e1d8] bg-[#fbfaf6] p-4 lg:block">
            <p className="text-sm font-semibold">
              {isFree ? "Free plan limits" : "PulsoFit Pro"}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#657168]">
              {isFree
                ? "Free includes 3 workouts, 3 habits, and basic tracking. Upgrade when you want the full weekly plan."
                : "Adaptive weekly plans, recovery signals, and coaching insights are active."}
            </p>
            <Link
              href="/pricing"
              className="focus-ring mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#178a41] text-sm font-semibold text-white"
            >
              Upgrade options
            </Link>
          </div>
          <Link
            href="/login"
            className="focus-ring mt-4 hidden h-10 w-full items-center justify-center rounded-md border border-[#d8d2c8] bg-white text-sm font-semibold lg:inline-flex"
          >
            Sign out
          </Link>
        </aside>

        <main className="p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-[#178a41]">
                App workspace
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[0] text-[#101418]">
                Training cockpit
              </h1>
              <p className="mt-3 max-w-2xl text-[#657168]">
                Pick the workout, check today&apos;s habits, and keep the whole
                training flow away from the public website.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid grid-cols-2 rounded-md border border-[#d8d2c8] bg-white p-1">
                {(["free", "pro"] as const).map((item) => (
                  <button
                    className={`focus-ring h-9 rounded-sm px-4 text-sm font-semibold transition ${
                      mode === item
                        ? "bg-[#178a41] text-white"
                        : "text-[#4d584f] hover:bg-[#f6f1ea]"
                    }`}
                    key={item}
                    onClick={() => setMode(item)}
                    type="button"
                  >
                    {item === "free" ? "Free" : "Pro preview"}
                  </button>
                ))}
              </div>
              <span className="inline-flex h-11 items-center justify-center rounded-md border border-[#d8d2c8] bg-white px-4 text-sm font-semibold text-[#4d584f]">
                {isFree ? "Free account" : "Pro account"}
              </span>
            </div>
          </div>

          <section className="mt-8 rounded-md border border-[#e6e1d8] bg-white p-4 shadow-[0_18px_70px_rgba(36,31,23,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Weekly Plan</h2>
                <p className="text-sm text-[#657168]">May 12 - May 18</p>
              </div>
              <span className="rounded-md border border-[#e6e1d8] px-3 py-2 text-xs text-[#4d584f]">
                This week
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
              {workouts.map((workout, index) => {
                const locked = index >= workoutLimit;

                return (
                  <button
                    className={`focus-ring rounded-md border p-4 text-left transition ${
                      locked
                        ? "border-[#eee8df] bg-[#fbfaf6] opacity-75"
                        : activeSelected === index
                          ? "border-[#178a41] bg-[#f2fbf4] shadow-[0_10px_24px_rgba(23,138,65,0.12)]"
                          : "border-[#eee8df] bg-white hover:border-[#a9d3b6]"
                    }`}
                    disabled={locked}
                    key={workout.day}
                    onClick={() => setSelected(index)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{workout.day}</p>
                      {locked ? (
                        <Lock size={14} className="text-[#9aa39b]" />
                      ) : (
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-sm ${
                            workout.done
                              ? "bg-[#178a41] text-white"
                              : "border border-[#c9d0ca]"
                          }`}
                        >
                          {workout.done ? <Check size={11} /> : null}
                        </span>
                      )}
                    </div>
                    <p className="mt-5 text-sm font-semibold">{workout.name}</p>
                    <p className="mt-1 text-xs text-[#657168]">
                      {locked ? "Pro unlock" : workout.focus}
                    </p>
                    <div className="mt-5 h-1.5 rounded-sm bg-[#eee8df]">
                      <span
                        className={`block h-full rounded-sm ${
                          locked ? "bg-[#d8d2c8]" : "bg-[#f07053]"
                        }`}
                        style={{ width: `${locked ? 28 : workout.intensity}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            {isFree ? (
              <p className="mt-4 rounded-md bg-[#edf6ef] p-3 text-sm text-[#2e6f43]">
                Free mode keeps the first 3 weekly workouts usable. Pro unlocks
                the complete seven-day plan and adaptive adjustments.
              </p>
            ) : null}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Today&apos;s Workout</h2>
                  <p className="text-sm text-[#657168]">{selectedWorkout.name}</p>
                </div>
                <span className="rounded-sm bg-[#f5f1ea] px-2 py-1 text-xs">
                  {started ? "In progress" : "Planned"}
                </span>
              </div>
              {exercises.map((exercise) => (
                <div
                  className="mb-3 flex items-center justify-between rounded-md border border-[#eee8df] p-3"
                  key={exercise.name}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-[#f5f1ea] text-[#178a41]">
                      <Dumbbell size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{exercise.name}</p>
                      <p className="text-xs text-[#657168]">{exercise.sets}</p>
                    </div>
                  </div>
                  <span className="rounded-sm bg-[#f2eee7] px-2 py-1 text-xs">
                    RPE {exercise.rpe}
                  </span>
                </div>
              ))}
              <button
                className="focus-ring mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#178a41] text-sm font-semibold text-white transition hover:bg-[#0f6f32]"
                onClick={() => setStarted((value) => !value)}
                type="button"
              >
                <Play size={16} />
                {started ? "Pause Workout" : "Start Workout"}
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Habit Checklist</h2>
                <p className="mt-1 text-sm text-[#657168]">
                  {completedHabits} of {habitLimit} active habits complete
                </p>
                <div className="mt-5 space-y-3">
                  {habits.map((habit, index) => {
                    const locked = index >= habitLimit;

                    return (
                      <button
                        className={`focus-ring flex w-full items-center justify-between rounded-md border border-[#eee8df] p-3 text-left ${
                          locked ? "bg-[#fbfaf6] opacity-75" : "bg-white"
                        }`}
                        disabled={locked}
                        key={habit.label}
                        onClick={() =>
                          setHabits((items) =>
                            items.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, done: !item.done }
                                : item,
                            ),
                          )
                        }
                        type="button"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-sm ${
                              locked
                                ? "border border-[#d8d2c8]"
                                : habit.done
                                  ? "bg-[#178a41] text-white"
                                  : "border border-[#cbd0c9]"
                            }`}
                          >
                            {locked ? (
                              <Lock size={12} />
                            ) : habit.done ? (
                              <Check size={13} />
                            ) : null}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">
                              {habit.label}
                            </span>
                            <span className="text-xs text-[#657168]">
                              {locked ? "Pro habit" : habit.detail}
                            </span>
                          </span>
                        </span>
                        <ChevronRight size={16} className="text-[#9aa39b]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Recovery Score</h2>
                <p className="mt-1 text-sm text-[#657168]">
                  {isFree
                    ? "Preview only in Free. Upgrade for adaptive recovery guidance."
                    : "Updates when habits or workout load change."}
                </p>
                <div className="mt-6">
                  {isFree ? (
                    <div className="mx-auto grid h-32 w-32 place-items-center rounded-md border border-[#e6e1d8] bg-[#fbfaf6]">
                      <Lock size={28} className="text-[#657168]" />
                    </div>
                  ) : (
                    <ScoreRing value={readiness} />
                  )}
                </div>
                <p className="mt-5 text-center text-sm text-[#657168]">
                  {isFree
                    ? "Basic habit tracking remains usable. Pro turns this into daily training guidance."
                    : "You are ready to perform. Keep tempo controlled and full range of motion."}
                </p>
              </div>

              <div className="rounded-md border border-[#e6e1d8] bg-white p-5 sm:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Workout Intensity</h2>
                    <p className="text-sm text-[#657168]">Seven-day training load</p>
                  </div>
                  <Flame size={19} className="text-[#f07053]" />
                </div>
                <div className="flex h-44 items-end gap-3">
                  {workouts.map((workout, index) => (
                    <button
                      className="focus-ring flex h-full flex-1 flex-col items-center justify-end gap-2 disabled:opacity-50"
                      disabled={index >= workoutLimit}
                      key={workout.day}
                      onClick={() => setSelected(index)}
                      type="button"
                    >
                      <span
                        className={`w-full rounded-sm transition ${
                          activeSelected === index
                            ? "bg-[#178a41]"
                            : "bg-[#f07053]/75"
                        }`}
                        style={{ height: `${Math.max(12, workout.intensity)}%` }}
                      />
                      <span className="text-xs text-[#657168]">{workout.day}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="border-t border-[#e6e1d8] bg-white/82 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold">{selectedWorkout.name}</p>
              <p className="mt-1 text-sm text-[#657168]">
                {selectedWorkout.duration} - {selectedWorkout.focus}
              </p>
            </div>
            <Timer size={21} className="text-[#178a41]" />
          </div>
          <div className="mt-6 h-56 rounded-md border border-[#eee8df] bg-[#f2f7f0] p-4">
            <div className="grid h-full place-items-center rounded-sm border border-[#d9e7da] bg-white/72">
              <div className="text-center">
                <Dumbbell className="mx-auto text-[#178a41]" size={36} />
                <p className="mt-3 text-sm font-semibold">Upper body focus</p>
                <p className="mt-1 text-xs text-[#657168]">
                  Strength pattern and push volume
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-[#e6e1d8] bg-[#fbfaf6] p-4">
            <p className="text-sm font-semibold">Workout Notes</p>
            <p className="mt-2 text-sm leading-6 text-[#657168]">
              Focus on controlled tempo and full range of motion. If recovery
              drops below 70, reduce top-set intensity by one RPE.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {exercises.map((exercise) => (
              <div
                className="flex items-center justify-between rounded-md border border-[#eee8df] bg-white p-3"
                key={exercise.name}
              >
                <div>
                  <p className="text-sm font-semibold">{exercise.name}</p>
                  <p className="text-xs text-[#657168]">
                    {exercise.sets} - RPE {exercise.rpe}
                  </p>
                </div>
                <ArrowRight size={15} className="text-[#9aa39b]" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
