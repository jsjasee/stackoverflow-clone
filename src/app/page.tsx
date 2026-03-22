import Link from "next/link";
import {
  IconArrowUpRight,
  IconMessageCircleCode,
  IconSearch,
  IconSparkles,
  IconStars,
  IconTrophy,
} from "@tabler/icons-react";
import { Query } from "node-appwrite";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Meteors } from "@/components/magicui/meteors";
import { tablesDB, users } from "@/src/models/server/config";
import { answerCollection, db, questionCollection } from "@/src/models/name";
import { UserPrefs } from "@/src/store/Auth";

export const dynamic = "force-dynamic";

const USER_BATCH_SIZE = 100;

const features = [
  {
    title: "Build Reputation",
    description:
      "Turn strong answers into visible credibility with a public profile that shows what you know.",
    icon: IconTrophy,
    className: "lg:col-span-4",
    eyebrow: "Credibility",
  },
  {
    title: "Answer Questions",
    description:
      "Share practical solutions, cut through noise, and help other developers move faster with confidence.",
    icon: IconMessageCircleCode,
    className: "lg:col-span-2",
    eyebrow: "Contribution",
  },
  {
    title: "Get Your Questions Answered",
    description:
      "Find fast, community-driven guidance from developers who have already solved the problem in front of you.",
    icon: IconSearch,
    className: "lg:col-span-3",
    eyebrow: "Discovery",
  },
] as const;

async function getCommunityStats() {
  const [questions, answers, firstUserPage] = await Promise.all([
    tablesDB.listRows({
      databaseId: db,
      tableId: questionCollection,
      queries: [Query.limit(1)],
    }),
    tablesDB.listRows({
      databaseId: db,
      tableId: answerCollection,
      queries: [Query.limit(1)],
    }),
    users.list<UserPrefs>({
      queries: [Query.limit(USER_BATCH_SIZE), Query.offset(0)],
    }),
  ]);

  let reputationEarned = firstUserPage.users.reduce((total, user) => {
    return total + Number(user.prefs?.reputation ?? 0);
  }, 0);

  const userOffsets: number[] = [];
  for (
    let offset = USER_BATCH_SIZE;
    offset < firstUserPage.total;
    offset += USER_BATCH_SIZE
  ) {
    userOffsets.push(offset);
  }

  if (userOffsets.length > 0) {
    const remainingUserPages = await Promise.all(
      userOffsets.map((offset) =>
        users.list<UserPrefs>({
          queries: [Query.limit(USER_BATCH_SIZE), Query.offset(offset)],
          total: false,
        }),
      ),
    );

    reputationEarned += remainingUserPages.reduce((grandTotal, page) => {
      return (
        grandTotal +
        page.users.reduce((pageTotal, user) => {
          return pageTotal + Number(user.prefs?.reputation ?? 0);
        }, 0)
      );
    }, 0);
  }

  return [
    {
      label: "Questions Asked",
      value: questions.total,
      accent: "from-[#8B5CF6] via-[#22D3EE] to-[#1D4ED8]",
    },
    {
      label: "Answers Shared",
      value: answers.total,
      accent: "from-[#22D3EE] via-[#8B5CF6] to-[#1D4ED8]",
    },
    {
      label: "Reputation Earned",
      value: reputationEarned,
      accent: "from-[#1D4ED8] via-[#22D3EE] to-[#8B5CF6]",
    },
  ] as const;
}

