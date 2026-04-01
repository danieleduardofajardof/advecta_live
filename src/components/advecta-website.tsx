"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  Lock,
  Target,
  Activity,
  Layers,
  ChevronDown,
  Maximize2,
  X,
} from "lucide-react";

import backtestData from "@/website_data.json";

/* ─────────── animation helpers ─────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─────────── typed data from JSON ─────────── */
const ov = backtestData.overview;
const kpi = backtestData.kpi_by_period;
const horizons = backtestData.horizon_stats;
// @ts-ignore
const advancedKPIs = backtestData.advanced_kpis;
const sessions = backtestData.session_performance;
const exchanges = backtestData.exchange_performance;
const topStocks = backtestData.top_stocks;
// @ts-ignore
const strategyComparison = backtestData.strategy_comparison;
// @ts-ignore
const capitalGrowth = (backtestData as any).capital_growth_curve;
// @ts-ignore
const projections = (backtestData as any).projected_growth ?? {};
// @ts-ignore
const extraKPIs = (backtestData as any).extra_kpis ?? {};

/* helpers */
const fmt = (n: number, locale: string) => n.toLocaleString(locale === "es" ? "es-ES" : "en-US");
const fmtD = (n: number, locale: string) => (locale === "es" ? "" : "$") + n.toLocaleString(locale === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 0 }) + (locale === "es" ? " $" : "");
const fmtP = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const fmtPct = (n: number) => (n * 100).toFixed(1) + "%";

/* ─────────── static data ─────────── */
/* localized data arrays moved inside component */

/* KPI period order — only show periods present in data */
const allPeriods = ["Full Period", "1 Month", "90 Days", "6 Months", "1 Year"] as const;
const periodOrder = allPeriods.filter(p => !!(kpi as any)[p]) as string[];

