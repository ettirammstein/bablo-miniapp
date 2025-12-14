// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand(); // на весь экран [web:182]

const userLabel = document.getElementById('user-label');
const connectBtn = document.getElementById('connect-btn');
const svg = document.getElementById('tree-svg');
const treeContent = document.getElementById('tree-content');

// Покажем, кто зашёл
if (tg.initDataUnsafe?.user) {
  const u = tg.initDataUnsafe.user;
  userLabel.textContent = `@${u.username || u.id}`;
}

// Простейший мок реф‑дерева (1 корень + пара детей)
function drawDemoTree() {
  svg.setAttribute('viewBox', '-100 -100 200 200'); // базовый зум

  // линии
  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '0'); line1.setAttribute('y1', '0');
  line1.setAttribute('x2', '-50'); line1.setAttribute('y2', '60');
  line1.setAttribute('stroke', '#888');

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '0'); line2.setAttribute('y1', '0');
  line2.setAttribute('x2', '50'); line2.setAttribute('y2', '60');
  line2.setAttribute('stroke', '#888');

  // узлы
  function circle(x, y, color) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', '8');
    c.setAttribute('fill', color);
    return c;
  }

  treeContent.append(line1, line2,
    circle(0, 0, '#FFD54F'),
    circle(-50, 60, '#4FC3F7'),
    circle(50, 60, '#4FC3F7')
  );
}

// Примитивный зум колёсиком (бесконечный масштаб туда‑сюда)
let zoom = 1;
svg.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom *= e.deltaY < 0 ? 0.9 : 1.1; // приблизить / отдалить
  const size = 200 * zoom;
  svg.setAttribute('viewBox', `${-size / 2} ${-size / 2} ${size} ${size}`);
}, { passive: false });

// Кнопка подключения кошелька (пока заглушка под HERE/HOT)
connectBtn.addEventListener('click', () => {
  // сюда потом вставим логку HERE/HOT testnet
  tg.showAlert('Подключение testnet кошелька (заглушка)');
  // после реального подключения можно будет дернуть бекенд и обновить SVG‑дерево
});

drawDemoTree();
