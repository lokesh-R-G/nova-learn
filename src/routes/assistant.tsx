import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Atom, Calculator, FlaskConical, Globe, Languages, Wand2 } from "lucide-react";
import { Card, PageHeader, Badge } from "@/components/app/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Learning Assistant — AetherLMS" },
      { name: "description", content: "Subject-wise AI learning assistant with question generation." },
    ],
  }),
  component: Assistant,
});

const subjects = [
  { id: "physics", name: "Physics", icon: Atom },
  { id: "math", name: "Mathematics", icon: Calculator },
  { id: "chem", name: "Chemistry", icon: FlaskConical },
  { id: "hist", name: "History", icon: Globe },
  { id: "eng", name: "English", icon: Languages },
];

type Msg = { id: number; role: "user" | "ai"; text: string };

const SEED: Record<string, Msg[]> = {
  physics: [
    { id: 1, role: "ai", text: "Hi Aria! I'm your Physics tutor. Want a quick recap of last week's wave mechanics, or shall we dive into practice problems?" },
  ],
  math: [
    { id: 1, role: "ai", text: "Hi! Let's tackle Integral Calculus. I noticed you got 6/10 on Set 3 — want me to generate targeted practice on integration by parts?" },
  ],
  chem: [{ id: 1, role: "ai", text: "Welcome to Chemistry chat. Ask me anything about reactions, bonding or your last lab." }],
  hist: [{ id: 1, role: "ai", text: "Hello! Ready to explore the Industrial Revolution? I can quiz you or summarise your reading." }],
  eng: [{ id: 1, role: "ai", text: "Hi! Need help analysing a poem, writing an essay, or revising vocabulary?" }],
};

function Assistant() {
  const [active, setActive] = useState("math");
  const [conv, setConv] = useState<Record<string, Msg[]>>(SEED);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = conv[active] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, active]);

  function send(text?: string) {
    const t = (text ?? draft).trim();
    if (!t) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text: t };
    setConv((c) => ({ ...c, [active]: [...(c[active] ?? []), userMsg] }));
    setDraft("");
    setTimeout(() => {
      const reply: Msg = {
        id: Date.now() + 1, role: "ai",
        text: "Great question — here's a short walkthrough. Step 1: identify the technique. Step 2: apply it carefully. Want me to generate 3 similar problems for practice?",
      };
      setConv((c) => ({ ...c, [active]: [...(c[active] ?? []), reply] }));
    }, 700);
  }

  return (
    <>
      <PageHeader
        title="Learning Assistant"
        subtitle="Your personal AI tutor — subject by subject"
        actions={<Badge tone="brand"><Sparkles className="mr-1 inline size-3" /> Aether AI</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit p-3">
          <div className="px-2 pt-2 pb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subjects</div>
          <div className="space-y-1">
            {subjects.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    isActive ? "bg-brand-50 text-brand-700" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <s.icon className={cn("size-4", isActive && "text-brand-600")} />
                  {s.name}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex h-[640px] flex-col p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold">{subjects.find((s) => s.id === active)?.name} Tutor</p>
                <p className="text-xs text-muted-foreground">Online · Personalised for Grade 11-A</p>
              </div>
            </div>
            <button
              onClick={() => send("Generate 5 practice questions for me.")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            >
              <Wand2 className="size-3.5" /> Generate Questions
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", m.role === "user" && "justify-end")}
              >
                {m.role === "ai" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <Sparkles className="size-3.5" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "rounded-tl-sm bg-secondary text-foreground"
                    : "rounded-tr-sm bg-brand-600 text-brand-foreground",
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border px-5 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {["Explain this topic", "Quiz me", "Summarise my notes", "Help with homework"].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-brand-50 hover:text-brand-700"
                >{s}</button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-brand-500/30"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask anything about your subject…"
                className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-brand-foreground shadow-sm shadow-brand-600/30 transition hover:bg-brand-700"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
