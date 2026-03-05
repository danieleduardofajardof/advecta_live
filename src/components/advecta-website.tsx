"use client";

import React, { useState } from "react";
import Image from "next/image";
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
const sessions = backtestData.session_performance;
const exchanges = backtestData.exchange_performance;
const topStocks = backtestData.top_stocks;
// @ts-ignore
const strategyComparison = backtestData.strategy_comparison;

/* helpers */
const fmt = (n: number) => n.toLocaleString("en-US");
const fmtD = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtP = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const fmtPct = (n: number) => (n * 100).toFixed(1) + "%";

/* ─────────── static data ─────────── */
const coreFeatures = [
  {
    icon: Activity,
    title: "Volatility Detection",
    desc: "Regime classification and variance modelling identify structured intraday opportunities under favourable liquidity conditions.",
  },
  {
    icon: Zap,
    title: "Execution Discipline",
    desc: "API-based systematic trade execution. No discretionary override. Fully rules-driven capital deployment.",
  },
  {
    icon: Shield,
    title: "Risk Governance",
    desc: "Daily loss caps, position limits, and volatility pause mechanisms ensure capital preservation remains primary.",
  },
];

const strategyParams = [
  { label: "Starting Capital", value: fmtD(ov.starting_capital) },
  { label: "Target Return", value: "20% Monthly Cap" },
  { label: "Frequency", value: "High (1h Prediction)" },
  { label: "Capital Security", value: "Principal Protected" },
  { label: "Position Size", value: fmtD(ov.position_size) },
  { label: "Prediction Horizon", value: "1 Hour (Hybrid)" },
  { label: "Global Sessions", value: "APAC · S-ASIA · EU · US" },
  { label: "Profit Split", value: "50/50 Performance" },
  { label: "Backtest Period", value: "90 Days (Live Verify)" },
  { label: "Test Status", value: "Active / Verified" },
];

const techStack = [
  { icon: Globe, title: "12 Global Exchanges", desc: "24-hour coverage across APAC, South-Asia, Europe, and Americas sessions." },
  { icon: Layers, title: "Multi-Horizon Prediction", desc: "Three prediction windows (2h, 4h, 8h) with independent model tuning per stock per horizon." },
  { icon: BarChart3, title: "Walk-Forward Backtest", desc: `${ov.test_days}-day rolling optimisation with market health overlays and dynamic stock selection.` },
  { icon: TrendingUp, title: "Mean-Reversion Engine", desc: "Buy at predicted MA − k×σ, sell only at entry + 1%. Aggressive low-k bands for high-frequency entries." },
  { icon: Clock, title: "Real-Time Execution", desc: "60-second cycle bot with live API integration, intelligent order routing, and position management." },
  { icon: Lock, title: "Risk Controls", desc: "Composite 11-component market health filter (SPY, VIX, TLT, HYG, sectors) gates every trade." },
];

const pipelineSteps = [
  { step: "01", title: "Market Health", desc: "11-component composite score (SPY, VIX, TLT, HYG, sectors) classifies regime as GREEN / YELLOW / RED." },
  { step: "02", title: "Stock Selection", desc: "Top 5 per exchange ranked by liquidity × volatility. Re-selected every 10 trading days." },
  { step: "03", title: "Model Training", desc: "Per-horizon grid search over (EMA, lookback, k) optimising for TPD × Sharpe. Re-trained every 15 days." },
  { step: "04", title: "Signal Generation", desc: "Predicted MA ± k×σ bands computed at each slice boundary. BUY when price ≤ lower band." },
  { step: "05", title: "Execution", desc: "API-based order placement with 1% target-only exit. No stop-loss — position held until target hit." },
  { step: "06", title: "Risk & Reporting", desc: "Daily P&L tracking, drawdown monitoring, Sharpe calculation, and automated performance dashboards." },
];

/* chart images (served from /public) */
const chartImages = [
  { src: "/strategy_comparison.png", title: "Strategy Comparison (Equity)", desc: "Comparative equity curves for Foundation (Low-Risk), Momentum (High-Risk), and Hybrid (Balanced) models over 90 trading days." },
  { src: "/kpi_comparison.png", title: "Strategy KPI Benchmarks", desc: "Detailed breakdown of ROI (%) and Sharpe Ratio across the three primary strategy profiles." },
  { src: "/backtest_90d.png", title: "Hybrid 90-Day Performance", desc: "Equity curve for the 1h horizon strategy using the hybrid optimization model over the last 90 trading days." },
  { src: "/cumulative_pnl.png", title: "Cumulative PnL", desc: "Combined and per-horizon cumulative profit over the full backtest period with period boundary markers." },
  { src: "/equity_overlay.png", title: "Capital Growth — All Periods", desc: "Equity curves for 1 Month, 90 Days, 6 Months, and 1 Year overlaid on a single chart." },
  { src: "/equity_panels.png", title: "Equity Curves by Period", desc: "Four-panel view with high-water marks and drawdown shading for each evaluation window." },
  { src: "/session_performance.png", title: "Session & Horizon Performance", desc: "PnL breakdown by trading session (APAC, S-ASIA, EUROPE, AMERICAS) and prediction horizon." },
  { src: "/drawdown.png", title: "Drawdown Analysis", desc: "Aggregate and per-horizon drawdown tracking throughout the backtest." },
  { src: "/daily_returns_dist.png", title: "Daily Return Distributions", desc: "Violin plots showing daily ROI distribution for each evaluation period." },
  { src: "/pnl_heatmap.png", title: "Stock PnL Heatmap", desc: "Daily PnL heatmap for the top 20 most-traded stocks." },
  { src: "/monthly_horizon_heatmap.png", title: "Monthly Horizon PnL", desc: "Monthly P&L breakdown by prediction horizon (2h, 4h, 8h) across the full year." },
];


