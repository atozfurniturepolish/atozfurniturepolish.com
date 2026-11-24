// Process section: scroll-driven. Desktop pins and swaps steps one by one; mobile stacks cards.
(function () {
  var root = document.getElementById("proc");
  if (!root || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var steps = [].slice.call(root.querySelectorAll("[data-proc-step]"));
  var items = [].slice.call(root.querySelectorAll("[data-proc-go]"));
  var line = document.getElementById("proc-line");
  var n = steps.length;
  var mm = gsap.matchMedia();

  // ---- Desktop: pinned, one step at a time ----
  mm.add("(min-width:1024px) and (prefers-reduced-motion:no-preference)", function () {
    var current = -1;
    function setActive(i) {
      if (i === current) return;
      current = i;
      items.forEach(function (it, k) { it.setAttribute("aria-current", k === i ? "step" : "false"); });
      steps.forEach(function (s, k) { s.dataset.state = k === i ? "active" : k < i ? "before" : "after"; });
    }
    setActive(0);

    var st = ScrollTrigger.create({
      trigger: root,
      start: "top 96px",
      end: "+=" + n * 70 + "%",
      pin: true,
      anticipatePin: 1,
      onUpdate: function (self) {
        var i = Math.min(n - 1, Math.floor(self.progress * n));
        setActive(i);
        if (line) line.style.transform = "scaleY(" + (0.12 + self.progress * 0.88).toFixed(3) + ")";
      },
    });

    var handlers = items.map(function (it, k) {
      var h = function () {
        var y = st.start + ((k + 0.5) / n) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: "smooth" });
      };
      it.addEventListener("click", h);
      return [it, h];
    });

    return function () {
      handlers.forEach(function (p) { p[0].removeEventListener("click", p[1]); });
      steps.forEach(function (s) { delete s.dataset.state; });
      if (line) line.style.transform = "scaleY(.12)";
    };
  });

  // ---- Mobile / reduced motion: sticky stacking cards ----
  mm.add("(max-width:1023px), (prefers-reduced-motion:reduce)", function () {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;
    function update() {
      ticking = false;
      if (reduce) return;
      var vh = innerHeight;
      steps.forEach(function (c, i) {
        if (i === 0) return;
        var top = c.getBoundingClientRect().top;
        // flips up from -60deg to flat as it travels from the bottom of the screen to its stick point
        var p = Math.min(1, Math.max(0, (vh - top - 60) / (vh * 0.5)));
        c.style.transform = p >= 1 ? "" : "perspective(900px) rotateX(" + (-(1 - p) * 60).toFixed(1) + "deg)";
        c.style.opacity = (0.35 + 0.65 * p).toFixed(2);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return function () {
      removeEventListener("scroll", onScroll);
      steps.forEach(function (c) { c.style.transform = ""; c.style.opacity = ""; });
    };
  });
})();
