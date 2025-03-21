// ========= ПРИМЕР ТЕХ ЖЕ ГЛОБАЛЬНЫХ ДАННЫХ (Синхронизация с purchase.js) =========
// Для демонстрации используется тот же массив, что и на purchase.html.
// В реальном проекте эти данные хранятся в БД, а админка и витрина обращаются к единому источнику.
window.horsesData = window.horsesData || [
  {
    id: 1,
    name: 'Лошадь А',
    buyers: [],
    status: 'for sale'
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

document.addEventListener('DOMContentLoaded', () => {
  const formCreate = document.getElementById('create-horse');
  const adminHorsesList = document.getElementById('admin-horses-list');

  // Рисуем список на старте
  renderAdminHorses();

  // При создании новой лошади
  formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('horseName');
    const horseName = nameInput.value.trim();
    if (horseName) {
      // Генерируем новый ID (условно)
      const newId = getNewHorseId();
      // Создаём лошадь в статусе draft
      window.horsesData.push({
        id: newId,
        name: horseName,
        buyers: [],
        status: 'draft'
      });
      nameInput.value = '';
      renderAdminHorses();
    }
  });
});

// Генерация нового ID (для примера просто +1 от макс)
function getNewHorseId() {
  let maxId = 0;
  window.horsesData.forEach(h => {
    if (h.id > maxId) maxId = h.id;
  });
  return maxId + 1;
}

// Отрисовать список лошадей в админке
function renderAdminHorses() {
  const adminHorsesList = document.getElementById('admin-horses-list');
  adminHorsesList.innerHTML = '';

  if (window.horsesData.length === 0) {
    adminHorsesList.textContent = 'Лошадей пока нет.';
    return;
  }

  window.horsesData.forEach(horse => {
    const card = document.createElement('div');
    card.classList.add('admin-horse-card');

    const title = document.createElement('h2');
    title.textContent = horse.name;

    const statusP = document.createElement('p');
    statusP.innerHTML = `<strong>Статус:</strong> ${horse.status}`;

    // Покупатели
    const buyersDiv = document.createElement('div');
    buyersDiv.classList.add('buyers-info');
    if (horse.buyers.length === 0) {
      buyersDiv.textContent = 'Покупателей нет.';
    } else {
      buyersDiv.innerHTML = '<strong>Покупатели:</strong><br>';
      horse.buyers.forEach(b => {
        buyersDiv.innerHTML += `${b.name}: $${b.amount}<br>`;
      });
    }

    // Кнопки управления
    const btnWrapper = document.createElement('div');
    btnWrapper.classList.add('button-wrapper');

    // Кнопка «Опубликовать» (доступна, если статус draft)
    if (horse.status === 'draft') {
      const publishBtn = document.createElement('button');
      publishBtn.textContent = 'Опубликовать (for sale)';
      publishBtn.addEventListener('click', () => {
        horse.status = 'for sale';
        renderAdminHorses();
      });
      btnWrapper.appendChild(publishBtn);
    }

    card.appendChild(title);
    card.appendChild(statusP);
    card.appendChild(buyersDiv);
    card.appendChild(btnWrapper);
    adminHorsesList.appendChild(card);
  });
}
