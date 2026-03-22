"use client";
import QuestionForm from "@/components/QuestionForm";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { SparklesText } from "@/components/magicui/sparkles-text";

function AskQuestionPage() {
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