/* ── Lightbox component ────────────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
        quality={95}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function AdvectaWebsite({ dictionary, locale }: { dictionary: any, locale: string }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const pathname = usePathname();

  const t = dictionary;

  /* ─────────── localized settings ─────────── */
  const coreFeatures = [
    {
      icon: Activity,
      title: t.features.items.volatility.title,
      desc: t.features.items.volatility.desc,
    },
    {
      icon: Zap,
      title: t.features.items.execution.title,
      desc: t.features.items.execution.desc,
    },
    {
      icon: Shield,
      title: t.features.items.risk.title,
      desc: t.features.items.risk.desc,
    },
  ];

  const strategyParams = [
    { label: t.params.labels.starting_capital, value: fmtD(ov.starting_capital, locale) },
    { label: t.params.labels.target_return, value: t.params.labels.target_return_val },
    { label: t.params.labels.frequency, value: t.params.labels.frequency_val },
    { label: t.params.labels.security, value: t.params.labels.security_val },
    { label: t.params.labels.position_size, value: fmtD((ov as any).position_size ?? 2500, locale) },
    { label: t.params.labels.horizon, value: t.params.labels.horizon_val },
    { label: t.params.labels.sessions, value: t.params.labels.sessions_val },
    { label: t.params.labels.profit_split, value: t.params.labels.profit_split_val },
    { label: t.params.labels.period, value: t.params.labels.period_val },
    { label: t.params.labels.status, value: t.params.labels.status_val },
  ];

  const techStack = [
    { icon: Globe, title: t.tech.items.exchanges.title, desc: t.tech.items.exchanges.desc },
    { icon: Layers, title: t.tech.items.precision.title, desc: t.tech.items.precision.desc },
    { icon: BarChart3, title: t.tech.items.backtest.title, desc: t.tech.items.backtest.desc.replace("{days}", ov.test_days.toString()) },
    { icon: TrendingUp, title: t.tech.items.engine.title, desc: t.tech.items.engine.desc },
    { icon: Clock, title: t.tech.items.execution.title, desc: t.tech.items.execution.desc },
    { icon: Lock, title: t.tech.items.lock.title, desc: t.tech.items.lock.desc },
  ];

  const pipelineSteps = t.pipeline.items;

  const chartImages = [
    { src: "/kpi_equity_drawdown.png", title: t.backtest.charts.equity_drawdown.title, desc: t.backtest.charts.equity_drawdown.desc },
    { src: "/kpi_returns_distribution.png", title: t.backtest.charts.returns_dist.title, desc: t.backtest.charts.returns_dist.desc },
    { src: "/kpi_subclass_comparison.png", title: t.backtest.charts.subclass_comparison.title, desc: t.backtest.charts.subclass_comparison.desc },
    { src: "/kpi_top_symbols.png", title: t.backtest.charts.top_symbols.title, desc: t.backtest.charts.top_symbols.desc },
    { src: "/kpi_risk_metrics.png", title: t.backtest.charts.risk_metrics.title, desc: t.backtest.charts.risk_metrics.desc },
    { src: "/kpi_optimal_params.png", title: t.backtest.charts.optimal_params.title, desc: t.backtest.charts.optimal_params.desc },
  ];

  const strategyComparisonLocalized = Object.entries(strategyComparison).map(([key, s]: [string, any]) => ({
    ...s,
    _key: key,
    name: t.comparison.strategies[key]?.name ?? s.name ?? key,
    desc: t.comparison.strategies[key]?.desc ?? s.desc ?? "",
  }));

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">ADVECTA</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">{t.nav.strategy}</a>
            <a href="#technology" className="hover:text-white transition-colors">{t.nav.technology}</a>
            <a href="#pipeline" className="hover:text-white transition-colors">{t.nav.pipeline}</a>
            <a href="#performance" className="hover:text-white transition-colors">{t.nav.performance}</a>
            <a href="#backtest" className="hover:text-white transition-colors">{t.nav.backtest}</a>
            <a href="#partnership" className="hover:text-white transition-colors">{t.nav.partnership}</a>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-l border-zinc-800 ml-2 pl-6">
              <Link 
                href={pathname.replace(`/${locale}`, "/en")} 
                className={`transition-colors ${locale === "en" ? "text-emerald-400 font-bold" : "hover:text-white"}`}
              >
                EN
              </Link>
              <span className="text-zinc-700">|</span>
              <Link 
                href={pathname.replace(`/${locale}`, "/es")} 
                className={`transition-colors ${locale === "es" ? "text-emerald-400 font-bold" : "hover:text-white"}`}
              >
                ES
              </Link>
            </div>
          </div>
          <Button
            className="rounded-full px-5 text-sm h-9"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.nav.cta}
          </Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative gradient-hero min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.hero.tagline}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-6xl md:text-8xl font-bold tracking-tighter glow-text">
            {t.hero.title}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg md:text-2xl text-zinc-400 font-light tracking-wide">
            {t.hero.subtitle}
          </motion.p>

          <motion.p variants={fadeUp} custom={3} className="mt-6 max-w-2xl mx-auto text-zinc-500 leading-relaxed">
            {t.hero.description}
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button className="rounded-full px-7 py-5 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:from-emerald-400 hover:to-cyan-400 glow-accent"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              {t.hero.cta_request} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="rounded-full px-7 py-5 text-base"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              {t.hero.cta_view}
            </Button>
          </motion.div>

          {/* Hero stats from real data */}
          <motion.div variants={fadeUp} custom={5} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: fmtP(ov.roi_pct), label: t.stats.daily_roi },
              { value: fmtPct(ov.win_rate), label: t.stats.win_rate },
              { value: ov.sharpe.toFixed(2), label: t.stats.sharpe },
              { value: fmt(ov.total_trades, locale), label: t.stats.trades.replace("{days}", ov.test_days.toString()) },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-4">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-10">
          <ChevronDown className="w-6 h-6 text-zinc-600" />
        </motion.div>
      </section>

      {/* ── About / Core Features ──────────────────────────────────────── */}
      <section id="about" className="px-6 py-28 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold tracking-tight">
            {t.features.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            {t.features.subtitle}
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid md:grid-cols-3 gap-6">
          {coreFeatures.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i}>
              <Card className="bg-zinc-900/60 border-zinc-800/60 rounded-2xl hover:border-zinc-700 transition-colors h-full">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <f.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Strategy Parameters ──────────────────────────────────────── */}
      <section className="gradient-section px-6 py-28">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.params.title}</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500">{t.params.subtitle}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-zinc-800/60">
              {strategyParams.map((p, i) => (
                <div key={p.label} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}>
                  <span className="text-zinc-400 text-sm">{p.label}</span>
                  <span className="font-mono font-semibold text-emerald-400">{p.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Technology Grid ────────────────────────────────────────────── */}
      <section id="technology" className="px-6 py-28 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.tech.title}</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">{t.tech.subtitle}</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((t, i) => (
            <motion.div key={t.title} variants={fadeUp} custom={i}>
              <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 h-full group">
                <CardContent className="p-7">
                  <t.icon className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{t.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Execution Pipeline ─────────────────────────────────────────── */}
      <section id="pipeline" className="gradient-section px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.pipeline.title}</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-xl mx-auto">{t.pipeline.subtitle}</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="space-y-4">
            {pipelineSteps.map((s: { step: string; title: string; desc: string }, i: number) => (
              <motion.div key={s.step} variants={fadeUp} custom={i} className="flex gap-6 items-start bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-6 hover:border-emerald-500/20 transition-colors">
                <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Performance — Real KPI Data ────────────────────────────────── */}
      <section id="performance" className="px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.performance.title}</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              {t.performance.subtitle.replace("{days}", ov.test_days.toString()).replace("{period}", ov.period)}
            </motion.p>
          </motion.div>

          {/* Overview stats row */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: t.performance.labels.total_pnl, value: fmtD(ov.total_pnl, locale) },
              { label: t.performance.labels.total_trades, value: fmt(ov.total_trades, locale) },
              { label: t.performance.labels.tpd, value: ov.trades_per_day.toFixed(1) },
              { label: t.performance.labels.sharpe, value: ov.sharpe.toFixed(2) },
              { label: t.performance.labels.win_rate, value: fmtPct(ov.win_rate) },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 text-center">
                <div className="text-xl md:text-2xl font-bold text-emerald-400">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* KPI by Period table */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden mb-12">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-6 py-4 border-b border-zinc-800/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    {t.performance.kpi_dashboard}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-900/60 text-zinc-400 text-xs">
                        <th className="text-left px-5 py-3 font-medium">KPI</th>
                        {periodOrder.map((p) => (
                          <th key={p} className="text-center px-4 py-3 font-medium">{p}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {[
                        { label: t.performance.table_headers.days, fn: (k: string) => fmt((kpi as any)[k]?.actual_days ?? 0, locale) },
                        { label: t.performance.table_headers.total_trades, fn: (k: string) => fmt((kpi as any)[k]?.n_trades ?? 0, locale) },
                        { label: t.performance.table_headers.tpd, fn: (k: string) => ((kpi as any)[k]?.tpd ?? 0).toFixed(1) },
                        { label: t.performance.table_headers.total_pnl, fn: (k: string) => fmtD((kpi as any)[k]?.total_pnl ?? 0, locale), highlight: true },
                        { label: t.performance.table_headers.roi, fn: (k: string) => fmtP((kpi as any)[k]?.roi_pct ?? 0), highlight: true },
                        { label: t.performance.table_headers.daily_roi, fn: (k: string) => fmtP((kpi as any)[k]?.daily_roi_pct ?? 0), highlight: true },
                        { label: t.performance.table_headers.win_rate, fn: (k: string) => fmtPct((kpi as any)[k]?.win_rate ?? 0) },
                        { label: t.performance.table_headers.sharpe, fn: (k: string) => ((kpi as any)[k]?.sharpe ?? 0).toFixed(2) },
                        { label: t.performance.table_headers.max_dd, fn: (k: string) => fmtP(((kpi as any)[k]?.max_dd ?? 0) * 100) },
                        { label: t.performance.table_headers.final_equity, fn: (k: string) => fmtD((kpi as any)[k]?.final_equity ?? 0, locale) },
                        { label: t.performance.table_headers.peak_equity, fn: (k: string) => fmtD((kpi as any)[k]?.peak_equity ?? 0, locale) },
                      ].map((row: any) => (
                        <tr key={row.label} className={row.highlight ? "bg-emerald-500/5" : ""}>
                          <td className="px-5 py-3 text-zinc-400 font-medium">{row.label}</td>
                          {periodOrder.map((p: string) => (
                            <td key={p} className={`text-center px-4 py-3 font-mono ${row.highlight ? "text-emerald-400 font-semibold" : "text-zinc-300"}`}>
                              {row.fn(p)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 text-[10px] text-zinc-600 border-t border-zinc-800/40">
                  {t.performance.disclaimer.replace("{period}", ov.period).replace("{capital}", ov.starting_capital.toLocaleString())}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horizon breakdown */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid md:grid-cols-1 max-w-sm mx-auto gap-6 mb-12">
            {Object.entries(horizons).map(([label, h]: [string, any]) => (
              <Card key={label} className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">{label} Horizon</h4>
                    <span className={`text-xs font-mono px-2 py-1 rounded-full ${label === "1h" ? "bg-emerald-500/20 text-emerald-400" :
                      label === "4h" ? "bg-orange-500/20 text-orange-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>{fmt(h.n_trades, locale)} trades</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{t.performance.horizon_card.pnl}</span>
                      <span className="font-mono text-emerald-400">{fmtD(h.total_pnl, locale)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{t.performance.horizon_card.tpd}</span>
                      <span className="font-mono text-zinc-300">{h.tpd.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{t.performance.horizon_card.win_rate}</span>
                      <span className="font-mono text-zinc-300">{fmtPct(h.win_rate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{t.performance.horizon_card.sharpe}</span>
                      <span className="font-mono text-zinc-300">{h.sharpe.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">{t.performance.horizon_card.max_dd}</span>
                      <span className="font-mono text-zinc-300">{fmtD(h.max_dd, locale)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Advanced KPIs Panel */}
            {advancedKPIs && (
              <Card className="bg-zinc-900/40 border-emerald-500/20 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-emerald-400">Advanced Analytics</h4>
                    <Activity className="w-5 h-5 text-emerald-400/50" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Profit Factor</span>
                      <span className="font-mono text-zinc-300">{advancedKPIs.profit_factor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Payoff Ratio</span>
                      <span className="font-mono text-zinc-300">{advancedKPIs.payoff_ratio}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Max Win Streak</span>
                      <span className="font-mono text-emerald-400">{advancedKPIs.max_consecutive_wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Max Loss Streak</span>
                      <span className="font-mono text-red-400">{advancedKPIs.max_consecutive_losses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Avg Hold Time</span>
                      <span className="font-mono text-zinc-300">{advancedKPIs.avg_hold_bars} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
          </motion.div>

          {/* Session + Exchange tables side-by-side */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Session Performance */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
                  <h4 className="font-semibold text-sm">Performance by Session</h4>
                </div>
                <table className="w-full text-xs">
                  <thead><tr className="text-zinc-500 border-b border-zinc-800/40">
                    <th className="text-left px-4 py-2">Session</th>
                    <th className="text-right px-4 py-2">Trades</th>
                    <th className="text-right px-4 py-2">PnL</th>
                    <th className="text-right px-4 py-2">Win %</th>
                  </tr></thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {sessions.map((s: any) => (
                      <tr key={s.session}>
                        <td className="px-4 py-2.5 font-medium text-zinc-300">{s.session}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(s.n_trades, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(s.total_pnl, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{s.win_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Exchange Performance */}
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
                  <h4 className="font-semibold text-sm">Performance by Exchange</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-zinc-500 border-b border-zinc-800/40 sticky top-0 bg-zinc-900">
                      <th className="text-left px-4 py-2">Exchange</th>
                      <th className="text-right px-4 py-2">Trades</th>
                      <th className="text-right px-4 py-2">PnL</th>
                      <th className="text-right px-4 py-2">Win %</th>
                    </tr></thead>
                    <tbody className="divide-y divide-zinc-800/30">
                    {exchanges.map((e: any) => (
                      <tr key={e.exchange}>
                        <td className="px-4 py-2.5 font-medium text-zinc-300" title={e.name}>{e.exchange}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(e.n_trades, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(e.total_pnl, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{e.win_pct}%</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Stocks Leaderboard */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
                  <h4 className="font-semibold text-sm">🏆 Top 15 Stocks by PnL</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-zinc-500 border-b border-zinc-800/40">
                      <th className="text-left px-4 py-2">#</th>
                      <th className="text-left px-4 py-2">Ticker</th>
                      <th className="text-left px-4 py-2">Exchange</th>
                      <th className="text-left px-4 py-2">Session</th>
                      <th className="text-right px-4 py-2">Trades</th>
                      <th className="text-right px-4 py-2">PnL</th>
                      <th className="text-right px-4 py-2">Avg PnL %</th>
                      <th className="text-right px-4 py-2">Win %</th>
                    </tr></thead>
                    <tbody className="divide-y divide-zinc-800/30">
                    {topStocks.map((s: any, i: number) => (
                      <tr key={s.ticker} className={i < 3 ? "bg-emerald-500/5" : ""}>
                        <td className="px-4 py-2.5 text-zinc-600">{i + 1}</td>
                        <td className="px-4 py-2.5 font-mono font-medium text-zinc-200">{s.ticker}</td>
                        <td className="px-4 py-2.5 text-zinc-400">{s.exchange}</td>
                        <td className="px-4 py-2.5 text-zinc-400">{s.session}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(s.n_trades, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(s.total_pnl, locale)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-300">{fmtP(s.avg_pnl_pct)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{s.win_pct}%</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Return Projections ─────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-zinc-800/20">
        <div className="max-w-7xl mx-auto">
          {(() => {
            // Geometric daily rate from actual OOS equity curve
            const geoDailyPct  = (extraKPIs as any)?.mean_daily_return_pct  ?? ov.daily_roi_pct;
            const geoWeeklyPct = (extraKPIs as any)?.mean_weekly_return_pct ?? geoDailyPct * 5;
            const geoMonthlyPct= (extraKPIs as any)?.mean_monthly_return_pct ?? geoDailyPct * 21;
            const d = 1 + geoDailyPct / 100;
            const cpd = (start: number, days: number) => Math.round(start * Math.pow(d, days));
            return (<>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">What Does This Mean For Your Capital?</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              Geometric-compounded returns from {ov.test_days}-day OOS backtest. Geometric daily rate: <span className="text-emerald-400 font-mono">{fmtP(geoDailyPct)}</span>
            </motion.p>
          </motion.div>

          {/* Return rate cards — geometric */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Daily Return", value: fmtP(geoDailyPct),   sub: "geometric avg / trading day" },
              { label: "Weekly Return",  value: fmtP(geoWeeklyPct),  sub: "5 trading days compounded" },
              { label: "Monthly Return", value: fmtP(geoMonthlyPct), sub: "21 trading days compounded" },
              { label: "OOS ROI",        value: fmtP(ov.roi_pct),    sub: `actual ${ov.test_days}-day backtest` },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 border border-emerald-500/20 rounded-2xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono">{s.value}</div>
                <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                <div className="text-xs text-zinc-600 mt-1">{s.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Capital projection table — geometric compounding, 6-month max */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden mb-8">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-6 py-4 border-b border-zinc-800/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Theoretical Capital Growth — Geometric Compounding
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-900/60 text-zinc-400 text-xs">
                        <th className="text-left px-5 py-3 font-medium">Starting Capital</th>
                        <th className="text-center px-4 py-3 font-medium">After 1 Month</th>
                        <th className="text-center px-4 py-3 font-medium">After 3 Months</th>
                        <th className="text-center px-4 py-3 font-medium">After 6 Months</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {[
                        { label: "$1,000",   start: 1000 },
                        { label: "$5,000",   start: 5000 },
                        { label: "$10,000",  start: 10000 },
                        { label: "$50,000",  start: 50000 },
                        { label: "$100,000", start: 100000 },
                      ].map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? "bg-zinc-900/20" : ""}>
                          <td className="px-5 py-3 font-mono font-bold text-zinc-200">{row.label}</td>
                          <td className="text-center px-4 py-3 font-mono text-emerald-400">{fmtD(cpd(row.start, 21), locale)}</td>
                          <td className="text-center px-4 py-3 font-mono text-emerald-400">{fmtD(cpd(row.start, 63), locale)}</td>
                          <td className="text-center px-4 py-3 font-mono text-emerald-400 font-bold">{fmtD(cpd(row.start, 126), locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 text-[10px] text-zinc-600 border-t border-zinc-800/40">
                  ⚠ Theoretical projections based on {ov.test_days}-day OOS backtest geometric daily rate of {fmtP(geoDailyPct)}.
                  Actual results will vary. Past performance is not indicative of future results. Trading at leverage involves risk of significant capital loss.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Capital projection chart */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="group cursor-pointer"
            onClick={() => setLightbox({ src: "/capital_projection.png", alt: "Capital Growth Projection" })}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image src="/capital_projection.png" alt="Capital Growth Projection"
                    width={1600} height={900}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                    quality={90} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-sm mb-1">Capital Growth Projection</h4>
                  <p className="text-xs text-zinc-500">Log-scale view of $1K, $10K, and $100K starting capital compounded at backtest daily rate over the OOS period.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </>);
          })()}
        </div>
      </section>

      {/* ── Strategy Comparison ────────────────────────────────────── */}
      <section id="comparison" className="px-6 py-28 border-t border-zinc-800/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.comparison.title}</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              {t.comparison.subtitle}
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {strategyComparisonLocalized.map((s: any, i) => (
              <motion.div key={s._key} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl h-full flex flex-col group hover:border-emerald-500/30 transition-all duration-300">
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="h-1.5 w-12 rounded-full mb-4" style={{ backgroundColor: s.color }} />
                      <h3 className="text-2xl font-bold text-white mb-2">{s.name}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-zinc-800/40">
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{t.comparison.labels.roi_90d}</span>
                        <span className="text-2xl font-bold font-mono tracking-tight" style={{ color: s.color }}>{fmtP(s.roi_pct)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">{t.comparison.labels.sharpe}</span>
                        <span className="font-mono text-zinc-300">{s.sharpe}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">{t.comparison.labels.max_dd}</span>
                        <span className="font-mono text-zinc-300">{s.max_drawdown}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-16 text-center">
            <p className="text-xs text-zinc-600 italic">
              {t.comparison.disclaimer}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Backtest Charts Gallery ────────────────────────────────────── */}
      <section id="backtest" className="gradient-section px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">{t.backtest.title}</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              {t.backtest.subtitle
                .replace("{days}", ov.test_days.toString())
                .replace("{trades}", fmt(ov.total_trades, locale))
                .replace("{pnl}", fmtD(ov.total_pnl, locale))}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
            className="grid md:grid-cols-2 gap-6">
            {chartImages.map((chart, i) => (
              <motion.div key={chart.src} variants={fadeUp} custom={i}
                className="group cursor-pointer"
                onClick={() => setLightbox({ src: chart.src, alt: chart.title })}>
                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={chart.src}
                        alt={chart.title}
                        width={1600}
                        height={900}
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold text-sm mb-1">{chart.title}</h4>
                      <p className="text-xs text-zinc-500">{chart.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Asset Class Universe ─────────────────────────────────────── */}
      <section id="universe" className="px-6 py-24 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold">Full Asset Class Universe</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-zinc-500 max-w-2xl mx-auto text-sm">
              Asset-specific strategies per CLAUDE.md rules — ATR-based stops, session filters, and optimal leverage per class.
            </motion.p>
          </motion.div>

          {/* Asset sub-class breakdown table */}
          {(() => {
            // @ts-ignore
            const assetBreakdown: Record<string, any> = (backtestData as any).asset_breakdown ?? {};
            const subclassColors: Record<string, string> = {
              FOREX_MAJORS:      "#3b82f6",
              YEN_CROSSES:       "#8b5cf6",
              COMMODITY_CROSSES: "#06b6d4",
              EUR_GBP_CROSSES:   "#6366f1",
              EXOTIC_USD:        "#f97316",
              GOLD:              "#f59e0b",
              OIL:               "#84cc16",
              US_INDICES:        "#10b981",
              CRYPTO_BTC:        "#ef4444",
              CRYPTO_ETH:        "#f43f5e",
              CRYPTO_MID:        "#ec4899",
              CRYPTO_LOW:        "#db2777",
            };
            const subclassLabels: Record<string, string> = {
              FOREX_MAJORS:      "Forex Majors",
              YEN_CROSSES:       "Yen Crosses",
              COMMODITY_CROSSES: "Commodity Crosses",
              EUR_GBP_CROSSES:   "EUR & GBP Crosses",
              EXOTIC_USD:        "Exotic USD",
              GOLD:              "Gold (XAUUSD)",
              OIL:               "Oil (WTI/Brent)",
              US_INDICES:        "US Indices",
              CRYPTO_BTC:        "Bitcoin",
              CRYPTO_ETH:        "Ethereum",
              CRYPTO_MID:        "Mid-Tier Crypto",
              CRYPTO_LOW:        "Lower-Tier Crypto",
            };

            const hasData = Object.keys(assetBreakdown).length > 0;

            if (!hasData) {
              // Static fallback when backtest hasn't run yet
              const staticRows = [
                { key: "FOREX_MAJORS",      name: "Forex Majors",      strategy: "Trend-following",    tf: "15m",   lev: "10-20×", atr_sl: "1.5×", sessions: "London + NY open" },
                { key: "YEN_CROSSES",       name: "Yen Crosses",       strategy: "Pure trend (no MR)", tf: "1h",    lev: "5-15×",  atr_sl: "2.0×", sessions: "Tokyo-London overlap" },
                { key: "COMMODITY_CROSSES", name: "Commodity Crosses", strategy: "Range + breakout",   tf: "4h",    lev: "10-20×", atr_sl: "1.5×", sessions: "London session" },
                { key: "EUR_GBP_CROSSES",   name: "EUR & GBP Crosses", strategy: "Multi-TF trend",     tf: "4h",    lev: "10-20×", atr_sl: "1.75×", sessions: "London session" },
                { key: "EXOTIC_USD",        name: "Exotic USD",        strategy: "Swing only",         tf: "1d",    lev: "2-5×",   atr_sl: "2.5×", sessions: "Daily chart" },
                { key: "GOLD",              name: "Gold (XAUUSD)",     strategy: "Trend + ORB",        tf: "15m",   lev: "10-20×", atr_sl: "1.75×", sessions: "NY 9:30 EST" },
                { key: "OIL",               name: "Oil (WTI/Brent)",   strategy: "ORB + swing",        tf: "15m",   lev: "5-10×",  atr_sl: "1.5×", sessions: "NY 9:00 EST" },
                { key: "US_INDICES",        name: "US Indices",        strategy: "Intraday momentum",  tf: "15m",   lev: "10-20×", atr_sl: "1.5×", sessions: "NY 9:30-11:30 EST" },
                { key: "CRYPTO_BTC",        name: "Bitcoin",           strategy: "Swing 4H",           tf: "1h/4h", lev: "2-5×",   atr_sl: "2.0×", sessions: "NY-London overlap" },
                { key: "CRYPTO_ETH",        name: "Ethereum",          strategy: "Swing 4H",           tf: "1h/4h", lev: "3-5×",   atr_sl: "2.2×", sessions: "NY-London overlap" },
                { key: "CRYPTO_MID",        name: "Mid-Tier Alts",     strategy: "Trend-following",    tf: "4h",    lev: "2-3×",   atr_sl: "2.5×", sessions: "NY-London overlap" },
                { key: "CRYPTO_LOW",        name: "Lower-Tier Alts",   strategy: "Daily swing",        tf: "1d",    lev: "1-2×",   atr_sl: "2.75×", sessions: "Daily chart" },
              ];
              return (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                  <div className="overflow-x-auto rounded-2xl border border-zinc-800/50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                          <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Asset Class</th>
                          <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Strategy</th>
                          <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Entry TF</th>
                          <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Leverage</th>
                          <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">ATR Stop</th>
                          <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staticRows.map((row, i) => (
                          <motion.tr key={row.key} variants={fadeUp} custom={i}
                            className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full flex-shrink-0"
                                     style={{ backgroundColor: subclassColors[row.key] ?? "#666" }} />
                                <span className="font-medium text-white text-xs">{row.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-zinc-400 text-xs">{row.strategy}</td>
                            <td className="px-4 py-3 text-center"><span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{row.tf}</span></td>
                            <td className="px-4 py-3 text-center text-xs text-emerald-400 font-semibold">{row.lev}</td>
                            <td className="px-4 py-3 text-center text-xs text-amber-400 font-semibold">{row.atr_sl}</td>
                            <td className="px-4 py-3 text-zinc-500 text-xs">{row.sessions}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            }

            // Dynamic data from backtest
            const activeClasses = Object.entries(assetBreakdown).filter(([, v]: any) => v.n_trades > 0);
            return (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {activeClasses.slice(0, 8).map(([key, data]: any, i) => (
                    <motion.div key={key} variants={fadeUp} custom={i}>
                      <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full flex-shrink-0"
                                 style={{ backgroundColor: subclassColors[key] ?? "#666" }} />
                            <span className="text-xs font-medium text-zinc-300 truncate">
                              {subclassLabels[key] ?? key}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-zinc-600">Sharpe</div>
                              <div className={`font-bold ${(data.sharpe ?? 0) >= 1 ? "text-emerald-400" : "text-amber-400"}`}>
                                {(data.sharpe ?? 0).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-600">Win Rate</div>
                              <div className="font-bold text-white">
                                {((data.win_rate ?? 0) * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-600">Trades</div>
                              <div className="font-bold text-zinc-300">{data.n_trades}</div>
                            </div>
                            <div>
                              <div className="text-zinc-600">Mean PnL</div>
                              <div className={`font-bold ${(data.mean_pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {fmtP(data.mean_pnl ?? 0)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Full table for all classes */}
                <div className="overflow-x-auto rounded-2xl border border-zinc-800/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                        <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Asset Class</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Trades</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Win Rate</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Mean PnL</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Sharpe</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Max DD</th>
                        <th className="text-center px-4 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Total Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(assetBreakdown).map(([key, data]: any, i) => (
                        <motion.tr key={key} variants={fadeUp} custom={i}
                          className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0"
                                   style={{ backgroundColor: subclassColors[key] ?? "#666" }} />
                              <span className="font-medium text-white text-xs">{subclassLabels[key] ?? key}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-zinc-300">{data.n_trades}</td>
                          <td className="px-4 py-3 text-center text-xs font-semibold text-white">
                            {((data.win_rate ?? 0) * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-semibold">
                            <span className={(data.mean_pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
                              {fmtP(data.mean_pnl ?? 0)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-semibold">
                            <span className={(data.sharpe ?? 0) >= 1 ? "text-emerald-400" : (data.sharpe ?? 0) >= 0 ? "text-amber-400" : "text-red-400"}>
                              {(data.sharpe ?? 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-red-400">{(data.max_dd ?? 0).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-center text-xs font-semibold">
                            <span className={(data.total_return ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}>
                              {fmtP(data.total_return ?? 0)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Partnership ────────────────────────────────────────────────── */}
      <section id="partnership" className="px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Performance-Based Partnership</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">Aligned incentives, institutional transparency, and zero management fees.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} custom={0}>
              <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 transition-colors h-full">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Aligned Incentives</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    50/50 net realised profit split. No management fees.
                    <strong> Investor returns are capped at 20% monthly</strong> to ensure sustainable scaling and reserve building.
                    If capital does not grow, no performance compensation is taken.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-emerald-400">50/50</div>
                      <div className="text-[10px] text-zinc-500">Profit Split</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-emerald-400">0%</div>
                      <div className="text-[10px] text-zinc-500">Management Fee</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl hover:border-emerald-500/30 transition-colors h-full">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <Lock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Institutional Readiness</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    <strong>Capital Secured:</strong> Principal protection mechanisms and automated risk gates.
                    Detailed execution logs and full performance disclosure available under NDA.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-zinc-500">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Full trade-by-trade audit trail</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Infrastructure architecture documentation</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Walk-forward backtest methodology</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Risk management framework</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA / Contact ──────────────────────────────────────────────── */}
      <section id="contact" className="relative gradient-section px-6 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="relative z-10 max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-6xl font-bold tracking-tight">{t.cta.title}</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-zinc-400 mt-6 text-lg leading-relaxed">
            {t.cta.description}
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="mailto:invest@advecta.live">
              <Button className="rounded-full px-8 py-5 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:from-emerald-400 hover:to-cyan-400 glow-accent">
                {t.cta.button} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="/deck.html" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full px-8 py-5 text-base">{t.cta.view_overview}</Button>
            </a>
          </motion.div>
          <motion.p variants={fadeUp} custom={3} className="mt-8 text-xs text-zinc-600">
            {t.cta.disclaimer}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold tracking-tight">ADVECTA</span>
            <span className="text-xs text-zinc-600 ml-2">{t.footer.definition}</span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="#about" className="hover:text-zinc-400 transition-colors">{t.nav.strategy}</a>
            <a href="#technology" className="hover:text-zinc-400 transition-colors">{t.nav.technology}</a>
            <a href="#performance" className="hover:text-zinc-400 transition-colors">{t.nav.performance}</a>
            <a href="#backtest" className="hover:text-zinc-400 transition-colors">{t.nav.backtest}</a>
            <a href="#contact" className="hover:text-zinc-400 transition-colors">{t.nav.contact}</a>
          </div>
          <p className="text-xs text-zinc-700">&copy; {new Date().getFullYear()} ADVECTA. {t.footer.rights}</p>
        </div>
        <div className="border-t border-zinc-900 py-4 text-center">
          <p className="text-xs text-zinc-700">
            <a href="mailto:invest@advecta.live" className="hover:text-zinc-400 transition-colors">invest@advecta.live</a>
            {" · "}
            {t.footer.product_of}{" "}
            <a href="https://deff-consulting.org" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">deff-consulting.org</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
