import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  MapPin,
  Sun,
  ParkingCircle,
  Sparkles,
  Heart,
  Check,
  Plus,
  Minus,
} from "lucide-react";

import heroImg from "@/assets/hero.jpg";
import storyImg from "@/assets/story.JPG";
import venueImg from "@/assets/venue.jpg";
import quoteImg from "@/assets/quote.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import h1 from "@/assets/h1.jpg";
import h2 from "@/assets/h2.jpg";
import h3 from "@/assets/h3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Riel & Cara — 12 December 2026 · Tokara Wine Estate" },
       {
        name: "description",
        content:
          ", Riel & Cara Steenkamp joyfully invite you to celebrate their wedding on 12 December 2026 at Tokara Wine Estate, Stellenbosch.",
      },
      { property: "og:title", content: "Riel & Cara — 12 December 2026" },
      {
        property: "og:description",
        content: "A vineyard wedding at Tokara Wine Estate, Stellenbosch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingPage,
});

/* ------------------------------- Utilities ------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
};

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------- Floating vine leaves ------------------------ */

function FloatingLeaves() {
  const leaves = Array.from({ length: 12 });
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {leaves.map((_, i) => {
        const left = (i * 83) % 100;
        const dur = 22 + ((i * 7) % 18);
        const delay = (i * 2.3) % 20;
        const size = 14 + ((i * 5) % 22);
        const tx = ((i % 2 === 0 ? 1 : -1) * (20 + (i * 11) % 60)) + "px";
        return (
          <svg
            key={i}
            className="leaf"
            style={
              {
                left: `${left}%`,
                top: "-40px",
                width: size,
                height: size,
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
                "--tx": tx,
              } as React.CSSProperties
            }
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C7 6 4 10 4 15c0 4 3 7 8 7s8-3 8-7c0-5-3-9-8-13zm0 4c3 3 5 6 5 9s-2 5-5 5-5-2-5-5 2-6 5-9z" />
          </svg>
        );
      })}
    </div>
  );
}

/* ------------------------------- Navigation ------------------------------ */