export default async function Home() {
  const stats = await getCommunityStats();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-[#F8FAFC]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030712_0%,#050816_38%,#030712_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.24),transparent_28%),radial-gradient(circle_at_20%_24%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(29,78,216,0.18),transparent_28%),radial-gradient(circle_at_50%_70%,rgba(139,92,246,0.08),transparent_34%)]" />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Particles
            className="absolute inset-0 h-full w-full opacity-80"
            quantity={120}
            staticity={45}
            ease={60}
            size={1}
            color="#22D3EE"
            vx={0.03}
            vy={-0.02}
            refresh
          />
          <div className="absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#8B5CF6]/18 blur-[140px]" />
          <div className="absolute left-[14%] top-[24%] h-72 w-72 rounded-full bg-[#1D4ED8]/16 blur-[120px]" />
          <div className="absolute right-[12%] top-[16%] h-64 w-64 rounded-full bg-[#22D3EE]/12 blur-[110px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent_0%,rgba(3,7,18,0.94)_100%)]" />
        </div>

        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.34em] text-white/70 backdrop-blur-xl">
                <IconStars className="h-4 w-4 text-[#22D3EE]" />
                OpenCode
              </div>

              <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-[-0.05em] text-[#F8FAFC] sm:text-6xl lg:text-7xl">
                Ask boldly. Answer precisely. Build your reputation in orbit.
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-pretty text-base leading-8 text-slate-300 sm:text-lg">
                OpenCode is a programming Q&amp;A platform for developers who
                want fast answers, sharp discussions, and a public record of
                what they know.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 mt-12 flex flex-wrap items-center justify-center gap-4 delay-150 duration-700">
              <Link
                href="/login"
                className="group inline-flex h-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-7 text-sm font-medium text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/60 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_32px_rgba(34,211,238,0.18)]"
              >
                Login
              </Link>

              <Link href="/register" className="group">
                <ShimmerButton
                  shimmerColor="#22D3EE"
                  shimmerDuration="2.8s"
                  borderRadius="999px"
                  background="linear-gradient(135deg, rgba(139,92,246,0.96), rgba(29,78,216,0.88))"
                  className="h-14 px-7 shadow-[0_0_40px_rgba(139,92,246,0.35)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_56px_rgba(34,211,238,0.28)]"
                >
                  <span className="relative z-10 text-sm font-semibold tracking-[0.02em] text-white">
                    Sign Up
                  </span>
                </ShimmerButton>
              </Link>

              <Link
                href="/questions"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#1D4ED8]/35 bg-[#1D4ED8]/10 px-7 text-sm font-medium text-white/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/55 hover:bg-[#1D4ED8]/18 hover:text-white hover:shadow-[0_0_30px_rgba(29,78,216,0.28)]"
              >
                Browse Questions
                <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
              <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(3,7,18,0.8)] backdrop-blur-2xl sm:p-8">
                <BorderBeam
                  size={280}
                  duration={12}
                  delay={2}
                  colorFrom="#22D3EE"
                  colorTo="#8B5CF6"
                  borderWidth={1.5}
                />
                <Meteors number={10} className="bg-[#22D3EE]/70" />
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="relative grid gap-6 text-left sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                      Clarity
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Premium spacing, tight hierarchy, and zero dashboard
                      clutter.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                      Signal
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Answers, votes, and reputation stay visible where they
                      matter.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                      Momentum
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Jump from discovery to contribution without leaving orbit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-10 max-w-2xl duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/65 backdrop-blur-xl">
            <IconSparkles className="h-4 w-4 text-[#8B5CF6]" />
            Feature Grid
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Purpose-built for developers who care about clean answers and visible expertise.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <MagicCard
                key={feature.title}
                mode="orb"
                glowFrom="#22D3EE"
                glowTo="#8B5CF6"
                glowSize={320}
                glowBlur={80}
                glowOpacity={0.45}
                className={`${feature.className} animate-in fade-in slide-in-from-bottom-6 rounded-[2rem] bg-white/[0.04] duration-700`}
              >
                <div className="relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(3,7,18,0.96))] p-7 backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1">
                  <BorderBeam
                    size={240}
                    duration={10 + index * 2}
                    delay={index * 2}
                    colorFrom="#22D3EE"
                    colorTo="#8B5CF6"
                  />
                  {index === 0 ? (
                    <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#8B5CF6]/12 blur-3xl" />
                  ) : null}
                  {index === 1 ? (
                    <Meteors number={8} className="bg-[#22D3EE]/70" />
                  ) : null}
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#22D3EE] shadow-[0_0_25px_rgba(34,211,238,0.12)]">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                        {feature.eyebrow}
                      </span>
                    </div>

                    <div className="mt-auto pt-16">
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </MagicCard>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 mb-10 max-w-2xl duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white/65 backdrop-blur-xl">
            <IconStars className="h-4 w-4 text-[#22D3EE]" />
            Live Stats
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Real community numbers, surfaced with the same glow as the rest of the experience.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <MagicCard
              key={stat.label}
              mode="orb"
              glowFrom="#1D4ED8"
              glowTo="#22D3EE"
              glowSize={280}
              glowBlur={90}
              glowOpacity={0.35}
              className="animate-in fade-in slide-in-from-bottom-6 rounded-[2rem] bg-white/[0.04] duration-700"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,31,0.88),rgba(3,7,18,0.98))] p-8 backdrop-blur-2xl">
                <BorderBeam
                  size={220}
                  duration={12 + index * 2}
                  delay={index}
                  colorFrom="#8B5CF6"
                  colorTo="#22D3EE"
                />
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                    {stat.label}
                  </p>
                  <div className="mt-8 flex items-end gap-1">
                    <NumberTicker
                      value={stat.value}
                      className={`bg-gradient-to-r ${stat.accent} bg-clip-text text-5xl font-semibold tracking-[-0.05em] text-transparent drop-shadow-[0_0_24px_rgba(34,211,238,0.16)] sm:text-6xl`}
                    />
                    <span className="pb-2 text-lg text-white/55">+</span>
                  </div>
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </section>
    </main>
  );
}
