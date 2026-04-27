import type { UserSchema } from "@insforge/sdk";
import { insforge } from "./insforge";

type AppUser = Pick<UserSchema, "id" | "email"> & {
  profile?: {
    name?: string | null;
  } | null;
};

const starterWorkouts = [
  {
    title: "Lower Body Strength",
    scheduled_for: "2026-05-12",
    focus: "Squat pattern",
    duration_minutes: 55,
    intensity: 64,
    completed: true,
  },
  {
    title: "Upper Body Push",
    scheduled_for: "2026-05-13",
    focus: "Chest, shoulders, triceps",
    duration_minutes: 60,
    intensity: 72,
    completed: false,
  },
  {
    title: "Active Recovery",
    scheduled_for: "2026-05-14",
    focus: "Mobility and zone 2",
    duration_minutes: 35,
    intensity: 38,
    completed: false,
  },
];

const starterHabits = [
  {
    label: "10k Steps",
    target: "10,000 steps",
    current_value: "12,450 steps",
    completed: true,
    sort_order: 1,
  },
  {
    label: "Protein Goal",
    target: "120g",
    current_value: "125 / 120g",
    completed: true,
    sort_order: 2,
  },
  {
    label: "Hydration",
    target: "2L",
    current_value: "2.4 / 2L",
    completed: true,
    sort_order: 3,
  },
];

export async function ensurePulsoFitAccount(user: AppUser) {
  const { data: existingProfile, error: profileReadError } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileReadError) {
    throw profileReadError;
  }

  if (!existingProfile) {
    const { error } = await insforge.database.from("profiles").insert({
      user_id: user.id,
      email: user.email,
      display_name: user.profile?.name ?? user.email.split("@")[0],
      plan: "free",
    });

    if (error) {
      throw error;
    }
  }

  const { count: workoutCount, error: workoutCountError } = await insforge.database
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (workoutCountError) {
    throw workoutCountError;
  }

  if (!workoutCount) {
    const { error } = await insforge.database.from("workouts").insert(
      starterWorkouts.map((workout) => ({
        ...workout,
        user_id: user.id,
      })),
    );

    if (error) {
      throw error;
    }
  }

  const { count: habitCount, error: habitCountError } = await insforge.database
    .from("habits")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (habitCountError) {
    throw habitCountError;
  }

  if (!habitCount) {
    const { error } = await insforge.database.from("habits").insert(
      starterHabits.map((habit) => ({
        ...habit,
        user_id: user.id,
      })),
    );

    if (error) {
      throw error;
    }
  }
}
