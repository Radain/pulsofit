"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  CalendarDays,
  Check,
  ClipboardList,
  Dumbbell,
  Flame,
  HeartPulse,
  LineChart,
  Lock,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Timer,
  Trash2,
  Weight,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { insforge } from "@/lib/insforge";
import { plans } from "@/lib/plans";
import { ensurePulsoFitAccount } from "@/lib/pulsofit-account";

type PlanMode = "free" | "pro";
type View = "overview" | "workouts" | "habits" | "progress" | "recovery" | "settings";

type DbWorkout = {
  id: string;
  user_id: string;
  title: string;
  scheduled_for: string;
  focus: string;
  duration_minutes: number;
  intensity: number;
  completed: boolean;
  notes: string | null;
};

type DbHabit = {
  id: string;
  user_id: string;
  label: string;
  target: string;
  current_value: string;
  completed: boolean;
  sort_order: number;
};

type ProgressEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  weight_kg: number | null;
  readiness: number | null;
  training_minutes: number;
  notes: string | null;
};

type Profile = {
  plan: PlanMode;
};

type WorkoutForm = {
  title: string;
  scheduled_for: string;
  focus: string;
  duration_minutes: string;
  intensity: string;
  notes: string;
};

type HabitForm = {
  label: string;
  target: string;
};

type ProgressForm = {
  entry_date: string;
  weight_kg: string;
  readiness: string;
  training_minutes: string;
  notes: string;
};

type DashboardAppProps = {
  initialMode?: PlanMode;
};

