import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Check, ChevronRight, Trophy } from "lucide-react";
import { loadGame, saveGame } from "@/lib/wedding-preview";

export const Route = createFileRoute("/game")({ component: WeddingGame });

const challenges = [
  { title: "Cara smiling", detail: "Capture a genuine smile from Cara.", points: 10 },
  { title: "The venue", detail: "Find a beautiful detail at Tokara.", points: 10 },
  { title: "Food", detail: "Photograph the best-looking dish.", points: 10 },
  { title: "Table fun", detail: "Get the whole table into one photo.", points: 20 },
  { title: "First dance", detail: "Capture a moment from the first dance.", points: 20 },
  { title: "Wedding rings", detail: "Find a creative ring shot.", points: 10 },
  { title: "Riel & Cara", detail: "Get a photo with the newlyweds.", points: 25 },
  { title: "Best dance move", detail: "Catch the best dance-floor moment.", points: 25 },
];

function WeddingGame() {
  const [table, setTable] = useState("4");
  const [done, setDone] = useState<number[]>(() => loadGame(Number(table)));
  const [lastTable, setLastTable] = useState(table);
  useEffect(() => { if (lastTable !== table) { setDone(loadGame(Number(table))); setLastTable(table); } }, [table, lastTable]);
  useEffect(() => { saveGame(Number(table), done); }, [table, done]);

  const points = useMemo(() => challenges.reduce((sum, item, index) => done.includes(index) ? sum + item.points : sum, 0), [done]);
  const leaderboard = [{ table: 4, score: points }, { table: 7, score: 155 }, { table: 2, score: 140 }, { table: 1, score: 120 }].sort((a,b) => b.score-a.score);

  return (
    <main className="min-h-screen bg-[#292823] text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-[0.25em]">R <span className="text-[#d4b56e]">&</span> C</Link>
          <Link to="/photos" className="text-xs uppercase tracking-[0.18em] text-white/65">Photos</Link>
        </div>
      </header>
      <section className="mx-auto max-w-lg px-4 pb-16 pt-10">
        <div className="text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4b56e]">Spy With My Eye</p>
          <h1 className="mt-3 font-serif text-5xl italic">Wedding game</h1>
          <p className="mt-3 text-sm leading-6 text-white/55">Scan your table QR, choose your team, then complete photo challenges together.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
          <label className="text-[0.6rem] uppercase tracking-[0.2em] text-white/45">Preview table</label>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {["1","2","3","4","5","6","7","8"].map((item) => <button key={item} onClick={() => setTable(item)} className={`rounded-full px-4 py-2 text-xs ${table === item ? "bg-[#d4b56e] text-[#292823]" : "bg-white/10 text-white/70"}`}>Table {item}</button>)}
          </div>
          <div className="mt-5 flex items-end justify-between"><div><p className="text-xs text-white/45">Table {table} score</p><p className="mt-1 font-serif text-4xl">{points}</p></div><Trophy className="h-6 w-6 text-[#d4b56e]" /></div>
        </div>

        <div className="mt-6 space-y-3">
          {challenges.map((item, index) => {
            const completed = done.includes(index);
            return (
              <button key={item.title} onClick={() => setDone((current) => completed ? current.filter((x) => x !== index) : [...current, index])} className={`w-full rounded-2xl p-4 text-left ring-1 transition ${completed ? "bg-[#d4b56e]/10 ring-[#d4b56e]/50" : "bg-white/5 ring-white/10"}`}>
                <div className="flex items-center gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${completed ? "bg-[#d4b56e] text-[#292823]" : "bg-white/10"}`}>{completed ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}</span>
                  <span className="min-w-0 flex-1"><span className="block font-serif text-lg">{item.title}</span><span className="mt-1 block text-xs leading-5 text-white/45">{item.detail}</span></span>
                  <span className="font-serif text-lg text-[#d4b56e]">+{item.points}</span>
                  <ChevronRight className="h-4 w-4 text-white/25" />
                </div>
              </button>
            );
          })}
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between"><p className="text-[0.6rem] uppercase tracking-[0.25em] text-[#d4b56e]">Live leaderboard</p><span className="text-xs text-white/35">Preview data</span></div>
          <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-white/10">
            {leaderboard.map((row, index) => <div key={row.table} className="flex items-center gap-4 border-b border-white/10 bg-white/[0.03] px-4 py-4 last:border-0"><span className="w-6 text-center font-serif text-lg text-[#d4b56e]">{index + 1}</span><span className="flex-1 text-sm">Table {row.table}</span><span className="font-serif text-lg">{row.score}</span></div>)}
          </div>
        </section>
      </section>
    </main>
  );
}
