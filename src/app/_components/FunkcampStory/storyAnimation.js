/** Scroll choreography adapted from the supplied Funkcamp reference.
 * Queries and mutations stay inside root; dispose on client navigation.
 * @param {HTMLDivElement} root
 */
export function initFunkcampStory(root) {
  const events = new AbortController();
  let disposed = false;
  const listen = (target, name, handler, options = {}) =>
    target.addEventListener(name, handler, {
      ...options,
      signal: events.signal,
    });
  const $ = (selector) => root.querySelector(selector);
  const all = (selector) => [...root.querySelectorAll(selector)];
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = (a, b, p) => {
    const t = clamp((p - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !reduced.matches,
    frameId = 0,
    dirty = true,
    activeTeacher = -1;
  let viewportHeight = innerHeight;
  const scenes = all('[data-scene]').map((el) => ({
    el,
    key: el.dataset.scene,
    stage: el.querySelector('.stage'),
    top: 0,
    runway: 1,
    w: 0,
    h: 0,
  }));
  const teacherScene = scenes.find((s) => s.key === 'teachers');
  const teachers = all('.teacher'),
    picks = all('[data-pick]');
  const figures = all('.final-lineup figure'),
    ticks = all('.flight-ticks span');
  const teacherIndex = $('.teacher-index'),
    teacherProgress = $('.teacher-ink-progress span'),
    teacherBackword = $('.teacher-backword');
  const selectors = [
    'h1',
    '.hero-meta',
    '.hero-bottom',
    '.hero-scroll-note',
    '.door-world',
    '.door-front',
    '.door-leaf',
    '.home-path',
    '.hero-walker',
    '.airport-backdrop',
    '.airport-foreground',
    '.airport-type',
    '.airplane',
    '.airport-copy',
    '.terminal-panorama',
    '.terminal-glass',
    '.terminal-walker',
    '.terminal-copy',
    '.city-title',
    '.city-sun',
    '.city-far',
    '.city-mid',
    '.city-near',
    '.water',
    '.walk-panorama',
    '.traveler',
    '.walk-copy',
    '.studio-art',
    '.studio-copy',
    '.class-photo-frame',
    '.final-funk',
    '.final-year',
    '.final-date',
  ];
  const nodes = Object.fromEntries(selectors.map((s) => [s, $(s)]));
  const feet = [684 / 724, 689 / 724, 690 / 724, 694 / 724];
  const actors = {};
  const transform = (selector, value) => {
    if (nodes[selector]) nodes[selector].style.transform = value;
  };
  const opacity = (selector, value) => {
    if (nodes[selector])
      nodes[selector].style.opacity = clamp(value).toFixed(3);
  };
  function measure() {
    viewportHeight = innerHeight;
    scenes.forEach((s) => {
      s.top = s.el.getBoundingClientRect().top + scrollY;
      s.w = s.stage.clientWidth;
      s.h = s.stage.offsetHeight;
      s.runway = Math.max(1, s.el.offsetHeight - s.h);
    });
    const home = scenes[0],
      door = nodes['.door-world'];
    home.door = {
      left: door.offsetLeft,
      right: door.offsetLeft + door.offsetWidth,
      width: door.offsetWidth,
      floor: door.offsetTop + door.offsetHeight,
    };
    nodes['.home-path'].style.clipPath =
      `inset(0 ${Math.max(0, home.w - home.door.right + (home.w < 800 ? 7 : 12))}px 0 0)`;
    ['.hero-walker', '.terminal-walker', '.traveler'].forEach((selector) => {
      actors[selector] = {
        w: nodes[selector].offsetWidth,
        h: nodes[selector].offsetHeight,
      };
    });
    dirty = false;
  }
  function actor(selector, x, floor, distance, scale = 1) {
    const el = nodes[selector],
      size = actors[selector];
    const stride = Math.max(20, size.h * 0.15);
    const frame = Math.floor(Math.max(0, distance) / stride) % 4;
    el.style.backgroundPositionX = `${(frame / 3) * 100}%`;
    el.style.transform = `translate3d(${x.toFixed(2)}px,${(floor - size.h * feet[frame]).toFixed(2)}px,0) scale(${scale.toFixed(3)})`;
    return frame;
  }
  function showTeacher(index) {
    if (index === activeTeacher) return;
    activeTeacher = index;
    teachers.forEach((el, i) => {
      const active = i === index;
      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', String(enabled && !active));
      el.inert = enabled && !active;
    });
    picks.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    $('#fc-story-teacher-count').textContent =
      String(index + 1).padStart(2, '0') + ' / 06';
    teacherIndex.textContent = String(index + 1).padStart(2, '0');
    $('#fc-story-prev-teacher').disabled = index === 0;
    $('#fc-story-next-teacher').disabled = index === 5;
  }
  function goTeacher(index) {
    if (!enabled) return;
    if (dirty) measure();
    const target = clamp(index, 0, 5);
    scrollTo({
      top: teacherScene.top + ((target + 0.48) / 6) * teacherScene.runway,
      behavior: reduced.matches ? 'instant' : 'smooth',
    });
  }
  picks.forEach((button) =>
    listen(button, 'click', () => goTeacher(+button.dataset.pick)),
  );
  listen($('#fc-story-prev-teacher'), 'click', () =>
    goTeacher(activeTeacher - 1),
  );
  listen($('#fc-story-next-teacher'), 'click', () =>
    goTeacher(activeTeacher + 1),
  );
  function paint(s, p) {
    const { w, h } = s,
      mobile = w < 800;
    if (s.key === 'hero') {
      const open = ease(0.06, 0.25, p),
        approach = ease(0.28, 0.72, p),
        enter = ease(0.72, 0.92, p),
        exit = ease(0.94, 1, p);
      const size = actors['.hero-walker'];
      const start = w * (mobile ? 0.2 : 0.51),
        threshold = s.door.left - size.w * 0.48,
        end = s.door.right - size.w * 0.13;
      const x =
        approach < 1
          ? mix(start, threshold, approach)
          : mix(threshold, end, enter);
      actor(
        '.hero-walker',
        x,
        s.door.floor,
        Math.abs(x - start),
        1 - enter * 0.1,
      );
      opacity('.hero-walker', 1 - ease(0.86, 0.98, p));
      transform('.door-leaf', `rotateY(${-open * 108}deg)`);
      transform('.door-world', `translateY(${-exit * 8}px)`);
      transform('.door-front', `translateY(${-exit * 8}px)`);
      const fade = ease(0.65, 0.96, p);
      opacity('h1', 1 - fade);
      transform('h1', `translateY(${-fade * 18}px)`);
      opacity('.hero-bottom', 1 - ease(0.81, 1, p));
      opacity('.hero-scroll-note', 1 - ease(0.25, 0.44, p));
    }
    if (s.key === 'airport') {
      const frame = Math.min(3, Math.floor(ease(0.08, 0.79, p) * 4));
      const positions = mobile
        ? [
            [0.27, 0.4, 0.61, -5],
            [0.38, 0.46, 0.75, -3],
            [0.49, 0.53, 0.9, -1],
            [0.61, 0.62, 1.02, 0],
          ]
        : [
            [0.48, 0.2, 0.62, -5],
            [0.53, 0.28, 0.78, -3],
            [0.58, 0.4, 0.94, -1],
            [0.64, 0.55, 1.05, 0],
          ];
      const [x, y, scale, angle] = positions[frame];
      transform(
        '.airplane',
        `translate3d(${x * w}px,${y * h}px,0) rotate(${angle}deg) scale(${scale})`,
      );
      ticks.forEach((tick, i) => tick.classList.toggle('active', i === frame));
      const camera = `translateX(${-p * w * 0.015}px) scale(${1 + p * 0.035})`;
      transform('.airport-backdrop', camera);
      transform('.airport-foreground', camera);
      opacity('.airport-type', 1 - ease(0.08, 0.23, p));
      transform('.airport-type', `translateY(${-ease(0.08, 0.23, p) * 12}px)`);
      const arrival = ease(0.34, 0.52, p);
      opacity('.airport-copy', arrival);
      transform('.airport-copy', `translateY(${(1 - arrival) * 14}px)`);
    }
    if (s.key === 'terminal') {
      const travel =
        Math.max(0, nodes['.terminal-panorama'].offsetWidth - w) *
        ease(0.08, 0.85, p);
      const start = w * (mobile ? 0.12 : 0.19),
        end = w * (mobile ? 0.52 : 0.64),
        progress = ease(0.12, 0.89, p),
        x = mix(start, end, progress);
      transform('.terminal-panorama', `translate3d(${-travel}px,0,0)`);
      transform('.terminal-glass', `translateX(${-travel * 0.36}px)`);
      actor('.terminal-walker', x, h * 0.88, travel + Math.abs(x - start));
      opacity('.terminal-copy', 1 - ease(0.57, 0.82, p) * 0.88);
      transform('.terminal-copy', `translateY(${-p * 12}px)`);
    }
    if (s.key === 'city') {
      transform('.city-title', `translateY(${-p * 12}px)`);
      transform('.city-sun', `translateY(${(1 - ease(0.03, 0.65, p)) * 35}px)`);
      [
        ['.city-far', 0.03, 0.45, 100],
        ['.city-mid', 0.13, 0.62, 145],
        ['.city-near', 0.25, 0.8, 190],
      ].forEach(([selector, a, b, d]) => {
        const reveal = ease(a, b, p);
        transform(selector, `translateY(${(1 - reveal) * d}px)`);
        opacity(selector, reveal);
      });
      transform('.water', `translateX(${-p * 25}px)`);
    }
    if (s.key === 'walk') {
      const progress = ease(0.08, 0.87, p),
        travel =
          Math.max(0, nodes['.walk-panorama'].offsetWidth - w) * progress;
      transform('.walk-panorama', `translate3d(${-travel}px,0,0)`);
      const start = w * (mobile ? 0.1 : 0.19),
        x = mix(start, w * (mobile ? 0.51 : 0.59), progress);
      actor('.traveler', x, h * 0.85, travel + Math.abs(x - start));
      opacity('.walk-copy', 1 - ease(0.36, 0.64, p));
      transform('.walk-copy', `translateY(${-ease(0.36, 0.64, p) * 12}px)`);
    }
    if (s.key === 'studio') {
      transform('.studio-art', `scale(${1 + p * 0.09})`);
      transform(
        '.class-photo-frame',
        `translateY(${(1 - ease(0.03, 0.45, p)) * 20}px) rotate(${-2 + ease(0.03, 0.65, p) * 2}deg)`,
      );
      transform('.studio-copy', `translateY(${-p * 8}px)`);
    }
    if (s.key === 'teachers') {
      const t = clamp(p * 6, 0, 5.999),
        index = Math.floor(t),
        local = t - index;
      showTeacher(index);
      const incoming = index === 0 ? 1 : ease(0.02, 0.2, local),
        outgoing = index === 5 ? 0 : ease(0.87, 0.99, local),
        readable = incoming * (1 - outgoing);
      teacherProgress.style.transform = `scaleX(${(index + ease(0.02, 0.85, local)) / 6})`;
      teacherBackword.style.transform = `translateX(${-p * 35}px)`;
      teacherIndex.style.transform = `translateY(${(1 - incoming) * 10 - outgoing * 7}px)`;
      teacherIndex.style.opacity = String(readable);
      teachers.forEach((teacher, i) => {
        const current = i === index;
        teacher.style.opacity = current ? String(readable) : '0';
        if (current) {
          const image = teacher.querySelector('img'),
            copy = teacher.querySelector('.teacher-copy'),
            paint = teacher.querySelector('.teacher-disc'),
            scribble = teacher.querySelector('.teacher-scribble');
          image.style.transform = `translateY(${(1 - incoming) * 23 - outgoing * 12 - 4 * ease(0.2, 0.8, local)}px)`;
          copy.style.transform = `translateY(${(1 - incoming) * 10 - outgoing * 8}px)`;
          paint.style.opacity = String(0.75 + incoming * 0.25);
          paint.style.clipPath = `inset(0 ${(1 - incoming) * 100}% 0 0)`;
          paint.style.setProperty(
            '--spray-turn',
            `${-5 + local * 9 + (index % 3) * 2}deg`,
          );
          paint.style.setProperty(
            '--spray-scale',
            String(0.93 + ease(0.05, 0.8, local) * 0.1),
          );
          scribble.style.setProperty(
            '--draw',
            String(1 - ease(0.12, 0.42, local)),
          );
          scribble.style.opacity = String(incoming);
        }
      });
    }
    if (s.key === 'finale') {
      figures.forEach((figure, i) => {
        const reveal = ease(0.02 + i * 0.035, 0.25 + i * 0.035, p);
        figure.style.opacity = String(reveal);
        figure.style.transform = `translateY(${(1 - reveal) * 28}px)`;
      });
      const title = ease(0.57, 0.76, p),
        year = ease(0.66, 0.85, p);
      transform('.final-funk', `translateX(${(1 - title) * -35}%)`);
      opacity('.final-funk', title);
      transform('.final-year', `translateX(${(1 - year) * 35}%)`);
      opacity('.final-year', year);
      opacity('.final-date', ease(0.8, 0.95, p));
    }
  }
  function render() {
    frameId = 0;
    if (dirty) measure();
    const y = scrollY;
    for (const s of scenes) {
      if (
        enabled &&
        (y < s.top - viewportHeight || y > s.top + s.runway + viewportHeight)
      )
        continue;
      const p = enabled
        ? clamp((y - s.top) / s.runway)
        : s.key === 'hero'
          ? 0.3
          : s.key === 'finale' || s.key === 'city'
            ? 1
            : 0.5;
      paint(s, p);
    }
    if (!enabled)
      teachers.forEach((teacher) => {
        teacher.inert = false;
        teacher.setAttribute('aria-hidden', 'false');
      });
  }
  function request() {
    if (!disposed && !frameId && !document.hidden)
      frameId = requestAnimationFrame(render);
  }
  function setMotion(value, preserveScene = true) {
    if (dirty) measure();
    const anchor =
      [...scenes].reverse().find((s) => scrollY >= s.top) || scenes[0];
    enabled = value;
    activeTeacher = -1;
    root.classList.toggle('motion-off', !value);
    dirty = true;
    measure();
    showTeacher(0);
    request();
    if (preserveScene && scrollY > 0)
      scrollTo({ top: anchor.top, behavior: 'instant' });
  }
  listen(reduced, 'change', () => setMotion(!reduced.matches));
  listen(window, 'scroll', request, { passive: true });
  listen(
    window,
    'resize',
    () => {
      dirty = true;
      request();
    },
    { passive: true },
  );
  listen(
    window,
    'load',
    () => {
      dirty = true;
      request();
    },
    { once: true },
  );
  listen(document, 'visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else request();
  });
  document.fonts.ready.then(() => {
    if (!disposed) {
      dirty = true;
      request();
    }
  });
  const observer = new ResizeObserver(() => {
    dirty = true;
    request();
  });
  observer.observe(root);
  scenes.forEach((scene) => observer.observe(scene.stage));
  root.querySelectorAll('img').forEach((img) =>
    listen(img, 'load', () => {
      dirty = true;
      request();
    }),
  );
  setMotion(enabled, false);
  request();
  return () => {
    disposed = true;
    events.abort();
    observer.disconnect();
    cancelAnimationFrame(frameId);
  };
}
