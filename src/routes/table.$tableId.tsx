import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Camera, Check, Gamepad2, ImagePlus, QrCode, Trophy, Upload } from "lucide-react";

export const Route = createFileRoute("/table/$tableId")({ component: TablePortal });

const challenges = [
  ["Cara smiling", "Find a genuine smile from the bride.", 10],
  ["The venue", "Capture your favourite detail at Tokara.", 10],
  ["Wedding rings", "Get a creative photo of the rings.", 10],
  ["Table fun", "Everyone at your table in one photo.", 20],
  ["First dance", "Capture the first dance moment.", 20],
  ["Cheers!", "A photo of your table making a toast.", 10],
  ["Food", "Show us the best-looking plate.", 10],
  ["Riel & Cara", "Get a photo with the newlyweds.", 25],
] as const;

function TablePortal() {
  const { tableId } = useParams({ from: "/table/$tableId" });
  const tableNumber = Number(tableId.match(/\d+/)?.[0] ?? 1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const points = useMemo(() => challenges.reduce((sum, item, index) => completed.includes(index) ? sum + item[2] : sum, 0), [completed]);
  const fakeUrl = `${window.location.origin}/table/table${tableNumber}-56748`;

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#292823]">
      <header className="border-b border-[#d9cfbd] bg-white/70 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-[0.25em]">R <span className="text-[#ad8a49]">&</span> C</Link>
          <span className="rounded-full bg-[#292823] px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white">Table {tableNumber}</span>
        </div>
      </header>

      <section className="mx-auto max-w-lg px-4 pb-16 pt-10">
        <div className="text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#9b865f]">Welcome to the wedding</p>
          <h1 className="mt-3 font-serif text-5xl italic">Table {tableNumber}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6e6a61]">Your table is your team tonight. Capture memories and earn points together.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link to="/photos" className="rounded-2xl border border-[#d9cfbd] bg-white p-5">
            <Camera className="h-5 w-5 text-[#ad8a49]" />
            <p className="mt-4 font-serif text-xl">Share photos</p>
            <p className="mt-1 text-xs text-[#777168]">Upload memories</p>
          </Link>
          <Link to="/game" className="rounded-2xl bg-[#292823] p-5 text-white">
            <Gamepad2 className="h-5 w-5 text-[#d4b56e]" />
            <p className="mt-4 font-serif text-xl">Play the game</p>
            <p className="mt-1 text-xs text-white/55">Earn points</p>
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9cfbd] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-[#777168]">Your score</span>
            <Trophy className="h-4 w-4 text-[#ad8a49]" />
          </div>
          <p className="mt-2 font-serif text-4xl">{points} <span className="text-base italic text-[#777168]">points</span></p>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9cfbd] bg-white p-5">
          <div className="flex items-center gap-3">
            <QrCode className="h-5 w-5 text-[#ad8a49]" />
            <div><p className="font-serif text-lg">Your table QR</p><p className="text-xs text-[#777168]">This is the link printed on your table.</p></div>
          </div>
          <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fakeUrl)}`} alt={`Table ${tableNumber} QR code`} className="h-48 w-48" />
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#292823] p-5 text-white">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[#d4b56e]">Preview</p>
          <p className="mt-2 text-sm leading-6 text-white/65">The live version will remember your table automatically after scanning and will save uploads and scores to the wedding database.</p>
        </div>

        <div className="mt-6">
          <button onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#bfa878] bg-white px-5 py-3 text-xs uppercase tracking-[0.2em]">
            <Upload className="h-4 w-4" /> Add proof photos / videos
          </button>
          <input ref={inputRef} hidden type="file" accept="image/*,video/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
          {files.length > 0 && <p className="mt-3 text-center text-xs text-[#777168]">{files.length} file(s) ready for upload in this preview.</p>}
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#9b865f]">Your table challenges</p>
          {challenges.map(([title, description, value], index) => {
            const done = completed.includes(index);
            return (
              <button key={title} onClick={() => setCompleted((current) => done ? current.filter((x) => x !== index) : [...current, index])} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${done ? "border-[#ad8a49] bg-[#fbf6e9]" : "border-[#d9cfbd] bg-white"}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${done ? "bg-[#ad8a49] text-white" : "bg-[#f1ece3] text-[#9b865f]"}`}>{done ? <Check className="h-4 w-4" /> : index + 1}</span>
                <span className="min-w-0 flex-1"><span className="block font-serif text-lg">{title}</span><span className="mt-1 block text-xs leading-5 text-[#777168]">{description}</span></span>
                <span className="font-serif text-lg text-[#ad8a49]">+{value}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
