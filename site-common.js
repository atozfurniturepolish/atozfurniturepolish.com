// Shared behaviour for every page: progress bar, spotlight, reveals. Transform/opacity only; honours reduced motion.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // scroll progress bar (CSS-only fallback friendly)
  if (!document.getElementById("progress")) {
    var bar = document.createElement("div");
    bar.id = "progress";
    bar.className = "fixed top-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[#D9A66F] z-[60]";
    document.body.prepend(bar);
  }
  var bar = document.getElementById("progress");
  var raf = false;
  function prog() {
    raf = false;
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
  }
  addEventListener("scroll", function () { if (!raf) { raf = true; requestAnimationFrame(prog); } }, { passive: true });
  prog();

  // cursor spotlight on cards (mouse only; delegated so JS-rendered cards work too)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var sel = ".product-card .product-slider,#services .group,#testimonials article,#process .group,#projects .project-slider,.spot-card";
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(sel);
      if (!el) return;
      if (!el.classList.contains("spot")) el.classList.add("spot");
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  // generic reveal for pages that don't load anim.js (index has its own)
  if (!reduce && window.gsap && window.ScrollTrigger && !document.getElementById("hero")) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll("main > section, body > section, section > div:first-child").forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
  }

  // smooth anchors (JS, so it never interferes with ScrollTrigger measuring)
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return; }
    var t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    var hdr = document.querySelector("header");
    var off = (hdr ? hdr.getBoundingClientRect().height : 0) + 8;
    var y = t.getBoundingClientRect().top + scrollY - off;
    scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + id);
  });
})();