const nav: { id: View; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "habits", label: "Habits", icon: ShieldCheck },
  { id: "progress", label: "Progress", icon: LineChart },
  { id: "recovery", label: "Recovery", icon: HeartPulse },
  { id: "settings", label: "Settings", icon: Settings },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(date));
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function weekKey(date: string) {
  const value = new Date(date);
  const monday = new Date(value);
  const day = (value.getDay() + 6) % 7;
  monday.setDate(value.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

function emptyWorkoutForm(): WorkoutForm {
  return {
    title: "",
    scheduled_for: todayIso(),
    focus: "",
    duration_minutes: "45",
    intensity: "55",
    notes: "",
  };
}

function emptyProgressForm(): ProgressForm {
  return {
    entry_date: todayIso(),
    weight_kg: "",
    readiness: "75",
    training_minutes: "0",
    notes: "",
  };
}

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

function ScoreRing({ value, locked }: { value: number; locked: boolean }) {
  if (locked) {
    return (
      <div className="mx-auto grid h-32 w-32 place-items-center rounded-md border border-[#e6e1d8] bg-[#fbfaf6]">
        <Lock size={28} className="text-[#657168]" />
      </div>
    );
  }

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
          <p className="text-xs text-[#657168]">Readiness</p>
        </div>
      </div>
    </div>
  );
}

export function DashboardApp({ initialMode = "free" }: DashboardAppProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>("overview");
  const [mode, setMode] = useState<PlanMode>(initialMode);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [workouts, setWorkouts] = useState<DbWorkout[]>([]);
  const [habits, setHabits] = useState<DbHabit[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>(emptyWorkoutForm());
  const [habitForm, setHabitForm] = useState<HabitForm>({ label: "", target: "" });
  const [progressForm, setProgressForm] = useState<ProgressForm>(emptyProgressForm());

  const isFree = mode === "free";
  const workoutLimit = isFree
    ? plans.free.weeklyWorkoutLimit
    : plans.proMonthly.weeklyWorkoutLimit;
  const habitLimit = isFree ? plans.free.habitLimit : plans.proMonthly.habitLimit;

  const visibleHabits = habits.slice(0, habitLimit);
  const completedHabits = visibleHabits.filter((habit) => habit.completed).length;
  const selectedWorkout =
    workouts.find((workout) => workout.id === selectedWorkoutId) ?? workouts[0] ?? null;
  const currentWeek = weekKey(todayIso());
  const currentWeekWorkouts = workouts.filter(
    (workout) => weekKey(workout.scheduled_for) === currentWeek,
  );
  const weeklyMinutes = currentWeekWorkouts
    .filter((workout) => workout.completed)
    .reduce((total, workout) => total + workout.duration_minutes, 0);
  const latestProgress = progressEntries[0] ?? null;

  const readiness = useMemo(() => {
    if (latestProgress?.readiness) {
      return latestProgress.readiness;
    }

    const habitBoost = completedHabits * 5;
    const loadPenalty = Math.round((selectedWorkout?.intensity ?? 45) / 14);
    return Math.max(40, Math.min(96, 70 + habitBoost - loadPenalty));
  }, [completedHabits, latestProgress, selectedWorkout]);

  async function loadFitnessData(activeUserId: string) {
    const [workoutsResult, habitsResult, progressResult] = await Promise.all([
      insforge.database
        .from("workouts")
        .select("*")
        .eq("user_id", activeUserId)
        .order("scheduled_for", { ascending: true }),
      insforge.database
        .from("habits")
        .select("*")
        .eq("user_id", activeUserId)
        .order("sort_order", { ascending: true }),
      insforge.database
        .from("progress_entries")
        .select("*")
        .eq("user_id", activeUserId)
        .order("entry_date", { ascending: false })
        .limit(12),
    ]);

    if (workoutsResult.error || habitsResult.error || progressResult.error) {
      throw workoutsResult.error ?? habitsResult.error ?? progressResult.error;
    }

    const nextWorkouts = (workoutsResult.data ?? []) as DbWorkout[];
    setWorkouts(nextWorkouts);
    setHabits((habitsResult.data ?? []) as DbHabit[]);
    setProgressEntries((progressResult.data ?? []) as ProgressEntry[]);
    setSelectedWorkoutId((current) => current || nextWorkouts[0]?.id || "");
  }

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      const { data, error } = await insforge.auth.getCurrentUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      await ensurePulsoFitAccount(data.user);

      const { data: profile } = await insforge.database
        .from("profiles")
        .select("plan")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!mounted) {
        return;
      }

      setUserId(data.user.id);
      setUserEmail(data.user.email);
      setMode(((profile as Profile | null)?.plan ?? "free") === "pro" ? "pro" : "free");
      await loadFitnessData(data.user.id);

      if (mounted) {
        setIsLoadingAccount(false);
      }
    }

    loadAccount().catch((error) => {
      console.error(error);
      router.replace("/login");
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    await insforge.auth.signOut();
    router.push("/login");
  }

  function clearMessages() {
    setErrorMessage("");
    setStatusMessage("");
  }

  async function addWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    const weekCount = workouts.filter(
      (workout) => weekKey(workout.scheduled_for) === weekKey(workoutForm.scheduled_for),
    ).length;

    if (weekCount >= workoutLimit) {
      setErrorMessage(
        isFree
          ? "Free allows 3 workouts per week. Upgrade to plan the full week."
          : "You have reached the weekly workout limit.",
      );
      return;
    }

    setIsSaving(true);
    const { data, error } = await insforge.database
      .from("workouts")
      .insert({
        user_id: userId,
        title: workoutForm.title,
        scheduled_for: workoutForm.scheduled_for,
        focus: workoutForm.focus,
        duration_minutes: Number(workoutForm.duration_minutes),
        intensity: Number(workoutForm.intensity),
        notes: workoutForm.notes || null,
      })
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const nextWorkout = data as DbWorkout;
    setWorkouts((items) =>
      [...items, nextWorkout].sort((a, b) =>
        a.scheduled_for.localeCompare(b.scheduled_for),
      ),
    );
    setSelectedWorkoutId(nextWorkout.id);
    setWorkoutForm(emptyWorkoutForm());
    setStatusMessage("Workout added.");
  }

  async function toggleWorkout(workout: DbWorkout) {
    clearMessages();
    const completed = !workout.completed;
    setWorkouts((items) =>
      items.map((item) => (item.id === workout.id ? { ...item, completed } : item)),
    );

    const { error } = await insforge.database
      .from("workouts")
      .update({ completed })
      .eq("id", workout.id);

    if (error) {
      setErrorMessage(error.message);
      await loadFitnessData(userId);
    }
  }

  async function deleteWorkout(workoutId: string) {
    clearMessages();
    const previous = workouts;
    setWorkouts((items) => items.filter((item) => item.id !== workoutId));

    const { error } = await insforge.database
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) {
      setErrorMessage(error.message);
      setWorkouts(previous);
    }
  }

  async function addHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();

    if (habits.length >= habitLimit) {
      setErrorMessage(
        isFree ? "Free allows 3 active habits. Upgrade to track more." : "Habit limit reached.",
      );
      return;
    }

    setIsSaving(true);
    const { data, error } = await insforge.database
      .from("habits")
      .insert({
        user_id: userId,
        label: habitForm.label,
        target: habitForm.target,
        current_value: "",
        completed: false,
        sort_order: habits.length + 1,
      })
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setHabits((items) => [...items, data as DbHabit]);
    setHabitForm({ label: "", target: "" });
    setStatusMessage("Habit added.");
  }

  async function updateHabit(habit: DbHabit, values: Partial<DbHabit>) {
    clearMessages();
    setHabits((items) =>
      items.map((item) => (item.id === habit.id ? { ...item, ...values } : item)),
    );

    const { error } = await insforge.database
      .from("habits")
      .update(values)
      .eq("id", habit.id);

    if (error) {
      setErrorMessage(error.message);
      await loadFitnessData(userId);
    }
  }

  async function deleteHabit(habitId: string) {
    clearMessages();
    const previous = habits;
    setHabits((items) => items.filter((item) => item.id !== habitId));

    const { error } = await insforge.database.from("habits").delete().eq("id", habitId);

    if (error) {
      setErrorMessage(error.message);
      setHabits(previous);
    }
  }

  async function addProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setIsSaving(true);

    const { data, error } = await insforge.database
      .from("progress_entries")
      .insert({
        user_id: userId,
        entry_date: progressForm.entry_date,
        weight_kg: progressForm.weight_kg ? Number(progressForm.weight_kg) : null,
        readiness: progressForm.readiness ? Number(progressForm.readiness) : null,
        training_minutes: Number(progressForm.training_minutes || 0),
        notes: progressForm.notes || null,
      })
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setProgressEntries((items) =>
      [data as ProgressEntry, ...items].sort((a, b) =>
        b.entry_date.localeCompare(a.entry_date),
      ),
    );
    setProgressForm(emptyProgressForm());
    setStatusMessage("Progress entry saved.");
  }

  async function deleteProgressEntry(entryId: string) {
    clearMessages();
    const previous = progressEntries;
    setProgressEntries((items) => items.filter((item) => item.id !== entryId));

    const { error } = await insforge.database
      .from("progress_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      setErrorMessage(error.message);
      setProgressEntries(previous);
    }
  }

  if (isLoadingAccount) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fbfaf6] px-5">
        <div className="rounded-md border border-[#e6e1d8] bg-white p-6 text-center shadow-[0_24px_80px_rgba(36,31,23,0.08)]">
          <Activity className="mx-auto text-[#178a41]" size={32} />
          <p className="mt-4 text-sm font-semibold">Opening PulsoFit...</p>
        </div>
      </div>
    );
  }

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
            {nav.map((item) => (
              <button
                className={`focus-ring mb-2 flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                  activeView === item.id
                    ? "bg-[#edf6ef] font-semibold text-[#178a41]"
                    : "text-[#4d584f] hover:bg-[#f6f1ea]"
                }`}
                key={item.id}
                onClick={() => setActiveView(item.id)}
                type="button"
              >
                <item.icon size={17} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 hidden rounded-md border border-[#e6e1d8] bg-[#fbfaf6] p-4 lg:block">
            <p className="text-sm font-semibold">
              {isFree ? "Free plan" : "PulsoFit Pro"}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#657168]">
              {isFree
                ? `${workouts.length} workouts and ${habits.length} habits saved. Free caps the active week at 3 workouts and 3 habits.`
                : "Full weekly planning, recovery score, and expanded tracking are active."}
            </p>
            {isFree ? (
              <Link
                href="/pricing"
                className="focus-ring mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#178a41] text-sm font-semibold text-white"
              >
                Upgrade options
              </Link>
            ) : null}
          </div>
          <button
            className="focus-ring mt-4 hidden h-10 w-full items-center justify-center rounded-md border border-[#d8d2c8] bg-white text-sm font-semibold lg:inline-flex"
            onClick={handleSignOut}
            type="button"
          >
            Sign out
          </button>
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
                Track your own workouts, habits, readiness, weight, and weekly
                training load.
              </p>
              <p className="mt-2 text-sm font-medium text-[#4d584f]">{userEmail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-11 items-center justify-center rounded-md border border-[#d8d2c8] bg-white px-4 text-sm font-semibold text-[#4d584f]">
                {isFree ? "Free account" : "Pro account"}
              </span>
              {isFree ? (
                <Link
                  href="/pricing"
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-[#178a41] px-4 text-sm font-semibold text-white"
                >
                  Upgrade
                </Link>
              ) : null}
              <button
                className="focus-ring inline-flex h-11 items-center justify-center rounded-md border border-[#d8d2c8] bg-white px-4 text-sm font-semibold lg:hidden"
                onClick={handleSignOut}
                type="button"
              >
                Sign out
              </button>
            </div>
          </div>

          {statusMessage || errorMessage ? (
            <div className="mt-6">
              {statusMessage ? (
                <p className="rounded-md bg-[#edf6ef] p-3 text-sm text-[#2e6f43]">
                  {statusMessage}
                </p>
              ) : null}
              {errorMessage ? (
                <p className="rounded-md bg-[#fff1ed] p-3 text-sm text-[#74311f]">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {nav.map((item) => (
              <button
                className={`focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${
                  activeView === item.id
                    ? "border-[#178a41] bg-[#edf6ef] text-[#178a41]"
                    : "border-[#d8d2c8] bg-white text-[#4d584f]"
                }`}
                key={item.id}
                onClick={() => setActiveView(item.id)}
                type="button"
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>

          {(activeView === "overview" || activeView === "workouts") && (
            <section className="mt-8 rounded-md border border-[#e6e1d8] bg-white p-4 shadow-[0_18px_70px_rgba(36,31,23,0.06)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Weekly Plan</h2>
                  <p className="text-sm text-[#657168]">
                    {currentWeekWorkouts.length} / {workoutLimit} workouts this week
                  </p>
                </div>
                <button
                  className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-[#d8d2c8] px-3 text-sm font-semibold"
                  onClick={() => setActiveView("workouts")}
                  type="button"
                >
                  <Plus size={16} />
                  Add workout
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                {workouts.length ? (
                  workouts.slice(0, Math.max(workoutLimit, 7)).map((workout, index) => {
                    const locked = isFree && index >= workoutLimit;

                    return (
                      <button
                        className={`focus-ring rounded-md border p-4 text-left transition ${
                          locked
                            ? "border-[#eee8df] bg-[#fbfaf6] opacity-75"
                            : selectedWorkout?.id === workout.id
                              ? "border-[#178a41] bg-[#f2fbf4] shadow-[0_10px_24px_rgba(23,138,65,0.12)]"
                              : "border-[#eee8df] bg-white hover:border-[#a9d3b6]"
                        }`}
                        disabled={locked}
                        key={workout.id}
                        onClick={() => setSelectedWorkoutId(workout.id)}
                        type="button"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            {dayLabel(workout.scheduled_for)}
                          </p>
                          {locked ? (
                            <Lock size={14} className="text-[#9aa39b]" />
                          ) : (
                            <span
                              className={`grid h-4 w-4 place-items-center rounded-sm ${
                                workout.completed
                                  ? "bg-[#178a41] text-white"
                                  : "border border-[#c9d0ca]"
                              }`}
                            >
                              {workout.completed ? <Check size={11} /> : null}
                            </span>
                          )}
                        </div>
                        <p className="mt-5 text-sm font-semibold">{workout.title}</p>
                        <p className="mt-1 text-xs text-[#657168]">{workout.focus}</p>
                        <div className="mt-5 h-1.5 rounded-sm bg-[#eee8df]">
                          <span
                            className="block h-full rounded-sm bg-[#f07053]"
                            style={{ width: `${Math.max(8, workout.intensity)}%` }}
                          />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="rounded-md border border-[#eee8df] p-4 text-sm text-[#657168] sm:col-span-2">
                    Add your first workout to start tracking the week.
                  </p>
                )}
              </div>
            </section>
          )}

          {activeView === "workouts" && (
            <section className="mt-5 grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
              <form
                className="rounded-md border border-[#e6e1d8] bg-white p-5"
                onSubmit={addWorkout}
              >
                <h2 className="text-lg font-semibold">Add workout</h2>
                <div className="mt-5 grid gap-4">
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    onChange={(event) =>
                      setWorkoutForm((form) => ({ ...form, title: event.target.value }))
                    }
                    placeholder="Workout title"
                    required
                    value={workoutForm.title}
                  />
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    onChange={(event) =>
                      setWorkoutForm((form) => ({ ...form, focus: event.target.value }))
                    }
                    placeholder="Focus"
                    required
                    value={workoutForm.focus}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                      onChange={(event) =>
                        setWorkoutForm((form) => ({
                          ...form,
                          scheduled_for: event.target.value,
                        }))
                      }
                      type="date"
                      value={workoutForm.scheduled_for}
                    />
                    <input
                      className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                      min="1"
                      onChange={(event) =>
                        setWorkoutForm((form) => ({
                          ...form,
                          duration_minutes: event.target.value,
                        }))
                      }
                      placeholder="Minutes"
                      type="number"
                      value={workoutForm.duration_minutes}
                    />
                    <input
                      className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                      max="100"
                      min="0"
                      onChange={(event) =>
                        setWorkoutForm((form) => ({
                          ...form,
                          intensity: event.target.value,
                        }))
                      }
                      placeholder="Intensity"
                      type="number"
                      value={workoutForm.intensity}
                    />
                  </div>
                  <textarea
                    className="focus-ring min-h-24 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 py-3 text-sm"
                    onChange={(event) =>
                      setWorkoutForm((form) => ({ ...form, notes: event.target.value }))
                    }
                    placeholder="Notes"
                    value={workoutForm.notes}
                  />
                </div>
                <button
                  className="focus-ring mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#178a41] text-sm font-semibold text-white disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  <Plus size={16} />
                  Save workout
                </button>
              </form>

              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Saved workouts</h2>
                <div className="mt-5 space-y-3">
                  {workouts.map((workout) => (
                    <div
                      className="flex flex-col gap-3 rounded-md border border-[#eee8df] p-3 sm:flex-row sm:items-center sm:justify-between"
                      key={workout.id}
                    >
                      <div>
                        <p className="text-sm font-semibold">{workout.title}</p>
                        <p className="mt-1 text-xs text-[#657168]">
                          {dateLabel(workout.scheduled_for)} - {workout.focus} -{" "}
                          {workout.duration_minutes} min
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#d8d2c8] px-3 text-xs font-semibold"
                          onClick={() => toggleWorkout(workout)}
                          type="button"
                        >
                          <Check size={14} />
                          {workout.completed ? "Done" : "Mark done"}
                        </button>
                        <button
                          className="focus-ring inline-flex h-9 items-center rounded-md border border-[#f0c9bd] px-3 text-xs font-semibold text-[#74311f]"
                          onClick={() => deleteWorkout(workout.id)}
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {(activeView === "overview" || activeView === "habits") && (
            <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Habit checklist</h2>
                    <p className="mt-1 text-sm text-[#657168]">
                      {completedHabits} of {habitLimit} active habits complete
                    </p>
                  </div>
                  <ShieldCheck size={19} className="text-[#178a41]" />
                </div>
                <div className="mt-5 space-y-3">
                  {habits.map((habit, index) => {
                    const locked = isFree && index >= habitLimit;

                    return (
                      <div
                        className={`rounded-md border border-[#eee8df] p-3 ${
                          locked ? "bg-[#fbfaf6] opacity-75" : "bg-white"
                        }`}
                        key={habit.id}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <button
                            className="focus-ring flex min-w-0 items-center gap-3 text-left"
                            disabled={locked}
                            onClick={() =>
                              updateHabit(habit, { completed: !habit.completed })
                            }
                            type="button"
                          >
                            <span
                              className={`grid h-5 w-5 place-items-center rounded-sm ${
                                locked
                                  ? "border border-[#d8d2c8]"
                                  : habit.completed
                                    ? "bg-[#178a41] text-white"
                                    : "border border-[#cbd0c9]"
                              }`}
                            >
                              {locked ? (
                                <Lock size={12} />
                              ) : habit.completed ? (
                                <Check size={13} />
                              ) : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold">
                                {habit.label}
                              </span>
                              <span className="text-xs text-[#657168]">
                                Target: {habit.target}
                              </span>
                            </span>
                          </button>
                          <button
                            className="focus-ring grid h-8 w-8 place-items-center rounded-md border border-[#f0c9bd] text-[#74311f] disabled:opacity-40"
                            disabled={locked}
                            onClick={() => deleteHabit(habit.id)}
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <input
                            className="focus-ring h-10 min-w-0 flex-1 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                            disabled={locked}
                            onChange={(event) =>
                              setHabits((items) =>
                                items.map((item) =>
                                  item.id === habit.id
                                    ? { ...item, current_value: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            placeholder="Today value"
                            value={habit.current_value}
                          />
                          <button
                            className="focus-ring grid h-10 w-10 place-items-center rounded-md bg-[#178a41] text-white disabled:opacity-40"
                            disabled={locked}
                            onClick={() =>
                              updateHabit(habit, {
                                current_value: habit.current_value,
                              })
                            }
                            type="button"
                          >
                            <Save size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeView === "habits" ? (
                <form
                  className="rounded-md border border-[#e6e1d8] bg-white p-5"
                  onSubmit={addHabit}
                >
                  <h2 className="text-lg font-semibold">Add habit</h2>
                  <p className="mt-1 text-sm text-[#657168]">
                    Free tracks 3 habits. Pro tracks 5.
                  </p>
                  <div className="mt-5 grid gap-4">
                    <input
                      className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                      onChange={(event) =>
                        setHabitForm((form) => ({ ...form, label: event.target.value }))
                      }
                      placeholder="Habit name"
                      required
                      value={habitForm.label}
                    />
                    <input
                      className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                      onChange={(event) =>
                        setHabitForm((form) => ({ ...form, target: event.target.value }))
                      }
                      placeholder="Target"
                      required
                      value={habitForm.target}
                    />
                  </div>
                  <button
                    className="focus-ring mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#178a41] text-sm font-semibold text-white disabled:opacity-70"
                    disabled={isSaving}
                    type="submit"
                  >
                    <Plus size={16} />
                    Save habit
                  </button>
                </form>
              ) : (
                <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                  <h2 className="text-lg font-semibold">Weekly load</h2>
                  <p className="mt-1 text-sm text-[#657168]">
                    Completed training minutes this week
                  </p>
                  <p className="mt-6 text-5xl font-semibold">{weeklyMinutes}</p>
                  <p className="mt-2 text-sm text-[#657168]">minutes logged</p>
                </div>
              )}
            </section>
          )}

          {(activeView === "overview" || activeView === "progress") && (
            <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
              <form
                className="rounded-md border border-[#e6e1d8] bg-white p-5"
                onSubmit={addProgress}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Log progress</h2>
                    <p className="mt-1 text-sm text-[#657168]">
                      Add your own readiness, weight, minutes, and notes.
                    </p>
                  </div>
                  <Weight size={19} className="text-[#178a41]" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    onChange={(event) =>
                      setProgressForm((form) => ({
                        ...form,
                        entry_date: event.target.value,
                      }))
                    }
                    type="date"
                    value={progressForm.entry_date}
                  />
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    onChange={(event) =>
                      setProgressForm((form) => ({
                        ...form,
                        weight_kg: event.target.value,
                      }))
                    }
                    placeholder="Weight kg"
                    step="0.1"
                    type="number"
                    value={progressForm.weight_kg}
                  />
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    max="100"
                    min="0"
                    onChange={(event) =>
                      setProgressForm((form) => ({
                        ...form,
                        readiness: event.target.value,
                      }))
                    }
                    placeholder="Readiness"
                    type="number"
                    value={progressForm.readiness}
                  />
                  <input
                    className="focus-ring h-11 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 text-sm"
                    min="0"
                    onChange={(event) =>
                      setProgressForm((form) => ({
                        ...form,
                        training_minutes: event.target.value,
                      }))
                    }
                    placeholder="Training minutes"
                    type="number"
                    value={progressForm.training_minutes}
                  />
                </div>
                <textarea
                  className="focus-ring mt-3 min-h-24 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-3 py-3 text-sm"
                  onChange={(event) =>
                    setProgressForm((form) => ({ ...form, notes: event.target.value }))
                  }
                  placeholder="Notes"
                  value={progressForm.notes}
                />
                <button
                  className="focus-ring mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#178a41] text-sm font-semibold text-white disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  <Save size={16} />
                  Save progress
                </button>
              </form>

              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Progress history</h2>
                <div className="mt-5 space-y-3">
                  {progressEntries.length ? (
                    progressEntries.slice(0, isFree ? 7 : 12).map((entry) => (
                      <div
                        className="grid gap-3 rounded-md border border-[#eee8df] p-3 sm:grid-cols-[120px_1fr_auto]"
                        key={entry.id}
                      >
                        <p className="text-sm font-semibold">{dateLabel(entry.entry_date)}</p>
                        <div className="text-sm text-[#4d584f]">
                          <p>
                            Readiness {entry.readiness ?? "-"} -{" "}
                            {entry.training_minutes} min
                            {entry.weight_kg ? ` - ${entry.weight_kg} kg` : ""}
                          </p>
                          {entry.notes ? (
                            <p className="mt-1 text-xs text-[#657168]">{entry.notes}</p>
                          ) : null}
                        </div>
                        <button
                          className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-[#f0c9bd] text-[#74311f]"
                          onClick={() => deleteProgressEntry(entry.id)}
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border border-[#eee8df] p-4 text-sm text-[#657168]">
                      No progress entries yet.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeView === "recovery" && (
            <section className="mt-8 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Recovery score</h2>
                <p className="mt-1 text-sm text-[#657168]">
                  {isFree
                    ? "Preview only in Free. Your raw progress entries still work."
                    : "Calculated from your latest readiness, habits, and workout load."}
                </p>
                <div className="mt-6">
                  <ScoreRing value={readiness} locked={isFree} />
                </div>
              </div>
              <div className="rounded-md border border-[#e6e1d8] bg-white p-5">
                <h2 className="text-lg font-semibold">Guidance</h2>
                <p className="mt-4 text-sm leading-7 text-[#657168]">
                  {isFree
                    ? "Free keeps workout, habit, and progress tracking usable. Pro turns those logs into recovery guidance and lets you plan a complete week."
                    : readiness >= 75
                      ? "You look ready for a productive session. Keep form strict and log how the session feels afterwards."
                      : "Your readiness is trending lower. Reduce top-set intensity, keep the session technical, and prioritize sleep."}
                </p>
              </div>
            </section>
          )}

          {activeView === "settings" && (
            <section className="mt-8 rounded-md border border-[#e6e1d8] bg-white p-5">
              <h2 className="text-lg font-semibold">Account settings</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border border-[#eee8df] p-4">
                  <p className="text-xs uppercase text-[#657168]">Email</p>
                  <p className="mt-2 text-sm font-semibold">{userEmail}</p>
                </div>
                <div className="rounded-md border border-[#eee8df] p-4">
                  <p className="text-xs uppercase text-[#657168]">Plan</p>
                  <p className="mt-2 text-sm font-semibold">{isFree ? "Free" : "Pro"}</p>
                </div>
                <button
                  className="focus-ring inline-flex min-h-24 items-center justify-center rounded-md border border-[#d8d2c8] text-sm font-semibold"
                  onClick={handleSignOut}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            </section>
          )}
        </main>

        <aside className="border-t border-[#e6e1d8] bg-white/82 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xl font-semibold">
                {selectedWorkout?.title ?? "No workout selected"}
              </p>
              <p className="mt-1 text-sm text-[#657168]">
                {selectedWorkout
                  ? `${selectedWorkout.duration_minutes} min - ${selectedWorkout.focus}`
                  : "Add a workout to begin."}
              </p>
            </div>
            <Timer size={21} className="text-[#178a41]" />
          </div>
          <div className="mt-6 h-48 rounded-md border border-[#eee8df] bg-[#f2f7f0] p-4">
            <div className="grid h-full place-items-center rounded-sm border border-[#d9e7da] bg-white/72">
              <div className="text-center">
                <Dumbbell className="mx-auto text-[#178a41]" size={36} />
                <p className="mt-3 text-sm font-semibold">Your session</p>
                <p className="mt-1 text-xs text-[#657168]">
                  {selectedWorkout?.completed ? "Completed" : "Planned"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-[#e6e1d8] bg-[#fbfaf6] p-4">
            <p className="text-sm font-semibold">Workout notes</p>
            <p className="mt-2 text-sm leading-6 text-[#657168]">
              {selectedWorkout?.notes ||
                "Select or add a workout to keep notes for this session."}
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-[#eee8df] bg-white p-3">
              <ClipboardList size={17} className="text-[#178a41]" />
              <p className="mt-3 text-2xl font-semibold">{workouts.length}</p>
              <p className="text-xs text-[#657168]">Workouts</p>
            </div>
            <div className="rounded-md border border-[#eee8df] bg-white p-3">
              <ShieldCheck size={17} className="text-[#178a41]" />
              <p className="mt-3 text-2xl font-semibold">{habits.length}</p>
              <p className="text-xs text-[#657168]">Habits</p>
            </div>
            <div className="rounded-md border border-[#eee8df] bg-white p-3">
              <Flame size={17} className="text-[#f07053]" />
              <p className="mt-3 text-2xl font-semibold">{weeklyMinutes}</p>
              <p className="text-xs text-[#657168]">Minutes</p>
            </div>
            <div className="rounded-md border border-[#eee8df] bg-white p-3">
              <CalendarDays size={17} className="text-[#178a41]" />
              <p className="mt-3 text-2xl font-semibold">{progressEntries.length}</p>
              <p className="text-xs text-[#657168]">Check-ins</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
