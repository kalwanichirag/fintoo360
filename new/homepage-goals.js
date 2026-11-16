/* Imported hero and goal mapping; the existing page owns its header and other sections. */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  const hero = $('#hero'), vis = $('#vis'), arc = $('#garc-p'), pct = $('#g-pct'), gtxt = $('#g-txt');
  const caps = $$('#hero .cap');
  const setCap = k => caps.forEach((c, i) => c.classList.toggle('hidden', i !== k));
  const setGoal = p => { arc.setAttribute('stroke-dashoffset', (1 - p).toFixed(3)); const v = Math.round(p * 100); pct.textContent = v >= 100 ? '' : v; gtxt.textContent = v >= 100 ? 'On track' : '% of the way'; };
  const finalState = () => { setGoal(1); setCap(2); ['#g-main'].forEach(q => $(q).classList.add('opacity-0')); ['#g-done', '#g-fill'].forEach(q => $(q).classList.remove('opacity-0')); $('#g-fill').classList.remove('scale-50'); $$('#hero .tw').forEach(t => t.classList.add('opacity-0')); };

  /* pause control for looping motion */
  const btn = $('#motion');
  btn.addEventListener('click', () => {
    const p = hero.dataset.paused !== 'true'; hero.dataset.paused = p;
    btn.setAttribute('aria-label', p ? 'Play background animation' : 'Pause background animation');
    btn.querySelector('.ic-pause').classList.toggle('hidden', p); btn.querySelector('.ic-play').classList.toggle('hidden', !p);
    if (G) p ? floats.forEach(t => t.pause()) : floats.forEach(t => t.resume());
  });
  const floats = [];

  /* chapter 2: lines between what you own and what it is for */
  const LINKS = [["mf", "edu"], ["mf", "ret"], ["st", "ret"], ["gs", "edu"], ["gs", "safe"], ["us", "edu"], ["ipo", "ret"], ["fd", "home"], ["fd", "safe"], ["mf", "home"]], COLORS = {"edu": "#86ADE8", "home": "#EFA97A", "ret": "#7CC7A2", "safe": "#E59AB0"}, NS2 = 'http://www.w3.org/2000/svg';
  const map = $('#map'), svg = $('#map-svg'); let paths = [];
  let focusKey = null;
  const applyFocus = () => paths.forEach(p => { const on = !focusKey || p.dataset.a === focusKey || p.dataset.g === focusKey; p.setAttribute('stroke-opacity', on ? '1' : '0.12'); p.setAttribute('stroke-width', on && focusKey ? '3.25' : '2.5'); });
  const drawMap = () => {
    svg.replaceChildren(); paths = [];
    const m = map.getBoundingClientRect();
    LINKS.forEach(([a, g]) => {
      const A = map.querySelector(`[data-node=${a}]`).getBoundingClientRect(), B = map.querySelector(`[data-node=${g}]`).getBoundingClientRect();
      const p = document.createElementNS(NS2, 'path');
      const x1 = A.right - m.left, y1 = A.top + A.height / 2 - m.top, x2 = B.left - m.left, y2 = B.top + B.height / 2 - m.top, cx = (x2 - x1) * 0.5;
      p.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + cx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - cx).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
      p.setAttribute('fill', 'none'); p.setAttribute('stroke', COLORS[g]); p.setAttribute('stroke-width', '2.5'); p.setAttribute('stroke-linecap', 'round');
      p.dataset.a = a; p.dataset.g = g; p.style.transition = 'stroke-opacity .3s, stroke-width .3s';
      p.setAttribute('pathLength', '1'); p.setAttribute('stroke-dasharray', '1'); p.setAttribute('stroke-dashoffset', reduce || !G ? '0' : '1');
      svg.appendChild(p); paths.push(p);
    });
    applyFocus();
  };
  let rz; new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { drawMap(); paintJobs(jobsProg == null ? (reduce || !G ? 1 : 0) : jobsProg); }); }).observe(map);
  let jobsProg = null;
  const steps = $$('#jobs .step');
  const paintJobs = p => {
    jobsProg = p;
    const lp = Math.min(1, Math.max(0, (p - 0.3) / 0.38));
    paths.forEach((el, i) => { const s = i / paths.length * 0.6, v = Math.min(1, Math.max(0, (lp - s) / 0.4)); el.setAttribute('stroke-dashoffset', (1 - v).toFixed(3)); });
    const k = p < 0.3 ? 0 : p < 0.7 ? 1 : 2;
    map.dataset.step = k;
    steps.forEach((s, i) => { s.classList.toggle('opacity-40', i !== k); s.classList.toggle('on', i === k); });
  };
  $$('#map [data-node]').forEach(n => {
    const set = v => { focusKey = v; applyFocus(); $$('#map [data-node]').forEach(x => x.setAttribute('aria-pressed', x.dataset.node === focusKey)); };
    n.setAttribute('aria-pressed', 'false');
    n.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') set(n.dataset.node); });
    n.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') set(null); });
    n.addEventListener('focus', () => set(n.dataset.node)); n.addEventListener('blur', () => set(null));
    n.addEventListener('click', () => set(focusKey === n.dataset.node ? null : n.dataset.node));
  });
  if (reduce || !G) { paintJobs(1); steps.forEach(s => s.classList.remove('opacity-40', 'max-lg:hidden')); document.getElementById('jobs').classList.remove('lg:h-[300vh]'); document.getElementById('jobs-pin').classList.remove('lg:sticky', 'lg:h-[100svh]'); }


  if (!G || !ST || reduce) { if (reduce) { finalState(); hero.dataset.paused = 'true'; } return; }
  G.registerPlugin(ST);
  /* hero entrance */
  G.from('.hero-in', { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
  const toks = $$('#hero .tok');
  G.from(toks, { scale: 0.4, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.07, delay: 0.25 });
  toks.forEach((t, i) => floats.push(G.to(t, { y: (i % 2 ? 1 : -1) * (8 + i), rotation: (i % 2 ? 1 : -1) * 3, duration: 2.6 + (i % 3) * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
  setGoal(0.3);

  /* mouse parallax */
  if (matchMedia('(pointer: fine)').matches) vis.addEventListener('pointermove', e => {
    const r = vis.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
    $$('#hero .par').forEach(t => G.to(t, { x: -dx * 26 * t.dataset.depth, y: -dy * 26 * t.dataset.depth, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }));
  });

  /* hero story: the money flows into the goal */
  const mm = G.matchMedia();
  const heroStory = (pinIt) => {
    const st = { v: 0.3 };
    const tl = G.timeline({
      scrollTrigger: pinIt ? { trigger: hero, refreshPriority: 10, start: 'top top', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 } : { trigger: vis.parentElement, refreshPriority: 10, start: 'center 52%', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 },
      onUpdate() { const p = this.progress(); setCap(p < 0.45 ? 0 : p < 0.72 ? 1 : 2); }
    });
    /* act 1: scattered money flows into the goal */
    toks.forEach((t, i) => {
      const w = t.closest('.tw');
      tl.to(w, { x: () => vis.offsetWidth / 2 - w.offsetLeft, y: () => vis.offsetHeight / 2 - w.offsetTop, scale: 0.15, opacity: 0, ease: 'power2.in', duration: 1 }, i * 0.08);
    });
    tl.to(st, { v: 1, duration: 1.2, ease: 'none', onUpdate: () => setGoal(st.v) }, 0.2);
    /* act 2: the goal is reached, early */
    tl.fromTo('#g-fill', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 1.6)
      .fromTo('#g-burst', { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.7, duration: 0.8, ease: 'power2.out' }, 1.6)
      .fromTo('#g-main', { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.3 }, 1.7)
      .fromTo('#g-done', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 1.9);
    tl.to({}, { duration: 0.4 });
    return tl;
  };
  mm.add('(min-width: 64rem)', () => { heroStory(true); });
  mm.add('(max-width: 63.98rem)', () => { heroStory(false); });

  /* chapter 2 progress */
  mm.add('(min-width: 64rem)', () => { ST.create({ trigger: '#jobs', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => paintJobs(s.progress) }); });
  mm.add('(max-width: 63.98rem)', () => { ST.create({ trigger: '#map', start: 'top 80%', end: 'bottom 40%', scrub: true, onUpdate: s => paintJobs(s.progress) }); });


  // Measure upstream pins first so later sections include the hero’s scroll distance.
  const refreshLayout = () => { ST.sort(); ST.refresh(); };
  refreshLayout();
  if (document.readyState !== 'complete') addEventListener('load', refreshLayout, { once: true });
  document.fonts?.ready.then(refreshLayout);
})();