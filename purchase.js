// ============ ГЛОБАЛЬНЫЕ ДАННЫЕ ============
// Для примера храним здесь. В реальном проекте — в БД.
// Обратите внимание на поле "status": 'draft', 'for sale' или 'purchased'
const horsesData = [
  {
    id: 1,
    name: 'Лошадь А',
    buyers: [],
    status: 'for sale' // Если 'draft' — не будет отображаться для покупки
  },
  {
    id: 2,
    name: 'Лошадь Б',
    buyers: [],
    status: 'for sale'
  },
  {
    id: 3,
    name: 'Лошадь В',
    buyers: [],
    status: 'for sale'
  }
];

// ============ ПЕРЕМЕННЫЕ ДЛЯ МОДАЛКИ =============
let modal, modalClose, purchaseForm;
let currentHorseId = null; // Какая лошадь сейчас покупается

document.addEventListener('DOMContentLoaded', () => {
  modal = document.getElementById('modal');
  modalClose = document.getElementById('modal-close');
  purchaseForm = document.getElementById('purchase-form');

  // Отрисовать лошадей, которые "for sale"
  renderHorses();

  // Закрыть модальное окно по клику на «крестик»
  modalClose.addEventListener('click', () => {
    closeModal();
  });

  // Закрыть модальное окно при клике вне содержимого
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Обработка отправки формы покупки
  purchaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerAmount = parseFloat(document.getElementById('buyerAmount').value);

    if (buyerName && buyerAmount > 0 && currentHorseId != null) {
      // Найти лошадь
      const horse = horsesData.find(h => h.id === currentHorseId);
      if (horse && horse.status === 'for sale') {
        // Добавляем покупателя
        horse.buyers.push({ name: buyerName, amount: buyerAmount });
        // Проверяем статус покупки
        updateHorsePurchaseStatus(horse);
      }

      // Обновляем отображение
      renderHorses();
      // Закрываем модальное
      closeModal();
    }
  });
});

// ============== ФУНКЦИИ ==============

// Отрисовка лошадей, доступных к продаже
function renderHorses() {
  const container = document.getElementById('horses-container');
  container.innerHTML = '';

  // Берём только тех, у кого status = 'for sale' или 'purchased' (чтобы видеть, что куплено)
  const forSaleHorses = horsesData.filter(h => h.status === 'for sale' || h.status === 'purchased');

  forSaleHorses.forEach(horse => {
    const card = document.createElement('div');
    card.classList.add('horse-card');

    // Заголовок с названием лошади
    const title = document.createElement('h2');
    title.textContent = horse.name;

    // Определяем текущую цену и остаток
    const { finalPrice, totalInvested, leftover } = calculatePriceData(horse);

    // Статус (куплена или нет)
    const statusP = document.createElement('p');
    if (horse.status === 'purchased') {
      statusP.innerHTML = '<strong>Статус:</strong> Куплена';
    } else {
      statusP.innerHTML = '<strong>Статус:</strong> Продаётся';
    }

    // Выводим суммарно инвестировано
    const investedP = document.createElement('p');
    investedP.textContent = `Суммарно внесено: $${totalInvested}`;

    // Цена и остаток
    const priceP = document.createElement('p');
    if (horse.status === 'purchased') {
      // Если уже куплена
      priceP.textContent = `Лошадь полностью оплачена.`;
    } else {
      priceP.textContent = `Общая цена: $${finalPrice}. Осталось: $${leftover}`;
    }

    // Список покупателей
    const buyersBlock = document.createElement('div');
    buyersBlock.classList.add('buyers-list');

    if (horse.buyers.length === 0) {
      buyersBlock.textContent = 'Пока нет покупателей.';
    } else {
      buyersBlock.innerHTML = '<strong>Покупатели:</strong><br>';
      horse.buyers.forEach(buyer => {
        buyersBlock.innerHTML += `${buyer.name}: $${buyer.amount}<br>`;
      });
    }

    // Кнопка "Купить часть лошади"
    const buyButton = document.createElement('button');
    buyButton.textContent = 'Купить часть лошади';

    // Если лошадь уже куплена, блокируем кнопку
    if (horse.status === 'purchased') {
      buyButton.disabled = true;
    }

    // Обработчик клика на кнопку
    buyButton.addEventListener('click', () => {
      currentHorseId = horse.id;
      openModal();
    });

    // Добавляем всё в карточку
    card.appendChild(title);
    card.appendChild(statusP);
    card.appendChild(investedP);
    card.appendChild(priceP);
    card.appendChild(buyersBlock);
    card.appendChild(buyButton);

    container.appendChild(card);
  });
}

// Открыть модальное окно
function openModal() {
  modal.style.display = 'block';
  purchaseForm.reset();
}

// Закрыть модальное окно
function closeModal() {
  modal.style.display = 'none';
  currentHorseId = null;
}

// Расчёт цены и leftover
function calculatePriceData(horse) {
  const totalInvested = horse.buyers.reduce((sum, b) => sum + b.amount, 0);
  let finalPrice = 1000; // Базово

  // Логика определения итоговой цены:
  // 1) Если ровно 1 покупатель и totalInvested >= 1000 => куплено
  // 2) Если >1 покупатель:
  //    - до 10 => 1500
  //    - до 20 => 2000
  const buyerCount = horse.buyers.length;

  if (buyerCount === 1) {
    // Если единственный покупатель внёс >= 1000 — значит лошадь оплачена
    if (totalInvested >= 1000) {
      finalPrice = 1000;
    } else {
      // Если внёс меньше 1000, теоретически можно расширить логику, 
      // но оставим как есть (неоплачено, нужно добрать до 1000)
      finalPrice = 1000;
    }
  } else if (buyerCount > 1 && buyerCount <= 10) {
    finalPrice = 1500;
  } else if (buyerCount > 10 && buyerCount <= 20) {
    finalPrice = 2000;
  } else if (buyerCount > 20) {
    // При желании можно продолжить логику
    finalPrice = 2000; // или больше
  }

  const leftover = Math.max(0, finalPrice - totalInvested);

  return { finalPrice, totalInvested, leftover };
}

// Проверка, не куплена ли лошадь после нового взноса
function updateHorsePurchaseStatus(horse) {
  const { finalPrice, totalInvested } = calculatePriceData(horse);

  if (totalInvested >= finalPrice) {
    horse.status = 'purchased'; // помечаем как купленную
  }
}


// Ensure that the fields exist and are numbers (using parseInt as needed)
const basePrice = parseInt(horse.price) || 0;
const price5 = parseInt(horse.price5) || basePrice;
const price10 = parseInt(horse.price10) || basePrice;
const price15 = parseInt(horse.price15) || basePrice;
const price20 = parseInt(horse.price20) || basePrice;

let applicablePrice = basePrice;
const buyerCount = horse.buyers ? horse.buyers.length : 0;

if (buyerCount > 0 && buyerCount <= 5) {
  applicablePrice = price5;
} else if (buyerCount > 5 && buyerCount <= 10) {
  applicablePrice = price10;
} else if (buyerCount > 10 && buyerCount <= 15) {
  applicablePrice = price15;
} else if (buyerCount > 15 && buyerCount <= 20) {
  applicablePrice = price20;
}

const totalPaid = horse.buyers ? horse.buyers.reduce((sum, b) => sum + parseInt(b.amount), 0) : 0;
const remaining = Math.max(0, applicablePrice - totalPaid);
