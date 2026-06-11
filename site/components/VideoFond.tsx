"use client";

import { useEffect, useRef } from "react";

/**
 * Vidéo d'ambiance sobre : muette, en boucle, chargée et jouée uniquement
 * quand elle est à l'écran ; à l'arrêt complet sous prefers-reduced-motion.
 */
export default function VideoFond({
  src,
  srcMobile,
  className,
}: {
  src: string;
  /** Variante légère servie sous 768 px (réseau mobile). */
  srcMobile?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const large = window.matchMedia("(min-width: 768px)").matches;
    const source = large ? src : (srcMobile ?? src);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = source;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, srcMobile]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
