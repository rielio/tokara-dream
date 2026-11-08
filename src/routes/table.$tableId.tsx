import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Camera, Gamepad2, QrCode, Trophy, Upload } from "lucide-react";
import { loadGame, saveWeddingMedia } from "@/lib/wedding-preview";

export const Route = createFileRoute("/table/$tableId")({ component: TablePortal });

function TablePortal() {
  const { tableId } = useParams({ from: "/table/$tableId" });
  const tableNumber = Math.min(8, Math.max(1, Number(tableId.match(/\d+/)?.[0] ?? 1)));
  const [files, setFiles] = useState<File[]>([]);
  const [score, setScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const completed = loadGame(tableNumber);
    return completed.reduce((sum, index) => sum + ([10,10,10,20,20,10,25,25][index] ?? 0), 0);
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const fakeUrl = `${window.location.origin}/table/table${tableNumber}-56748`;

  useEffect(() => {
    setScore(loadGame(tableNumber).reduce((sum, index) => sum + ([10,10,10,20,20,10,25,25][index] ?? 0), 0));
  }, [tableNumber]);

  async function uploadFiles(selectedFiles: FileList | null) {
    if (!selectedFiles?.length) return;
    try {
      const saved: File[] = [];
      for (const file of Array.from(selectedFiles)) {
        const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "photo" : null;
        if (!type) continue;
        await saveWeddingMedia({
          id: `table-${tableNumber}-${Date.now()}-${crypto.randomUUID()}`,
          blob: file,
          type,
          table: tableNumber,
          name: file.name,
          createdAt: Date.now(),
        });
        saved.push(file);
      }
      setFiles(saved);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

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
          <Link to="/photos" search={{ table: String(tableNumber) } as any} className="rounded-2xl border border-[#d9cfbd] bg-white p-5">
            <Camera className="h-5 w-5 text-[#ad8a49]" />
            <p className="mt-4 font-serif text-xl">Share photos</p>
            <p className="mt-1 text-xs text-[#777168]">Upload memories</p>
          </Link>
          <Link to="/game" search={{ table: String(tableNumber) } as any} className="rounded-2xl bg-[#292823] p-5 text-white">
            <Gamepad2 className="h-5 w-5 text-[#d4b56e]" />
            <p className="mt-4 font-serif text-xl">Play the game</p>
            <p className="mt-1 text-xs text-white/55">Earn points</p>
          </Link>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9cfbd] bg-white p-5">
          <div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.18em] text-[#777168]">Your score</span><Trophy className="h-4 w-4 text-[#ad8a49]" /></div>
          <p className="mt-2 font-serif text-4xl">{score} <span className="text-base italic text-[#777168]">points</span></p>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d9cfbd] bg-white p-5">
          <div className="flex items-center gap-3"><QrCode className="h-5 w-5 text-[#ad8a49]" /><div><p className="font-serif text-lg">Your table QR</p><p className="text-xs text-[#777168]">This is the link printed on your table.</p></div></div>
          <div className="mt-4 flex justify-center rounded-xl bg-white p-4"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fakeUrl)}`} alt={`Table ${tableNumber} QR code`} className="h-48 w-48" /></div>
        </div>

        <div className="mt-6">
          <button onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#bfa878] bg-white px-5 py-3 text-xs uppercase tracking-[0.2em]"><Upload className="h-4 w-4" /> Add photos / videos</button>
          <input ref={inputRef} hidden type="file" accept="image/*,video/*" multiple onChange={e => uploadFiles(e.target.files)} />
          {files.length > 0 && <p className="mt-3 text-center text-xs text-[#777168]">{files.length} file(s) saved for Table {tableNumber}.</p>}
        </div>
      </section>
    </main>
  );
}