const dialog = document.querySelector('#detail-dialog');
const title = document.querySelector('#dialog-title');
const category = document.querySelector('#dialog-category');
const body = document.querySelector('#dialog-body');
const entries = {
  website: ['作品 / 项目 · 示例', '从零开始，搭一个自己的小站', '项目详情页可以介绍：为什么做这个项目、你负责了什么、用到了哪些工具，以及过程中学到了什么。', '后续可以在这里添加项目截图、GitHub 仓库和在线演示地址。'],
  collection: ['作品 / 项目 · 示例', '日常观察收集计划', '这里可以是课程作业、设计练习、小工具，或者一个自己发起的小实验。小项目也值得被认真记录。', '这是版式示例，不是已经完成的真实项目。'],
  colors: ['灵感角落 · 配色实验', '今天的心情，是这些颜色。', '深空黑、金属银与亮橙。安静的空间里，留一点鲜明的信号。', '以后可以替换成你喜欢的配色、海报、展览或设计作品，并补充来源。'],
  light: ['灵感角落 · 原创 CSS 图形', '把午后的光，留一会儿。', '一个用形状和颜色拼出来的午后窗台。日常里的光影，也可以成为审美收藏的一部分。', '以后这里可以放你的照片，附上拍摄地点和当时的心情。'],
  type: ['灵感角落 · 字体小实验', '慢慢来，也没关系。', '不必把个人网站做成一份严肃的成绩单。可以留一点空间，给当下的自己、还没做完的尝试，以及单纯喜欢的东西。', '以后可以替换成你自己的视觉创作、句子或书影音收藏。']
};
function showDetail(key) {
  const entry = entries[key];
  if (!entry) return;
  category.textContent = entry[0];
  title.textContent = entry[1];
  body.replaceChildren();
  entry.slice(2).forEach((text, index) => {
    const p = document.createElement('p');
    p.textContent = text;
    if (index === 1) p.className = 'dialog-hint';
    body.append(p);
  });
  dialog.showModal();
}
document.querySelectorAll('[data-project], [data-mood]').forEach(button => {
  button.addEventListener('click', () => showDetail(button.dataset.project || button.dataset.mood));
});
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
document.querySelector('.resume-toggle').addEventListener('click', event => {
  const button = event.currentTarget;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('#resume-details').hidden = expanded;
  button.querySelector('span').textContent = expanded ? '＋' : '－';
});
document.querySelector('#contact-button').addEventListener('click', () => {
  document.querySelector('#contact-message').textContent = '你好呀！这里之后会接上你的邮箱或社交账号。';
});

