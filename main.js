// Telegram Mini App
const tg = window.Telegram.WebApp;
tg.expand();

const userLabel = document.getElementById('user-label');
const walletLabel = document.getElementById('wallet-label');
const connectBtn = document.getElementById('connect-btn');
const svg = document.getElementById('tree-svg');
const treeContent = document.getElementById('tree-content');

// Показываем логин в правом верхнем углу
if (tg.initDataUnsafe?.user) {
  const u = tg.initDataUnsafe.user;
  userLabel.textContent = `@${u.username || u.id}`;
}

// URL Vercel-бэкенда
const API_URL = 'https://v0-bablo3000.vercel.app/api/index';

// Демонстрационное реф‑дерево
function drawDemoTree() {
  svg.setAttribute('viewBox', '-100 -100 200 200');

  const makeLine = (x1, y1, x2, y2) => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    l.setAttribute('stroke', '#64748b');
    l.setAttribute('stroke-width', '2');
    return l;
  };

  const makeCircle = (x, y, color) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', '8');
    c.setAttribute('fill', color);
    return c;
  };

  treeContent.append(
    makeLine(0, 0, -50, 60),
    makeLine(0, 0, 50, 60),
    makeCircle(0, 0, '#22c55e'),
    makeCircle(-50, 60, '#38bdf8'),
    makeCircle(50, 60, '#38bdf8')
  );
}

// Простейший зум по колесу
let zoom = 1;
svg.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    zoom *= e.deltaY < 0 ? 0.9 : 1.1;
    const size = 200 * zoom;
    svg.setAttribute('viewBox', `${-size / 2} ${-size / 2} ${size} ${size}`);
  },
  { passive: false }
);

// Заглушка адреса HOT-кошелька,
// пока не прикручен реальный HOT SDK
async function getHotWalletPlaceholder(telegramId) {
  // здесь потом будет вызов HOT SDK
  return `hot-placeholder-${telegramId}`;
}

// ---------- ЛОГИКА КНОПКИ: СТАРТ → ЗАНЯТЬ ОЧЕРЕДЬ ----------

let registered = false;

// один обработчик, переключающийся по состоянию
connectBtn.addEventListener('click', async () => {
  if (!registered) {
    await handleStart();
  } else {
    await handleJoinTestnet();
  }
});

async function handleStart() {
  try {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Подключаем…';

    const user = tg.initDataUnsafe?.user;
    if (!user) {
      tg.showAlert('Нет Telegram-пользователя в initData');
      return;
    }

    const hotWallet = await getHotWalletPlaceholder(user.id);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register_hot',
        telegram_id: user.id,
        username: user.username,
        hot_wallet: hotWallet
      })
    });

    if (!res.ok) {
      throw new Error('API error: ' + (await res.text()));
    }

    const data = await res.json();

    // показываем адрес под ником
    walletLabel.textContent = hotWallet;

    const msg = `Ты в очереди предстарта.
ID: ${user.id}
Очередь: #${data.position || '?'}
Уровень: ${data.tier || '—'}`;
    tg.showAlert(msg);

    registered = true;
    connectBtn.textContent = 'Занять очередь в Testnet';
  } catch (e) {
    console.error(e);
    tg.showAlert('Не удалось подключить. Попробуй ещё раз.');
    connectBtn.textContent = 'СТАРТ';
  } finally {
    connectBtn.disabled = false;
  }
}

// Заглушка под контракт testnet
async function handleJoinTestnet() {
  tg.showAlert('Тут будет вызов контракта Testnet и оплата уровня (заглушка).');
}

drawDemoTree();
