// Modern landing animations (GSAP). Transform/opacity only; respects reduced motion; plays once.
(function () {
  if (!window.gsap) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // final state is the default markup

  gsap.registerPlugin(ScrollTrigger);

  // 01 Hero reveal (< 2.5s)
  gsap.from("[data-hero]", { y: 36, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 });
  gsap.from(".hero-img", { scale: 1.3, duration: 1.8, ease: "power2.out" });

  // 02 Word rotator
  const track = document.querySelector(".rotator-track");
  if (track) {
    const n = track.children.length - 1;
    const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
    for (let i = 1; i <= n; i++) {
      tl.to(track, { yPercent: -(100 / (n + 1)) * i, duration: 0.6, ease: "power3.inOut" }, "+=1.6");
    }
    tl.set(track, { yPercent: 0 });
  }

  // 05 Count-up (once)
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 95%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 2, delay: 0.6, ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US")) }),
    });
  });

  // Floating cards + parallax
  gsap.to(".float-a", { y: -12, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".float-b", { y: 12, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".hero-img", { yPercent: 8, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-glow", { y: 120, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });

  // Marquee
  const m = document.querySelector(".marquee");
  if (m) gsap.to(m, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });

  // Scroll reveal for the rest of the page (once)
  document.querySelectorAll("section:not(#hero):not(#bento):not(#process) > div").forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });

  // 06 Bento build (once)
  gsap.from("[data-tile]", { y: 60, opacity: 0, scale: 0.96, duration: 0.8, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: "#bento", start: "top 80%", once: true } });
  gsap.from("#bento .max-w-2xl", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: "#bento", start: "top 85%", once: true } });

  // Scroll progress bar
  gsap.to("#progress", { scaleX: 1, ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

  // Section headings: word-by-word reveal (once)
  document.querySelectorAll("section:not(#hero) h2").forEach((h) => {
    if (h.children.length) return; // keep headings that contain markup untouched
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w) => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="w" style="display:inline-block">${w}&nbsp;</span></span>`).join("");
    gsap.from(h.querySelectorAll(".w"), { yPercent: 110, duration: 0.8, ease: "power3.out", stagger: 0.05,
      scrollTrigger: { trigger: h, start: "top 90%", once: true } });
  });

  // Image curtain reveal + gentle parallax (transform/opacity/clip only)
  document.querySelectorAll("section:not(#hero):not(#bento) img.object-cover").forEach((img) => {
    const box = img.parentElement;
    if (!box || box.dataset.rev) return;
    box.dataset.rev = 1;
    gsap.from(img, { scale: 1.2, duration: 1.4, ease: "power2.out",
      scrollTrigger: { trigger: box, start: "top 90%", once: true } });
  });
  document.querySelectorAll("#bento [data-tile] img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Mobile: keep it light
  ScrollTrigger.matchMedia && ScrollTrigger.matchMedia({
    "(max-width: 767px)": () => { gsap.set(".float-a,.float-b", { clearProps: "transform" }); },
  });

  // Headings that contain markup: soft wipe-up reveal (once)
  document.querySelectorAll("section:not(#hero) h2").forEach((h) => {
    if (h.querySelector(".w")) return;
    gsap.from(h, { y: 36, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 90%", once: true } });
  });

  // 08 Process: line draws along the steps, steps rise in turn
  const steps = document.querySelector("#process .grid.border-t");
  if (steps) {
    steps.classList.add("relative");
    const line = document.createElement("span");
    line.className = "absolute -top-px left-0 h-[2px] w-full origin-left bg-[#76543B]";
    line.style.transform = "scaleX(0)";
    steps.prepend(line);
    gsap.to(line, { scaleX: 1, ease: "none",
      scrollTrigger: { trigger: steps, start: "top 80%", end: "bottom 60%", scrub: 0.6 } });
    gsap.from(steps.querySelectorAll(":scope > .group"), { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15,
      scrollTrigger: { trigger: steps, start: "top 82%", once: true } });
  }

  // Service + product cards rise in staggered rows (once)
  [["#services .grid > .group", "#services .grid"], ["#testimonials article", "#testimonials .grid"]].forEach(([items, wrap]) => {
    const w = document.querySelector(wrap);
    if (!w) return;
    gsap.from(document.querySelectorAll(items), { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: w, start: "top 85%", once: true } });
  });
})();