const NAV = [
  { label: "Story", href: "#story" },
  { label: "The Day", href: "#day" },
  { label: "Venue", href: "#venue" },
  { label: "Accommodation", href: "#stay" },
  { label: "RSVP", href: "#rsvp" },
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.4, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "glass py-3" : "py-6"
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-12">
          <a
            href="#top"
            className={`font-serif text-lg tracking-[0.35em] transition-colors ${
              scrolled ? "text-charcoal" : "text-warm"
            }`}
          >
            R <span className="text-gold">&</span> C
          </a>
          <ul className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`group relative text-[0.7rem] font-light uppercase tracking-[0.28em] transition-colors ${
                    scrolled ? "text-charcoal/80 hover:text-gold" : "text-warm/85 hover:text-warm"
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#rsvp"
            className={`hidden rounded-full border px-6 py-2 text-[0.65rem] font-light uppercase tracking-[0.3em] transition-all duration-500 lg:inline-flex ${
              scrolled
                ? "border-gold text-charcoal hover:bg-gold hover:text-warm"
                : "border-warm/60 text-warm hover:bg-warm hover:text-charcoal"
            }`}
          >
            RSVP
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={`lg:hidden ${scrolled ? "text-charcoal" : "text-warm"}`}
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-px w-7 bg-current" />
              <span className="block h-px w-7 bg-current" />
            </div>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-serif text-lg tracking-[0.35em]">
                R <span className="text-gold">&</span> C
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-2xl font-light"
              >
                ×
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl tracking-wide text-charcoal"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky RSVP */}
      <a
        href="#rsvp"
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-charcoal/90 px-8 py-3 text-[0.65rem] font-light uppercase tracking-[0.35em] text-warm shadow-luxe backdrop-blur-lg lg:hidden"
      >
        RSVP
      </a>
    </>
  );
}

/* --------------------------------- Hero ---------------------------------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100dvh] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Riel and Cara in the vineyards of Stellenbosch"
          className="hero-zoom h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/30 to-charcoal/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center text-warm"
      >
        

        <div className="mt-8 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 1.5, ease }}
            className="font-script text-[clamp(4rem,12vw,10rem)] leading-[0.85] text-warm"
          >
            Riel
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 1.9, ease }}
            className="my-2 font-serif text-4xl italic text-gold md:text-5xl"
          >
            &
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 2.1, ease }}
            className="font-script text-[clamp(4rem,12vw,10rem)] leading-[0.85] text-warm"
          >
            Cara
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "6rem" }}
          transition={{ duration: 1.2, delay: 2.4, ease }}
          className="my-8 h-px bg-gold"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.6, ease }}
          className="max-w-md font-serif text-lg italic tracking-wide text-warm/90 md:text-xl"
        >
          joyfully invite you to celebrate their wedding
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.9, ease }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="font-serif text-2xl tracking-[0.25em] md:text-3xl">12 · 12 · 2026</p>
          <p className="text-[0.7rem] font-light uppercase tracking-[0.4em] text-warm/70">
            Tokara Wine Estate · Stellenbosch
          </p>
        </motion.div>

        <motion.a
          href="#rsvp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.2, ease }}
          className="btn-luxe-light mt-12"
        >
          Reply to Invitation
        </motion.a>
      </motion.div>

      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-warm/80"
      >
        <span className="text-[0.6rem] font-light uppercase tracking-[0.5em]"></span>
        <ArrowDown className="scroll-arrow h-4 w-4" strokeWidth={1} />
      </motion.a>
    </section>
  );
}

/* ------------------------------- Countdown ------------------------------- */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const target = new Date("2026-12-12T15:00:00+02:00");
  const t = useCountdown(target);
  const units: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow text-center">Counting the moments</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-center font-serif text-4xl italic md:text-5xl">
            Until we say <span className="text-gold">I do</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-y-12 md:grid-cols-4">
            {units.map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-serif text-6xl font-light tabular-nums md:text-8xl">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="mt-3 text-[0.65rem] font-light uppercase tracking-[0.4em] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- Story -------------------------------- */

function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-warm py-24 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 lg:grid-cols-12 lg:gap-24 lg:px-12">
        <Reveal className="lg:col-span-6" y={60}>
          <div className="relative overflow-hidden rounded-lg shadow-luxe">
            <motion.img
              src={storyImg}
              alt="Riel and Cara"
              loading="lazy"
              width={1200}
              height={1500}
              className="h-[70vh] w-full object-cover"
              whileInView={{ scale: [1.15, 1] }}
              transition={{ duration: 2, ease }}
              viewport={{ once: true }}
            />
          </div>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-6">
          <Reveal>
            <p className="eyebrow">Our Story</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] text-charcoal">
              Every love story is beautiful.
              <span className="mt-2 block italic text-olive">
                Ours is our favourite.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="divider-gold my-10 w-24" />
          </Reveal>
          <Reveal delay={0.3}>
            <div className="space-y-6 font-sans text-[15px] leading-[1.9] text-charcoal/80">
              <p>
                Two lives, quietly drawn together by God's grace — a meeting that
                felt less like coincidence and more like the gentle unfolding of
                something long promised.
              </p>
              <p>
                What began with a shared glance grew into a friendship built on
                faith, laughter and long walks that never quite ended on time.
                Through late nights and early mornings, through mountains climbed
                and cities discovered, our love has been shaped by adventure and
                anchored in commitment.
              </p>
              <p>
                Now, surrounded by the vineyards of Stellenbosch and by the family
                and friends who have loved us into who we are, we stand ready to
                begin forever — grateful, giddy, and completely certain of one
                another.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-10 font-script text-4xl text-gold">Riel & Cara</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Fullscreen Quote --------------------------- */

function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      <motion.img
        src={quoteImg}
        alt="A quiet moment in the vineyard"
        loading="lazy"
        width={1920}
        height={1280}
        style={{ y }}
        className="absolute inset-0 h-[120%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/55" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-warm">
        <Reveal>
          <Sparkles className="mx-auto h-5 w-5 text-gold" strokeWidth={1} />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-4xl font-serif text-[clamp(2rem,5vw,4.5rem)] italic leading-[1.1]">
            "I have found the one whom my soul loves."
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="divider-gold mx-auto my-10 w-24" />
        </Reveal>
        <Reveal delay={0.5}>
          <p className="text-[0.7rem] font-light uppercase tracking-[0.5em] text-warm/80">
            Song of Solomon 3:4
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- The Day -------------------------------- */

const SCHEDULE = [
  { time: "5:00 PM", title: "Guests Arrive", note: "Welcome drinks on the lawn" },
  { time: "5:30 PM", title: "Ceremony", note: "Vows on open lawn" },
  { time: "6:30 PM", title: "Canapés", note: "Vineyard bites" },
  { time: "7:15 PM", title: "Seated", note: "Guests moves to venue" },
  { time: "7:30 PM", title: "Bride & Groom Arrives", note: "" },
  { time: "8:00 PM", title: "Dinner", note: "Food will be served" },
  { time: "9:00 PM", title: "First Dance", note: "Until late…" },
];

function TheDay() {
  return (
    <section id="day" className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="eyebrow text-center">The Day</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-center font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-tight">
            An <span className="italic text-olive">unhurried</span> celebration
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-24 max-w-2xl">
          {/* Vertical gold line */}
          <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-transparent via-gold to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ul className="flex flex-col gap-14">
            {SCHEDULE.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={event.time} delay={i * 0.05}>
                  <li
                    className={`relative grid grid-cols-[2rem_1fr] items-center gap-6 md:grid-cols-2 ${
                      isLeft ? "" : "md:[direction:rtl]"
                    }`}
                  >
                    <span className="absolute left-4 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2">
                      <span className="block h-3 w-3 rounded-full bg-gold shadow-[0_0_0_6px_var(--color-background),0_0_0_7px_var(--color-gold)]" />
                    </span>
                    <div className={`${isLeft ? "md:pr-14 md:text-right" : "md:pl-14 md:text-left"} md:[direction:ltr]`}>
                      <p className="font-serif text-2xl tracking-wide text-gold md:text-3xl">
                        {event.time}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl text-charcoal md:text-3xl">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm font-light text-charcoal/60">{event.note}</p>
                    </div>
                    <div className="hidden md:block md:[direction:ltr]" />
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.2}>
            <p className="mt-20 text-center font-script text-4xl text-gold">
              Celebrate until late
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Venue --------------------------------- */

function Venue() {
  return (
    <section id="venue" className="relative overflow-hidden bg-warm">
      <div className="relative h-[80vh] w-full overflow-hidden">
        <motion.img
          src={venueImg}
          alt="Tokara Wine Estate vineyards"
          loading="lazy"
          width={1920}
          height={1200}
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
          viewport={{ once: true }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm" />
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow" style={{ color: "var(--color-gold)" }}>The Venue</p>
              <h2 className="mt-4 font-serif text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-wider text-warm">
                TOKARA
              </h2>
              <p className="mt-2 font-script text-3xl text-gold md:text-4xl">Wine Estate</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="mx-auto max-w-2xl text-center font-serif text-2xl italic leading-relaxed text-charcoal/80 md:text-3xl">
            Nestled amongst the vineyards of the Helshoogte Pass, Tokara is where
            our forever begins.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16 overflow-hidden rounded-2xl shadow-luxe">
            <iframe
              title="Tokara Wine Estate map"
              src="https://www.google.com/maps?q=Tokara+Wine+Estate+Helshoogte+Road+Stellenbosch&output=embed"
              className="h-[400px] w-full border-0 grayscale-[0.3]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              title: "Directions",
              body: "Helshoogte Road, R310\nStellenbosch, 7600",
              cta: {
                label: "Open in Maps",
                href: "https://maps.google.com/?q=Tokara+Wine+Estate",
              },
            },
            {
              icon: ParkingCircle,
              title: "Parking",
              body: "Complimentary secure parking\navailable on the estate.",
            },
            {
              icon: Sun,
              title: "Weather",
              body: "Warm summer evening\n24–28°C · gentle breeze",
            },
            {
              icon: Sparkles,
              title: "Dress Code",
              body: "Formal Garden Elegance\nBlack tie optional.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-champagne/60 bg-warm p-8 shadow-soft transition-all duration-700 hover:-translate-y-1 hover:border-gold hover:shadow-luxe">
                <card.icon className="h-6 w-6 text-gold" strokeWidth={1.25} />
                <h3 className="mt-6 font-serif text-2xl text-charcoal">{card.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm font-light leading-relaxed text-charcoal/70">
                  {card.body}
                </p>
                {card.cta && (
                  <a
                    href={card.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block text-[0.7rem] uppercase tracking-[0.3em] text-gold transition-opacity hover:opacity-70"
                  >
                    {card.cta.label} →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Accommodation ----------------------------- */

const HOTELS = [
  {
    name: "Delaire Graff Estate",
    image: h1,
    distance: "1.2 km from Tokara",
    href: "https://maps.google.com/?q=Delaire+Graff+Estate",
  },
  {
    name: "Lanzerac Wine Estate",
    image: h2,
    distance: "8 km · Stellenbosch",
    href: "https://maps.google.com/?q=Lanzerac+Wine+Estate",
  },
  {
    name: "Le Franschhoek Hotel",
    image: h3,
    distance: "18 km · Franschhoek",
    href: "https://maps.google.com/?q=Le+Franschhoek+Hotel",
  },
];

function Accommodation() {
  return (
    <section id="stay" className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow text-center">Where to Stay</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-center font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-tight">
            A weekend <span className="italic text-olive">in the winelands</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm font-light leading-relaxed text-charcoal/70">
            A curated selection of nearby estates and boutique retreats — each a
            gentle drive from Tokara.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
          {HOTELS.map((hotel, i) => (
            <Reveal key={hotel.name} delay={i * 0.1} y={60}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-warm shadow-soft transition-all duration-700 hover:-translate-y-2 hover:shadow-luxe">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="font-serif text-2xl text-charcoal">{hotel.name}</h3>
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.3em] text-gold">
                    {hotel.distance}
                  </p>
                  <div className="mt-8 flex items-center gap-4 pt-6 border-t border-champagne/60">
                    <a
                      href={hotel.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.7rem] uppercase tracking-[0.3em] text-charcoal/70 hover:text-gold"
                    >
                      Directions
                    </a>
                    <span className="text-champagne">·</span>
                    <a
                      href={hotel.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.7rem] uppercase tracking-[0.3em] text-gold hover:opacity-70"
                    >
                      Book Now →
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Gallery -------------------------------- */



/* ---------------------------------- RSVP ---------------------------------- */

function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState<"yes" | "no" | "">("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="eyebrow text-center">Kindly Reply</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-center font-serif text-[clamp(2.5rem,5vw,4.5rem)]">
            You are <span className="italic text-olive">warmly invited</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-lg text-center text-sm font-light leading-relaxed text-charcoal/70">
            Please respond by 1 November 2026 so we may prepare a seat at the
            table for you.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-14 rounded-3xl glass-card p-8 shadow-luxe md:p-14">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={onSubmit}
                  className="space-y-8"
                >
                  <Field label="Full Name" name="name" required />
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Field label="Email" name="email" type="email" required />
                    <Field label="Phone" name="phone" type="tel" />
                  </div>

                  <div>
                    <LabelText>Attendance</LabelText>
                    <div className="mt-3 flex gap-3">
                      {(["yes", "no"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAttending(v)}
                          className={`flex-1 rounded-full border px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] transition-all duration-500 ${
                            attending === v
                              ? "border-gold bg-gold text-warm"
                              : "border-champagne text-charcoal/70 hover:border-gold"
                          }`}
                        >
                          {v === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <LabelText>Number of Guests</LabelText>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="grid h-11 w-11 place-items-center rounded-full border border-champagne text-charcoal transition-colors hover:border-gold hover:text-gold"
                      >
                        <Minus className="h-4 w-4" strokeWidth={1.25} />
                      </button>
                      <span className="w-10 text-center font-serif text-3xl tabular-nums">
                        {guests}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setGuests((g) => Math.min(6, g + 1))}
                        className="grid h-11 w-11 place-items-center rounded-full border border-champagne text-charcoal transition-colors hover:border-gold hover:text-gold"
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.25} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <LabelText>Meal Preference</LabelText>
                    <select
                      name="meal"
                      className="mt-3 w-full appearance-none border-0 border-b border-champagne bg-transparent py-3 font-serif text-lg text-charcoal outline-none transition-colors focus:border-gold"
                      defaultValue=""
                    >
                      <option value="" disabled>Select…</option>
                      <option>Beef</option>
                      <option>Lamb</option>
                      <option>Fish</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                    </select>
                  </div>

                  <Field label="Dietary Requirements" name="diet" />

                  <div>
                    <LabelText>A Message for the Couple</LabelText>
                    <textarea
                      name="message"
                      rows={3}
                      className="mt-3 w-full resize-none border-0 border-b border-champagne bg-transparent py-3 font-serif text-lg italic text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-gold"
                      placeholder="Write a note…"
                    />
                  </div>

                  <div className="pt-6 text-center">
                    <button type="submit" className="btn-luxe">
                      Send with Love
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7, ease }}
                    className="grid h-20 w-20 place-items-center rounded-full border border-gold text-gold"
                  >
                    <Check className="h-8 w-8" strokeWidth={1} />
                  </motion.div>
                  <h3 className="mt-8 font-serif text-4xl italic md:text-5xl">
                    Thank you
                  </h3>
                  <p className="mt-4 max-w-md font-light text-charcoal/70">
                    Your reply has been received. We cannot wait to celebrate
                    with you on 12 December 2026.
                  </p>
                  <p className="mt-6 font-script text-3xl text-gold">Riel & Cara</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LabelText({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[0.65rem] font-light uppercase tracking-[0.4em] text-charcoal/60">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <LabelText>{label}</LabelText>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-3 w-full border-0 border-b border-champagne bg-transparent py-3 font-serif text-lg text-charcoal outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}

/* ---------------------------------- Gifts --------------------------------- */

function Gifts() {
  return (
    <section className="relative overflow-hidden bg-warm py-24 md:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="eyebrow">A Note on Gifts</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-10 font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] italic leading-[1.35] text-charcoal">
            "Our greatest gift is celebrating this day with you. Should you wish
            to bless us further, a contribution towards our future together
            would be sincerely appreciated."
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <Heart
            className="mx-auto mt-12 h-6 w-6 fill-gold text-gold"
            strokeWidth={1}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ ----------------------------------- */

const FAQS = [
  {
    q: "Can children attend?",
    a: "We adore your little ones, but our celebration will be an adults-only affair to allow every guest a relaxed evening.",
  },
  {
    q: "May I bring a plus one?",
    a: "Plus ones are extended by name on your invitation. Kindly indicate them in your RSVP.",
  },
  {
    q: "Is there parking at Tokara?",
    a: "Yes — complimentary, secure parking is available on the estate.",
  },
  {
    q: "Where should we stay?",
    a: "We've selected a few nearby estates in the accommodation section — book early as December is the height of Stellenbosch's season.",
  },
  {
    q: "What is the dress code?",
    a: "Formal Garden Elegance. Long dresses for her, dark suits or black tie for him. Comfortable heels for the grass.",
  },
  {
    q: "Do you have a gift registry?",
    a: "No traditional registry — please see our note on gifts above.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="eyebrow text-center">Details</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 text-center font-serif text-[clamp(2.5rem,5vw,4.5rem)]">
            Everything <span className="italic text-olive">to know</span>
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-champagne/70 border-y border-champagne/70">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-gold"
                >
                  <span className="font-serif text-xl md:text-2xl">{item.q}</span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold text-gold transition-transform duration-500 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.25} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-14 font-light leading-relaxed text-charcoal/75">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal py-24 text-warm md:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-40 shimmer" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <div className="divider-gold mx-auto w-24" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-10 font-script text-[clamp(4rem,10vw,8rem)] leading-none">
            Riel <span className="text-gold">&</span> Cara
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 font-serif text-xl tracking-[0.3em] md:text-2xl">
            12 · 12 · 2026
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-3 text-[0.7rem] uppercase tracking-[0.4em] text-warm/70">
            Tokara Wine Estate · Stellenbosch
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="divider-gold mx-auto mt-16 w-16" />
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-warm/60">
            Made with <Heart className="h-3 w-3 fill-gold text-gold" strokeWidth={1} /> for our family & friends
          </p>
        </Reveal>
      </div>
    </footer>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function WeddingPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease }}
      className="relative overflow-x-hidden bg-background text-foreground"
    >
      <FloatingLeaves />
      <Navigation />
      <Hero />
      <Countdown />
      <Story />
      <QuoteSection />
      <TheDay />
      <Venue />
      <Accommodation />
      <Gallery />
      <RSVP />
      <Gifts />
      <FAQ />
      <Footer />
    </motion.main>
  );
}
