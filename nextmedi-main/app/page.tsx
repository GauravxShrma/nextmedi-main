"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Brain,
  CheckCircle2,
  FileAudio,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Waves,
  X,
} from "lucide-react";

const MedicalAurora = dynamic(
  () => import("@/components/visuals/MedicalAurora"),
  { ssr: false }
);

const STEPS = [
  {
    title: "Upload", 
    description: "Securely add a stethoscope or vocal recording in seconds.",
  },
  {
    title: "Analyze", 
    description: "Gemini AI denoises the input and surfaces clinical signals.",
  },
  {
    title: "Summarize", 
    description: "Receive actionable highlights for symptoms, conditions, and care.",
  },
];

const formatSection = (text: string, title: string) => {
  const regex = new RegExp(`\\*\\*${title}:\\*\\*[\\s\\S]*?(?=\\*\\*|$)`, "i");
  const match = text.match(regex);
  return match ? match[0].replace(`**${title}:**`, "").trim() : "";
};

type Summary = {
  symptoms: string;
  conditions: string;
  recommendations: string;
};

const useSummary = (aiResponse: string): Summary | null =>
  useMemo(() => {
    if (!aiResponse) return null;
    return {
      symptoms: formatSection(aiResponse, "Key Symptoms"),
      conditions: formatSection(aiResponse, "Possible Conditions"),
      recommendations: formatSection(aiResponse, "Medical Recommendations"),
    };
  }, [aiResponse]);

export default function MedicalAudioAnalyzer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const summary = useSummary(aiResponse);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setError("");
    setAiResponse("");
  };

  const processAudio = async () => {
    if (!audioFile) {
      setError("Please select an audio file to begin the analysis.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      setAiResponse("");

      const buffer = await audioFile.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const response = await fetch("/api/AI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType: audioFile.type,
        }),
      });

      if (!response.ok) throw new Error("Audio analysis failed. Please try again.");

      const data = await response.json();
      setAiResponse(data.analysis || "No response from AI.");
    } catch (err: unknown) {
      console.error("❌ Audio Processing Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to process audio.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setAiResponse("");
    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <MedicalAurora />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(30,64,175,0.35)_0%,rgba(2,6,23,0.95)_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-6xl px-6 pt-12 pb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
            <Sparkles className="h-4 w-4" /> Live Clinical Intelligence
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
            Decode every heartbeat with
            <span className="ml-2 inline-block bg-gradient-to-r from-cyan-200 via-emerald-300 to-sky-500 bg-clip-text text-transparent">
              Gemini AI insight
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-slate-300 sm:text-lg">
            Transform raw stethoscope, breath, or voice recordings into crystal-clear
            clinical narratives. Upload, analyze, and receive AI-guided summaries in a
            luminous, calm workspace crafted for care teams.
          </p>
        </header>

        <main className="relative z-10 flex-1 pb-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">AI Audio Triage</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                      Upload clinical audio to unlock structured findings, prioritized risks,
                      and next-step recommendations powered by Gemini.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    HIPAA-aware sandbox
                  </div>
                </div>

                <div className="mt-8">
                  {!audioFile ? (
                    <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-cyan-400/40 bg-slate-900/40 px-6 py-12 text-center transition duration-300 hover:border-cyan-300/70 hover:bg-slate-900/70">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/60 shadow-lg shadow-cyan-500/20 transition group-hover:shadow-cyan-400/30">
                        <Upload className="h-12 w-12 text-cyan-200" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-white">Drop your audio here</p>
                        <p className="text-sm text-slate-400">
                          MP3, WAV, OGG, or WebM • Under 10 minutes recommended
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
                        <span className="rounded-full border border-cyan-400/40 px-3 py-1">Noise-safe</span>
                        <span className="rounded-full border border-cyan-400/40 px-3 py-1">Zero setup</span>
                        <span className="rounded-full border border-cyan-400/40 px-3 py-1">Realtime</span>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30">
                            <FileAudio className="h-6 w-6 text-cyan-100" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Ready for analysis</p>
                            <p className="text-lg font-semibold text-white">{audioFile.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleReset}
                          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-slate-100"
                        >
                          <X className="h-4 w-4 group-hover:text-rose-300" />
                          Remove file
                        </button>
                      </div>

                      <button
                        onClick={processAudio}
                        disabled={isProcessing}
                        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-sky-500 px-6 py-4 text-lg font-semibold text-slate-950 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 opacity-0 transition duration-300 group-hover:opacity-100" />
                        {isProcessing ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing with Gemini...
                          </span>
                        ) : (
                          "Analyze recording"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="mt-8 flex items-center gap-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-4 text-sm text-cyan-100">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Parsing waveforms, detecting murmurs, and scoring acoustic biomarkers.
                  </div>
                )}

                {error && (
                  <div className="mt-8 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
                    <AlertCircle className="mt-0.5 h-5 w-5" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {aiResponse && summary && (
                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    {summary.symptoms && (
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                        <div className="flex items-center gap-3 text-cyan-200">
                          <Stethoscope className="h-5 w-5" />
                          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Symptoms</span>
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {summary.symptoms}
                        </p>
                      </div>
                    )}
                    {summary.conditions && (
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                        <div className="flex items-center gap-3 text-emerald-200">
                          <Activity className="h-5 w-5" />
                          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Conditions</span>
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {summary.conditions}
                        </p>
                      </div>
                    )}
                    {summary.recommendations && (
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
                        <div className="flex items-center gap-3 text-sky-200">
                          <HeartPulse className="h-5 w-5" />
                          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Care Path</span>
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {summary.recommendations}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-500/10 hover:text-white"
                  >
                    <Waves className="h-4 w-4" />
                    Start a new analysis
                  </button>
                </div>
              )}
            </section>

            <aside className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3 text-cyan-200">
                  <Brain className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">workflow</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">How Gemini Elevates Diagnostics</h3>
                <div className="mt-6 space-y-5">
                  {STEPS.map((step, index) => (
                    <div key={step.title} className="relative rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                      <div className="absolute -left-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/80 text-lg font-semibold text-cyan-200 shadow shadow-cyan-500/20 lg:flex">
                        0{index + 1}
                      </div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                        {step.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3 text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Assurance</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">Clinical-grade safeguards</h3>
                <ul className="mt-4 space-y-3 text-sm text-emerald-100">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    End-to-end encrypted uploads and automatic file purging.
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    AI explains findings with confidence cues for rapid triage.
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    Export-ready summaries aligned to clinical documentation.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3 text-rose-200">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Disclaimer</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-rose-100">
                  The Medical Audio Analyzer provides decision support only. Do not regard
                  AI output as a substitute for comprehensive clinical evaluation, emergency
                  services, or physician-led diagnosis.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
