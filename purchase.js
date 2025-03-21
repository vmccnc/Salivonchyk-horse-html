// purchase.js

// Массив лошадей (пример)
const horsesData = [
  {
    id: 1,
    name: 'Лошадь А',
    // buyers — список { name, amount }, 
    // который будет пополняться
    buyers: []
  },
  {
    id: 2,
    name: 'Лошадь Б',
    buyers: []
  },
  {
    id: 3,
    name: 'Лошадь В',
    buyers: []
  }
];

// Ссылки на элементы
let modal, modalClose, purchaseForm;
let currentHorseId = null; // Для хранения ID лошади, которую покупаем

document.addEventListener('DOMContentLoaded', () => {
  modal = document.getElementById('modal');
  modalClose = document.getElementById('modal-close');
  purchaseForm = document.getElementById('purchase-form');

  // Генерация карточек лошадей на странице
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

  // Обработка отправки формы
  purchaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerAmount = parseFloat(document.getElementById('buyerAmount').value);

    if (buyerName && buyerAmount > 0 && currentHorseId != null) {
      // Найти лошадь по ID
      const horse = horsesData.find(h => h.id === currentHorseId);
      if (horse) {
        // Добавляем покупателя
        horse.buyers.push({ name: buyerName, amount: buyerAmount });
      }
      // Перерисовываем список
      renderHorses();
      // Закрываем модальное
      closeModal();
    }
  });
});

// Функция рендера карточек
function renderHorses() {
  const container = document.getElementById('horses-container');
  container.innerHTML = '';

  horsesData.forEach(horse => {
    // Создаём элемент карточки
    const card = document.createElement('div');
    card.classList.add('horse-card');

    // Определяем текущую цену в зависимости от количества покупателей
    const totalBuyers = horse.buyers.length;
    let currentPrice = 1000; // по умолчанию
    if (totalBuyers === 0) {
      // Если вообще никто не купил (теоретически цена = 1000)
      currentPrice = 1000;
    } else if (totalBuyers <= 10) {
      // Если покупателей до 10
      currentPrice = 1500;
    } else if (totalBuyers <= 20) {
      // Если покупателей до 20
      currentPrice = 2000;
    }
    // Можно расширить логику дальше по желанию

    // Заголовок с названием лошади
    const title = document.createElement('h2');
    title.textContent = horse.name;

    // Блок с ценой
    const price = document.createElement('p');
    price.textContent = `Текущая цена: $${currentPrice}`;

    // Список покупателей
    const buyersBlock = document.createElement('div');
    buyersBlock.classList.add('buyers-list');

    if (horse.buyers.length === 0) {
      buyersBlock.textContent = 'Пока нет покупателей';
    } else {
      buyersBlock.innerHTML = '<strong>Список покупателей:</strong><br>';
      horse.buyers.forEach(buyer => {
        buyersBlock.innerHTML += `${buyer.name} внёс(ла) $${buyer.amount}<br>`;
      });
    }

    // Кнопка "Купить часть лошади"
    const buyButton = document.createElement('button');
    buyButton.textContent = 'Купить часть лошади';
    buyButton.addEventListener('click', () => {
      // Запоминаем, какую лошадь покупаем
      currentHorseId = horse.id;
      // Открываем модальное окно
      openModal();
    });

    // Добавляем элементы в карточку
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(buyersBlock);
    card.appendChild(buyButton);

    // Добавляем карточку в контейнер
    container.appendChild(card);
  });
}

// Открыть модальное окно
function openModal() {
  modal.style.display = 'block';
  // Очищаем форму
  purchaseForm.reset();
}

// Закрыть модальное окно
function closeModal() {
  modal.style.display = 'none';
  currentHorseId = null;
}