/* KPI period order */
const periodOrder = ["1 Month", "90 Days", "6 Months", "1 Year"] as const;

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

export default function AdvectaWebsite() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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
            <a href="#about" className="hover:text-white transition-colors">Strategy</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#performance" className="hover:text-white transition-colors">Performance</a>
            <a href="#backtest" className="hover:text-white transition-colors">Backtest</a>
            <a href="#partnership" className="hover:text-white transition-colors">Partnership</a>
          </div>
          <Button
            className="rounded-full px-5 text-sm h-9"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Request NDA
          </Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative gradient-hero min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Systematic Intraday Alpha Engine
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-6xl md:text-8xl font-bold tracking-tighter glow-text">
            ADVECTA
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg md:text-2xl text-zinc-400 font-light tracking-wide">
            Asset Driven Volatility Execution &amp; Capital Trade Algo
          </motion.p>

          <motion.p variants={fadeUp} custom={3} className="mt-6 max-w-2xl mx-auto text-zinc-500 leading-relaxed">
            A fully systematic intraday execution engine capturing structured
            volatility inefficiencies across 12 global exchanges with
            disciplined risk control and performance-based alignment.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button className="rounded-full px-7 py-5 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:from-emerald-400 hover:to-cyan-400 glow-accent"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Request NDA <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="rounded-full px-7 py-5 text-base"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              View Strategy Overview
            </Button>
          </motion.div>

          {/* Hero stats from real data */}
          <motion.div variants={fadeUp} custom={5} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: fmt(ov.total_trades), label: `Trades (${ov.test_days}d)` },
              { value: fmtP(ov.daily_roi_pct), label: "Avg Daily ROI" },
              { value: ov.sharpe.toFixed(1), label: "Sharpe Ratio" },
              { value: fmtPct(ov.win_rate), label: "Win Rate" },
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
            Systematic Intraday Alpha
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            Three pillars of a disciplined execution framework designed for consistent capital growth.
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
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Strategy Parameters</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500">Core configuration driving the ADVECTA execution engine.</motion.p>
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
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Technology &amp; Infrastructure</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">Purpose-built quantitative stack for systematic intraday execution.</motion.p>
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
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Execution Pipeline</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-xl mx-auto">Six-stage systematic workflow from market regime assessment to trade execution.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="space-y-4">
            {pipelineSteps.map((s, i) => (
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
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Backtest Performance</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              Walk-forward backtest results over {ov.test_days} trading days ({ov.period}).
            </motion.p>
          </motion.div>

          {/* Overview stats row */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: "Total PnL", value: fmtD(ov.total_pnl) },
              { label: "Total Trades", value: fmt(ov.total_trades) },
              { label: "Trades / Day", value: ov.trades_per_day.toFixed(1) },
              { label: "Sharpe Ratio", value: ov.sharpe.toFixed(2) },
              { label: "Win Rate", value: fmtPct(ov.win_rate) },
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
                    KPI Dashboard — Multi-Period Results
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
                        { label: "Trading Days", fn: (k: string) => fmt((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.actual_days ?? 0) },
                        { label: "Total Trades", fn: (k: string) => fmt((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.n_trades ?? 0) },
                        { label: "Trades / Day", fn: (k: string) => ((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.tpd ?? 0).toFixed(1) },
                        { label: "Total PnL", fn: (k: string) => fmtD((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.total_pnl ?? 0), highlight: true },
                        { label: "★ ROI %", fn: (k: string) => fmtP((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.roi_pct ?? 0), highlight: true },
                        { label: "★ Daily ROI %", fn: (k: string) => fmtP((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.daily_roi_pct ?? 0), highlight: true },
                        { label: "Win Rate", fn: (k: string) => fmtPct((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.win_rate ?? 0) },
                        { label: "Sharpe Ratio", fn: (k: string) => ((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.sharpe ?? 0).toFixed(2) },
                        { label: "Max Drawdown", fn: (k: string) => fmtD((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.max_dd ?? 0) },
                        { label: "Final Equity", fn: (k: string) => fmtD((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.final_equity ?? 0) },
                        { label: "Peak Equity", fn: (k: string) => fmtD((kpi as Record<string, typeof kpi[keyof typeof kpi]>)[k]?.peak_equity ?? 0) },
                      ].map((row) => (
                        <tr key={row.label} className={row.highlight ? "bg-emerald-500/5" : ""}>
                          <td className="px-5 py-3 text-zinc-400 font-medium">{row.label}</td>
                          {periodOrder.map((p) => (
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
                  Walk-forward backtest • {ov.period} • {ov.starting_capital.toLocaleString()} starting capital • Target-only exits at entry × 1.01
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Horizon breakdown */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.entries(horizons).map(([label, h]) => (
              <Card key={label} className="bg-zinc-900/40 border-zinc-800/50 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold">{label} Horizon</h4>
                    <span className={`text-xs font-mono px-2 py-1 rounded-full ${label === "2h" ? "bg-emerald-500/20 text-emerald-400" :
                      label === "4h" ? "bg-orange-500/20 text-orange-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>{fmt(h.n_trades)} trades</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Total PnL</span>
                      <span className="font-mono text-emerald-400">{fmtD(h.total_pnl)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Trades / Day</span>
                      <span className="font-mono text-zinc-300">{h.tpd.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Win Rate</span>
                      <span className="font-mono text-zinc-300">{fmtPct(h.win_rate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Sharpe</span>
                      <span className="font-mono text-zinc-300">{h.sharpe.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Max DD</span>
                      <span className="font-mono text-zinc-300">{fmtD(h.max_dd)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    {sessions.map((s) => (
                      <tr key={s.session}>
                        <td className="px-4 py-2.5 font-medium text-zinc-300">{s.session}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(s.n_trades)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(s.total_pnl)}</td>
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
                      {exchanges.map((e) => (
                        <tr key={e.exchange}>
                          <td className="px-4 py-2.5 font-medium text-zinc-300" title={e.name}>{e.exchange}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(e.n_trades)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(e.total_pnl)}</td>
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
                      {topStocks.map((s, i) => (
                        <tr key={s.ticker} className={i < 3 ? "bg-emerald-500/5" : ""}>
                          <td className="px-4 py-2.5 text-zinc-600">{i + 1}</td>
                          <td className="px-4 py-2.5 font-mono font-medium text-zinc-200">{s.ticker}</td>
                          <td className="px-4 py-2.5 text-zinc-400">{s.exchange}</td>
                          <td className="px-4 py-2.5 text-zinc-400">{s.session}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-zinc-400">{fmt(s.n_trades)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-emerald-400">{fmtD(s.total_pnl)}</td>
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

      {/* ── Strategy Comparison ────────────────────────────────────── */}
      <section id="comparison" className="px-6 py-28 border-t border-zinc-800/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">The Three ADVECTA Strategies</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              Our core engine supports three primary risk profiles, from steady capital preservation to aggressive alpha generation.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {Object.entries(strategyComparison).map(([key, s]: [string, any], i) => (
              <motion.div key={key} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl h-full flex flex-col group hover:border-emerald-500/30 transition-all duration-300">
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="h-1.5 w-12 rounded-full mb-4" style={{ backgroundColor: s.color }} />
                      <h3 className="text-2xl font-bold text-white mb-2">{s.name}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="mt-auto space-y-4 pt-6 border-t border-zinc-800/40">
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">90d ROI</span>
                        <span className="text-2xl font-bold font-mono tracking-tight" style={{ color: s.color }}>{fmtP(s.roi_pct)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Sharpe Ratio</span>
                        <span className="font-mono text-zinc-300">{s.sharpe}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Max Drawdown</span>
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
              *All figures derived from 90-day walk-forward backtests with realistic slippage and institutional fee calculation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Backtest Charts Gallery ────────────────────────────────────── */}
      <section id="backtest" className="gradient-section px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold">Backtest Visualisations</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-zinc-500 max-w-2xl mx-auto">
              Full walk-forward backtest charts — {ov.test_days} trading days, {fmt(ov.total_trades)} trades, {fmtD(ov.total_pnl)} total PnL. Click any chart to enlarge.
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
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-6xl font-bold tracking-tight">Partner with ADVECTA</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-zinc-400 mt-6 text-lg leading-relaxed">
            Seeking strategic capital partners aligned with systematic execution, disciplined risk management, and performance-based growth.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="mailto:invest@advecta.live">
              <Button className="rounded-full px-8 py-5 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:from-emerald-400 hover:to-cyan-400 glow-accent">
                Initiate Discussion <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="/deck.html" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full px-8 py-5 text-base">View Overview</Button>
            </a>
          </motion.div>
          <motion.p variants={fadeUp} custom={3} className="mt-8 text-xs text-zinc-600">
            All strategy details, performance data, and infrastructure documentation are shared exclusively under NDA.
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
            <span className="text-xs text-zinc-600 ml-2">Asset Driven Volatility Execution &amp; Capital Trade Algo</span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="#about" className="hover:text-zinc-400 transition-colors">Strategy</a>
            <a href="#technology" className="hover:text-zinc-400 transition-colors">Technology</a>
            <a href="#performance" className="hover:text-zinc-400 transition-colors">Performance</a>
            <a href="#backtest" className="hover:text-zinc-400 transition-colors">Backtest</a>
            <a href="#contact" className="hover:text-zinc-400 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-zinc-700">&copy; {new Date().getFullYear()} ADVECTA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
