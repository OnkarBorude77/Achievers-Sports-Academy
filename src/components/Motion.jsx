import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Things that fade and slide in as you scroll to them. They are found automatically,
// so pages don't need any extra markup.
const AUTO = [
  ".section-head", ".split > *", ".class-card", ".ach-row", ".mosaic-item", ".year-block", ".result",
  ".masonry-tile", ".branch", ".contact-info", ".contact-form-wrap", ".kun-list li", ".band-item",
  ".closing-inner > *", ".empty-state", ".footer-grid > *",
];

export default function Motion() {
  const { pathname } = useLocation();

  // Reveal on scroll. Runs before the first paint so nothing flashes.
  useLayoutEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);
          el.classList.add("is-in");
          const delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
          // once it has appeared, drop the animation hooks so hover effects work normally
          window.setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-in");
            el.classList.add("revealed");
            el.style.removeProperty("--d");
          }, 1000 + delay);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const scan = () => {
      AUTO.forEach((selector) =>
        document.querySelectorAll(selector).forEach((el) => {
          if (el.hasAttribute("data-reveal") || el.classList.contains("revealed")) return;
          el.setAttribute("data-reveal", "");
          const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
          const index = Math.min(Math.max(siblings.indexOf(el), 0), 5);
          el.style.setProperty("--d", `${index * 90}ms`);
        })
      );
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    };

    scan();
    // pick up content that arrives later (photos and results loaded from the database)
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById("root"), { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  // Reading-progress bar and the header's "scrolled" look.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      root.style.setProperty("--progress", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
      root.classList.toggle("scrolled", window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}
