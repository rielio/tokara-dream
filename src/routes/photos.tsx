import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ImagePlus, Play, Trophy, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import { getWeddingMedia, mediaUrl, saveWeddingMedia, type WeddingMedia } from "@/lib/wedding-preview";

export const Route = createFileRoute("/photos")({ component: GuestPhotos });

type MediaView = { id: string; src: string; type: "photo" | "video"; table: number; name: string };

const demoMedia: MediaView[] = [
  { id: "1", src: g1, type: "photo", table: 1, name: "Golden hour" },
  { id: "2", src: g2, type: "photo", table: 2, name: "Cheers" },
  { id: "3", src: g3, type: "photo", table: 3, name: "The table" },
  { id: "4", src: g4, type: "photo", table: 1, name: "Dance floor" },
  { id: "5", src: g5, type: "photo", table: 4, name: "Vineyard" },
  { id: "6", src: g6, type: "photo", table: 5, name: "Best friends" },
];

function GuestPhotos() {
  const queryTable = new URLSearchParams(window.location.search).get("table");
  const initialTable = queryTable && /^[1-8]$/.test(queryTable) ? queryTable : "all";
  const [table, setTable] = useState(initialTable);
  const [media, setMedia] = useState<MediaView[]>(demoMedia);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let urls: string[] = [];
    getWeddingMedia()
      .then(items => {
        urls = items.map(item => mediaUrl(item.blob));
        setMedia(current => [
          ...items.map((item, i) => ({ id: item.id, src: urls[i], type: item.type, table: item.table, name: item.name })),
          ...current,
        ]);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Could not load saved photos."));
    return () => urls.forEach(URL.revokeObjectURL);
  }, []);

  const filtered = useMemo(() => table === "all" ? media : media.filter(item => item.table === Number(table)), [media, table]);

  useEffect(() => {
    if (viewerIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowRight") setViewerIndex(i => i === null ? null : (i + 1) % filtered.length);
      if (event.key === "ArrowLeft") setViewerIndex(i => i === null ? null : (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, filtered.length]);

  function toggleSelected(id: string) {
    setSelected(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const rawTable = Number(new URLSearchParams(window.location.search).get("table") || (table === "all" ? 1 : table));
      const safeTable = Number.isInteger(rawTable) && rawTable >= 1 && rawTable <= 8 ? rawTable : 1;
      const additions: MediaView[] = [];

      for (const file of Array.from(files)) {
        const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "photo" : null;
        if (!type) continue;
        const item: WeddingMedia = {
          id: `upload-${Date.now()}-${crypto.randomUUID()}`,
          blob: file,
          type,
          table: safeTable,
          name: file.name,
          createdAt: Date.now(),
        };
        await saveWeddingMedia(item);
        additions.push({ id: item.id, src: mediaUrl(file), type, table: safeTable, name: file.name });
      }

      setMedia(current => [...additions, ...current]);
      setSelected(current => [...additions.map(x => x.id), ...current]);
      setTable(String(safeTable));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function download(items: MediaView[]) {
    for (const [index, item] of items.entries()) {
      const a = document.createElement("a");
      a.href = item.src;
      a.download = `riel-cara-table-${item.table}-${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || index + 1}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      await new Promise(r => setTimeout(r, 250));
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#292823]">
      <header className="sticky top-0 z-20 border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-[0.25em]">R <span className="text-[#ad8a49]">&</span> C</Link>
          <Link to="/game" className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]"><Trophy className="h-4 w-4 text-[#ad8a49]" /> Game</Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 md:px-8 md:pt-16">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#9b865f]">Wedding memories</p>
        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-5xl italic md:text-6xl">Photos & videos</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#6e6a61]">A phone-first place for every table to share the moments they capture.</p>
          </div>
          <button disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#292823] px-6 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-50">
            <Upload className="h-4 w-4" /> {busy ? "Saving..." : "Add photos / videos"}
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={e => addFiles(e.target.files)} />
        </div>

        {error && <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {["all","1","2","3","4","5","6","7","8"].map(value => (
            <button key={value} onClick={() => setTable(value)} className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${table === value ? "border-[#292823] bg-[#292823] text-white" : "border-[#d9cfbd] bg-white/50"}`}>
              {value === "all" ? "All tables" : `Table ${value}`}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#ded5c6] bg-white/60 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="px-1 text-xs text-[#6e6a61]">{filtered.length} memories · {selected.length} selected</span>
            <div className="flex gap-2">
              {selected.length > 0 && <button onClick={() => download(filtered.filter(x => selected.includes(x.id)))} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#bfa878] px-4 text-[0.65rem] uppercase tracking-[0.15em] sm:flex-none"><Download className="h-4 w-4" /> Download selected</button>}
              <button onClick={() => download(filtered)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#bfa878] px-4 text-[0.65rem] uppercase tracking-[0.15em] sm:flex-none"><Download className="h-4 w-4" /> Download all</button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">
          {filtered.map((item, index) => (
            <div key={item.id} className={`group relative overflow-hidden rounded-2xl bg-white text-left shadow-sm ${selected.includes(item.id) ? "ring-2 ring-[#ad8a49]" : ""}`}>
              <button onClick={() => setViewerIndex(index)} className="block w-full text-left">
              {item.type === "photo" ? <img src={item.src} alt={item.name} className="aspect-[4/5] w-full object-cover" /> : <video src={item.src} className="aspect-[4/5] w-full object-cover" muted playsInline controls />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 text-white"><p className="text-[0.65rem] uppercase tracking-[0.16em]">Table {item.table}</p><p className="mt-1 truncate text-xs">{item.name}</p></div>
              {item.type === "video" && <span className="absolute left-3 top-3 rounded-full bg-black/50 p-2 text-white"><Play className="h-3 w-3 fill-current" /></span>}
              </button>
              <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-white backdrop-blur">
                <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} className="h-4 w-4 accent-[#ad8a49]" />
                <span className="text-[0.6rem] uppercase tracking-[0.12em]">Download</span>
              </label>
            </div>
          ))}
        </div>
        </div>

        {viewerIndex !== null && filtered[viewerIndex] && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={() => setViewerIndex(null)}>
            <button aria-label="Close" onClick={() => setViewerIndex(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white"><X className="h-5 w-5" /></button>
            <button aria-label="Previous photo" onClick={e => { e.stopPropagation(); setViewerIndex(i => i === null ? null : (i - 1 + filtered.length) % filtered.length); }} className="absolute left-2 top-1/2 z-10 rounded-full bg-white/10 p-3 text-white"><ChevronLeft className="h-6 w-6" /></button>
            <div className="flex max-h-[90vh] max-w-[95vw] flex-col items-center" onClick={e => e.stopPropagation()}>
              {filtered[viewerIndex].type === "photo" ? <img src={filtered[viewerIndex].src} alt={filtered[viewerIndex].name} className="max-h-[78vh] max-w-full object-contain" /> : <video src={filtered[viewerIndex].src} controls autoPlay playsInline className="max-h-[78vh] max-w-full" />}
              <div className="mt-4 flex w-full max-w-xl items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur">
                <div className="min-w-0"><p className="text-xs uppercase tracking-[0.15em] text-white/50">Table {filtered[viewerIndex].table}</p><p className="truncate text-sm">{filtered[viewerIndex].name}</p></div>
                <label className="flex shrink-0 items-center gap-2 text-xs"><input type="checkbox" checked={selected.includes(filtered[viewerIndex].id)} onChange={() => toggleSelected(filtered[viewerIndex].id)} className="h-5 w-5 accent-[#ad8a49]" /> Select</label>
              </div>
            </div>
            <button aria-label="Next photo" onClick={e => { e.stopPropagation(); setViewerIndex(i => i === null ? null : (i + 1) % filtered.length); }} className="absolute right-2 top-1/2 z-10 rounded-full bg-white/10 p-3 text-white"><ChevronRight className="h-6 w-6" /></button>
          </div>
        )}

        <section className="mt-12 rounded-3xl bg-[#292823] p-6 text-white md:p-8">
          <div className="flex items-start gap-4"><ImagePlus className="mt-1 h-5 w-5 text-[#d4b56e]" /><div><h2 className="font-serif text-2xl italic">Preview mode</h2><p className="mt-2 text-sm leading-6 text-white/65">Uploads are stored in this browser during preview. They will be shared across all phones once the final wedding storage is connected.</p></div></div>
        </section>
      </section>
    </main>
  );
}