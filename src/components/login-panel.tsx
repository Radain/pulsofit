"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

type DemoSession = {
  email: string;
  plan: "free" | "pro";
  startedAt: string;
};

function saveDemoSession(session: DemoSession) {
  window.localStorage.setItem("pulsofit-session", JSON.stringify(session));
}

export function LoginPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function enterApp(plan: "free" | "pro") {
    saveDemoSession({
      email: email || "demo@pulsofit.app",
      plan,
      startedAt: new Date().toISOString(),
    });

    router.push(plan === "pro" ? "/app?plan=pro" : "/app");
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1180px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-[#178a41]">
          Secure app entry
        </p>
        <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-[1.05] tracking-[0] text-[#101418] sm:text-6xl">
          Enter your training workspace.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-[#657168]">
          The marketing site stays outside. Once you continue, PulsoFit opens as
          its own focused app experience for Free or Pro users.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-[#4d584f] sm:grid-cols-2">
          <div className="rounded-md border border-[#e6e1d8] bg-white p-4">
            <ShieldCheck size={19} className="mb-3 text-[#178a41]" />
            Free accounts keep a usable weekly plan with clear upgrade limits.
          </div>
          <div className="rounded-md border border-[#e6e1d8] bg-white p-4">
            <LockKeyhole size={19} className="mb-3 text-[#178a41]" />
            Production auth can replace this MVP entry without changing the app
            shell.
          </div>
        </div>
      </div>

      <div className="rounded-md border border-[#e6e1d8] bg-white p-6 shadow-[0_24px_80px_rgba(36,31,23,0.08)]">
        <div>
          <p className="text-sm font-semibold uppercase text-[#178a41]">
            Sign in
          </p>
          <h2 className="mt-3 text-3xl font-semibold">PulsoFit account</h2>
          <p className="mt-3 text-sm leading-6 text-[#657168]">
            MVP login for testing the separated app shell. No password is stored
            here.
          </p>
        </div>

        <label className="mt-8 block text-sm font-semibold text-[#2e3731]">
          Email
          <input
            className="focus-ring mt-2 h-12 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-4 text-sm font-medium"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </label>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#d8d2c8] bg-white px-5 text-sm font-semibold transition hover:border-[#178a41]"
            onClick={() => enterApp("free")}
            type="button"
          >
            Continue Free
            <ArrowRight size={16} />
          </button>
          <button
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#178a41] px-5 text-sm font-semibold text-white transition hover:bg-[#0f6f32]"
            onClick={() => enterApp("pro")}
            type="button"
          >
            Enter Pro demo
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-[#657168]">
          For live production, this screen should be connected to a real auth
          provider before storing personal training data.
        </p>
      </div>
    </section>
  );
}