// The page moves through dark space, silver daylight, and back into space.
// Anchor positions follow content height, including an expanded résumé.
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeMeta = document.querySelector('meta[name="theme-color"]');
let sceneStops = [];
let pendingFrame = false;
function measureScenes() {
  const about = document.querySelector('#about');
  const notes = document.querySelector('#notes');
  const projects = document.querySelector('#projects');
  const shelf = document.querySelector('#shelf');
  const contact = document.querySelector('#contact');
  sceneStops = [
    { y: 0, color: [9, 12, 18] },
    { y: about.offsetTop + about.offsetHeight * .45, color: [17, 24, 35] },
    { y: notes.offsetTop + Math.min(notes.offsetHeight * .5, innerHeight * .5), color: [218, 222, 229] },
    { y: projects.offsetTop + projects.offsetHeight * .55, color: [218, 222, 229] },
    { y: shelf.offsetTop + Math.min(shelf.offsetHeight * .4, innerHeight * .5), color: [15, 22, 33] },
    { y: contact.offsetTop + contact.offsetHeight * .5, color: [9, 12, 18] }
  ];
  requestSceneUpdate();
}
function updateScene() {
  pendingFrame = false;
  const position = scrollY + innerHeight * .45;
  let start = sceneStops[0];
  let end = sceneStops[sceneStops.length - 1];
  for (let i = 1; i < sceneStops.length; i++) {
    if (position <= sceneStops[i].y) {
      start = sceneStops[i - 1];
      end = sceneStops[i];
      break;
    }
    start = sceneStops[i];
  }
  const t = Math.max(0, Math.min(1, (position - start.y) / (end.y - start.y || 1)));
  const eased = t * t * (3 - 2 * t);
  const rgb = start.color.map((value, i) => Math.round(value + (end.color[i] - value) * eased));
  const linear = rgb.map(value => {
    const s = value / 255;
    return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  });
  const luminance = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  const light = luminance > .179;
  root.style.setProperty('--scene', rgb.join(','));
  root.style.setProperty('--ink', light ? '#000000' : '#ffffff');
  root.style.setProperty('--muted', luminance > .05 && luminance < .5 ? 'var(--ink)' : 'color-mix(in srgb, var(--ink) 78%, transparent)');
  root.style.setProperty('--accent', light ? '#a22d00' : '#ff762f');
  root.style.setProperty('--scroll-shift', reducedMotion.matches ? '0px' : `${Math.min(scrollY * .12, 100)}px`);
  root.style.setProperty('--orbit-turn', `${-22 + (reducedMotion.matches ? 0 : Math.min(scrollY * .015, 12))}deg`);
  root.style.colorScheme = light ? 'light' : 'dark';
  themeMeta.content = '#' + rgb.map(value => value.toString(16).padStart(2, '0')).join('');
}
function requestSceneUpdate() {
  if (!pendingFrame) {
    pendingFrame = true;
    requestAnimationFrame(updateScene);
  }
}
addEventListener('scroll', requestSceneUpdate, { passive: true });
addEventListener('resize', measureScenes, { passive: true });
reducedMotion.addEventListener('change', requestSceneUpdate);
const sceneObserver = new ResizeObserver(measureScenes);
document.querySelectorAll('main > section').forEach(section => sceneObserver.observe(section));
measureScenes();

const track = document.querySelector('.collection-track');
const cards = [...track.querySelectorAll('.collection-card')];
let currentCard = 0;
function updateCollection() {
  const center = track.getBoundingClientRect().left + track.clientWidth / 2;
  let distance = Infinity;
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const delta = Math.abs(rect.left + rect.width / 2 - center);
    if (delta < distance) { distance = delta; currentCard = index; }
  });
  cards.forEach((card, index) => {
    card.classList.toggle('is-selected', index === currentCard);
    if (index === currentCard) card.setAttribute('aria-current', 'true');
    else card.removeAttribute('aria-current');
  });
  const count = document.querySelector('#shelf-count');
  if (count) count.textContent = `第 ${currentCard + 1} 张，共 ${cards.length} 张`;
}
function moveCollection(direction) {
  const index = Math.max(0, Math.min(cards.length - 1, currentCard + direction));
  track.scrollTo({left:cards[index].offsetLeft - cards[0].offsetLeft,behavior:reducedMotion.matches ? 'instant' : 'smooth'});
}
cards.forEach((card, index) => card.addEventListener('click', event => {
  if (event.target.closest('a') || dragged) return;
  moveCollection(index - currentCard);
}));
track.addEventListener('scroll', updateCollection, {passive:true});
track.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); moveCollection(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let drag = null;
let dragged = false;
track.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a')) return;
  dragged = false;
  drag = {x:event.clientX,scroll:track.scrollLeft};
  track.setPointerCapture(event.pointerId); track.classList.add('dragging');
});
track.addEventListener('pointermove', event => {
  if (drag) { if (Math.abs(event.clientX - drag.x) > 5) dragged = true; track.scrollLeft = drag.scroll - (event.clientX - drag.x); }
});
function stopDrag() { drag = null; track.classList.remove('dragging'); }
track.addEventListener('pointerup', stopDrag);
track.addEventListener('pointercancel', stopDrag);
addEventListener('resize', updateCollection);
updateCollection();

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(items => {
    items.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.add('is-visible');
        reveals.unobserve(item.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.about-portrait,.about-copy,.section-heading,.project-card,.mood-card,.closing-content').forEach(element => {
    element.classList.add('reveal-ready');
    reveals.observe(element);
  });
}
