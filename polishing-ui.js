// Interactive polishing section: filter tabs, cursor spotlight + 3D tilt, lightbox.
(function () {
  const root = document.getElementById("polishing");
  if (!root) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = [...root.querySelectorAll("[data-pcard]")];
  const tabs = [...root.querySelectorAll("[data-filter]")];
  const pill = document.getElementById("ptab-pill");

  // ---- Filter tabs with sliding pill ----
  function movePill(tab) {
    if (!pill || !tab) return;
    pill.style.width = tab.offsetWidth + "px";
    pill.style.transform = "translateX(" + tab.offsetLeft + "px)";
  }
  function applyFilter(key) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.filter === key)));
    movePill(tabs.find((t) => t.dataset.filter === key));
    let n = 0;
    cards.forEach((c) => {
      const show = key === "all" || c.dataset.cat === key;
      c.hidden = !show;
      if (show && !reduce) {
        c.animate(
          [{ opacity: 0, transform: "perspective(900px) rotateX(-35deg) translateY(24px)" }, { opacity: 1, transform: "none" }],
          { duration: 550, delay: n * 70, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }
        );
        n++;
      }
    });
    if (typeof layoutStack === "function") layoutStack();
  }
  tabs.forEach((t) => t.addEventListener("click", () => applyFilter(t.dataset.filter)));
  const first = tabs[0];
  requestAnimationFrame(() => movePill(first));
  addEventListener("resize", () => movePill(tabs.find((t) => t.getAttribute("aria-selected") === "true")));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => movePill(tabs.find((t) => t.getAttribute("aria-selected") === "true")));

  // ---- Mobile stacking cards: each card sticks, next one slides over it ----
  const mq = matchMedia("(max-width: 767px)");
  const HEADER = 84, STEP = 14;
  let ticking = false;
  function layoutStack() {
    const v = cards.filter((c) => !c.hidden);
    v.forEach((c, i) => {
      c.style.top = mq.matches ? HEADER + i * STEP + "px" : "";
      c.style.zIndex = mq.matches ? String(i + 1) : "";
      if (!mq.matches) { c.style.transform = ""; c.style.opacity = ""; }
    });
    updateScale();
  }
  function updateScale() {
    ticking = false;
    if (!mq.matches || reduce) return;
    const v = cards.filter((c) => !c.hidden);
    const vh = innerHeight;
    v.forEach((c, i) => {
      if (i === 0) { c.style.transform = ""; c.style.opacity = ""; return; }
      const top = c.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (vh - top - 60) / (vh * 0.5)));
      c.style.transform = t >= 1 ? "" : "perspective(900px) rotateX(" + (-(1 - t) * 60).toFixed(1) + "deg)";
      c.style.opacity = (0.35 + 0.65 * t).toFixed(2);
    });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScale); } }, { passive: true });
  addEventListener("resize", layoutStack);
  mq.addEventListener("change", layoutStack);
  layoutStack();

  // ---- Lightbox ----
  const dlg = document.getElementById("plightbox");
  const lbImg = dlg.querySelector(".lb-img");
  const lbTitle = dlg.querySelector(".lb-title");
  const lbSub = dlg.querySelector(".lb-sub");
  let cur = 0;
  const visible = () => cards.filter((c) => !c.hidden);
  function show(card) {
    const img = card.querySelector(".pimg");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = card.querySelector("h4").textContent;
    lbSub.textContent = "Starting from " + card.querySelector("p.text-2xl, p.sm\\:text-3xl").textContent.trim();
    lbImg.style.animation = "none"; lbImg.offsetWidth; lbImg.style.animation = "";
  }
  function open(card) {
    cur = visible().indexOf(card);
    show(card);
    if (!dlg.open) dlg.showModal();
  }
  function step(d) {
    const v = visible();
    if (!v.length) return;
    cur = (cur + d + v.length) % v.length;
    show(v[cur]);
  }
  root.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => open(b.closest("[data-pcard]"))));
  dlg.querySelector("[data-lb-close]").addEventListener("click", () => dlg.close());
  dlg.querySelector("[data-lb-prev]").addEventListener("click", () => step(-1));
  dlg.querySelector("[data-lb-next]").addEventListener("click", () => step(1));
  dlg.querySelector("[data-lb-bg]").addEventListener("click", (e) => { if (e.target === e.currentTarget) dlg.close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  let sx = null;
  dlg.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    sx = null;
  });
})();
