// Mobile menu for pages that have no menu of their own (products page).
// Plain JS (dialog.showModal) so it works in every browser, not only the newest ones.
(function () {
  var nav = document.querySelector("header nav");
  if (!nav || document.getElementById("mobile-menu")) return;

  var style = document.createElement("style");
  style.textContent =
    "#mobile-menu{max-width:none;max-height:none;width:100%;height:100%;margin:0;padding:0;border:0;background:transparent;overflow:hidden}" +
    "#mobile-menu::backdrop{background:rgba(10,8,6,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}" +
    "#mobile-menu[open] .mm-panel{animation:mmDrop .55s cubic-bezier(.22,1,.36,1) both}" +
    "#mobile-menu[open] .mm-link{animation:mmItem .6s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(.12s + var(--i)*.07s)}" +
    "#mobile-menu.closing .mm-panel{animation:mmUp .35s cubic-bezier(.64,0,.78,0) both}" +
    "@keyframes mmDrop{from{transform:translateY(-105%)}to{transform:translateY(0)}}" +
    "@keyframes mmUp{from{transform:translateY(0)}to{transform:translateY(-105%)}}" +
    "@keyframes mmItem{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}" +
    "@media (prefers-reduced-motion:reduce){#mobile-menu .mm-panel,#mobile-menu .mm-link{animation:none!important}}";
  document.head.appendChild(style);

  var links = [
    ["Home", "./index.html"],
    ["Products", "./products.html"],
    ["Services", "./index.html#services"],
    ["Projects", "./index.html#projects"],
    ["About Us", "./about.html"],
    ["Contact", "./index.html#contact"],
  ];
  var linkHtml = links
    .map(function (l, i) {
      return (
        '<a href="' + l[1] + '" style="--i:' + i + '" class="mm-link flex items-center justify-between py-4 text-2xl font-semibold tracking-tight text-white"><span>' +
        l[0] + '</span><span class="text-[#D9A66F]">→</span></a>'
      );
    })
    .join("");

  var dlg = document.createElement("dialog");
  dlg.id = "mobile-menu";
  dlg.className = "md:hidden";
  dlg.setAttribute("aria-label", "Menu");
  dlg.innerHTML =
    '<div class="mm-panel fixed inset-x-0 top-0 max-h-[100dvh] overflow-y-auto rounded-b-[2rem] border-b border-white/10 bg-[#14110F] px-6 pb-8 pt-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">' +
    '<div class="flex items-center justify-between">' +
    '<a href="./index.html" class="flex items-center gap-3" aria-label="A to Z Furniture Polish – home">' +
    '<img src="./images/logo-mark.webp" alt="" class="h-12 w-auto [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_78%)]" />' +
    '<span class="leading-none"><span class="block text-xl font-semibold tracking-[-0.03em] text-[#E8C08F]">atoz</span><span class="block mt-1 text-[10px] uppercase tracking-[0.28em] text-white/70">furniture polish</span></span></a>' +
    '<button type="button" data-mm-close aria-label="Close menu" class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 active:scale-95">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>' +
    '<nav class="mt-6 divide-y divide-white/10" aria-label="Mobile">' + linkHtml + "</nav>" +
    '<div class="mm-link mt-6 grid grid-cols-2 gap-3" style="--i:6">' +
    '<a href="tel:+918108582270" class="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#D9A66F] to-[#B88454] py-3.5 font-semibold text-[#1d1a17]">Call Us</a>' +
    '<a href="https://wa.me/918108582270?text=Hi%2C%20I%20am%20interested%20in%20your%20furniture%20services." target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#2EE07A] to-[#12A150] py-3.5 font-semibold text-white">WhatsApp</a>' +
    "</div></div>";
  document.body.appendChild(dlg);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open menu");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-controls", "mobile-menu");
  btn.className = "md:hidden -mr-2 grid h-11 w-11 place-items-center rounded-full text-white/80 hover:bg-white/10";
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-6 w-6" aria-hidden="true"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  nav.appendChild(btn);

  function close() {
    if (!dlg.open) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return dlg.close();
    dlg.classList.add("closing");
    setTimeout(function () { dlg.classList.remove("closing"); dlg.close(); }, 330);
  }
  btn.addEventListener("click", function () { if (!dlg.open) dlg.showModal(); });
  dlg.querySelector("[data-mm-close]").addEventListener("click", close);
  dlg.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { if (a.getAttribute("href").charAt(0) === "#") close(); }); });
  dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  matchMedia("(min-width:768px)").addEventListener("change", function (m) { if (m.matches && dlg.open) dlg.close(); });
})();
