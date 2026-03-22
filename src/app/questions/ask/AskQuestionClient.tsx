"use client";
import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/src/store/Auth";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Particles } from "@/components/magicui/particles";
import { SparklesText } from "@/components/magicui/sparkles-text";

function SessionLoader() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 pt-24 md:pt-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_26%),linear-gradient(to_bottom,#050816,#09090b)]" />

      <DotPattern
        className="absolute inset-0 -z-10 opacity-25 mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
      />

      <BackgroundBeams className="-z-10 opacity-40" />

      <div className="mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <section className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(14,165,233,0.14)] backdrop-blur-2xl sm:p-10">
          <BorderBeam
            size={220}
            duration={10}
            colorFrom="#67e8f9"
            colorTo="#a855f7"
          />

          <Particles
            className="absolute inset-0 opacity-55"
            quantity={70}
            ease={80}
            size={0.8}
            color="#8be9fd"
            vx={0.08}
            vy={-0.03}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-cyan-200/85">
              Orbital Auth Gate
            </div>

            <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
              <div className="absolute h-40 w-40 rounded-full border border-cyan-400/15 bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_62%)] blur-xl" />
              <div className="absolute h-32 w-32 rounded-full border border-white/8" />
              <div className="absolute h-32 w-32 rounded-full border-2 border-transparent border-t-cyan-300 border-r-sky-400 animate-spin" />
              <div className="absolute h-24 w-24 rounded-full border border-fuchsia-300/25" />
              <div className="absolute h-24 w-24 rounded-full border-2 border-transparent border-b-fuchsia-400 border-l-violet-300 animate-spin direction-[reverse] animation-duration-[3s]" />
              <div className="absolute h-12 w-12 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(56,189,248,0.9),rgba(14,165,233,0.12))] shadow-[0_0_40px_rgba(56,189,248,0.7)] animate-pulse" />
              <div className="absolute h-2 w-20 rounded-full bg-cyan-300/50 blur-md" />
              <div className="absolute h-20 w-2 rounded-full bg-fuchsia-300/35 blur-md" />
            </div>

            <SparklesText className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Checking Your Session
            </SparklesText>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-base">
              Calibrating your access vector and verifying your Appwrite session
              before opening the launch bay.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function AskQuestionPage() {
  const { hydrated, verifySession } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    if (!hydrated) return;

    const verifyAccess = async () => {
      const isAuthenticated = await verifySession();

      if (cancelled) return;

      if (!isAuthenticated) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      setHasAccess(true);
    };

    void verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [hydrated, pathname, router, verifySession]);

  if (!hydrated || !hasAccess) {
    return <SessionLoader />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 pt-24 md:pt-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_26%),linear-gradient(to_bottom,#050816,#09090b)]" />

      <DotPattern
        className="absolute inset-0 -z-10 opacity-25 mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
      />

      <BackgroundBeams className="-z-10 opacity-40" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xl sm:px-8 lg:px-10">
          <BorderBeam size={220} duration={12} delay={0} />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
              Ask the community
            </div>

            <div className="space-y-3">
              <SparklesText className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ask a Question
              </SparklesText>
              <p className="max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Describe the problem clearly, include the important context, and
                use tags so the right people can find it.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8">
          <BorderBeam size={280} duration={14} delay={2} />
          <div className="relative z-10">
            <QuestionForm />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AskQuestionPage;
