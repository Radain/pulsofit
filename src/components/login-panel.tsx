"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { insforge } from "@/lib/insforge";
import { ensurePulsoFitAccount } from "@/lib/pulsofit-account";

export function LoginPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(async ({ data }) => {
      if (data.user) {
        await ensurePulsoFitAccount(data.user);
        router.replace("/app");
      }
    });
  }, [router]);

  async function completeLogin() {
    const { data, error } = await insforge.auth.getCurrentUser();

    if (error || !data.user) {
      throw error ?? new Error("No active InsForge session");
    }

    await ensurePulsoFitAccount(data.user);
    router.push("/app");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const { error } = await insforge.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.error === "EMAIL_NOT_VERIFIED") {
            setMode("verify");
            setMessage("Check your inbox and enter the verification code.");
            return;
          }

          throw error;
        }

        await completeLogin();
        return;
      }

      if (mode === "signup") {
        const { data, error } = await insforge.auth.signUp({
          email,
          password,
          name,
        });

        if (error) {
          throw error;
        }

        if (data?.requireEmailVerification) {
          setMode("verify");
          setMessage("Account created. Enter the 6-digit code from your email.");
          return;
        }

        await completeLogin();
        return;
      }

      const { error } = await insforge.auth.verifyEmail({
        email,
        otp: verificationCode,
      });

      if (error) {
        throw error;
      }

      await completeLogin();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setIsSubmitting(false);
    }
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
            Sign in with InsForge Auth. Your training workspace opens only after
            a valid session is created.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 rounded-md border border-[#d8d2c8] bg-[#fbfaf6] p-1">
          {(["signin", "signup"] as const).map((item) => (
            <button
              className={`focus-ring h-10 rounded-sm text-sm font-semibold transition ${
                mode === item
                  ? "bg-white text-[#101418] shadow-sm"
                  : "text-[#657168] hover:text-[#178a41]"
              }`}
              key={item}
              onClick={() => {
                setMode(item);
                setErrorMessage("");
                setMessage("");
              }}
              type="button"
            >
              {item === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="block text-sm font-semibold text-[#2e3731]">
              Name
              <input
                className="focus-ring mt-2 h-12 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-4 text-sm font-medium"
                onChange={(event) => setName(event.target.value)}
                placeholder="Adri"
                type="text"
                value={name}
              />
            </label>
          ) : null}

          <label className="block text-sm font-semibold text-[#2e3731]">
            Email
            <input
              className="focus-ring mt-2 h-12 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-4 text-sm font-medium"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          {mode === "verify" ? (
            <label className="block text-sm font-semibold text-[#2e3731]">
              Verification code
              <input
                className="focus-ring mt-2 h-12 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-4 text-sm font-medium"
                inputMode="numeric"
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="123456"
                required
                value={verificationCode}
              />
            </label>
          ) : (
            <label className="block text-sm font-semibold text-[#2e3731]">
              Password
              <input
                className="focus-ring mt-2 h-12 w-full rounded-md border border-[#d8d2c8] bg-[#fbfaf6] px-4 text-sm font-medium"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                required
                type="password"
                value={password}
              />
            </label>
          )}

          {message ? (
            <p className="rounded-md bg-[#edf6ef] p-3 text-sm text-[#2e6f43]">
              {message}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-md bg-[#fff1ed] p-3 text-sm text-[#74311f]">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="focus-ring inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#178a41] px-5 text-sm font-semibold text-white transition hover:bg-[#0f6f32] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Working..."
              : mode === "signin"
                ? "Sign in to app"
                : mode === "signup"
                  ? "Create Free account"
                  : "Verify and enter"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-[#657168]">
          PulsoFit uses InsForge Auth. Email verification is required before a
          new account can enter the app.
        </p>
      </div>
    </section>
  );
}
