// scripts.js


// Highlight active link in header navigation
document.addEventListener('DOMContentLoaded', () => {
    // Get the current page's filename (if empty, default to "index.html")
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) {
      currentPage = "index.html";
    }
    // Add the 'active' class to the link that matches the current page
    const links = document.querySelectorAll('.header-container nav ul li a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  });
  

document.addEventListener('DOMContentLoaded', () => {
  // HORSES PAGE FILTER & SORT
  const horseCards = document.querySelectorAll('.horse-card');
  const filterAge = document.getElementById('filter-age');
  const filterRaces = document.getElementById('filter-races');
  const filterWins = document.getElementById('filter-wins');
  const sortHorses = document.getElementById('sort-horses');

  if (filterAge && filterRaces && filterWins && sortHorses && horseCards.length) {
    const filterFunction = () => {
      const ageValue = filterAge.value;
      const racesValue = filterRaces.value;
      const winsValue = filterWins.value;

      horseCards.forEach(card => {
        const cardAge = parseInt(card.dataset.age, 10);
        const cardRaces = parseInt(card.dataset.races, 10);
        const cardWins = parseInt(card.dataset.wins, 10);

        let ageMatch = (ageValue === 'all');
        if (ageValue === '1-3') { ageMatch = cardAge >= 1 && cardAge <= 3; }
        if (ageValue === '3-5') { ageMatch = cardAge >= 3 && cardAge <= 5; }

        let racesMatch = (racesValue === 'all');
        if (racesValue === '0-10') { racesMatch = cardRaces <= 10; }
        if (racesValue === '10-20') { racesMatch = cardRaces >= 10 && cardRaces <= 20; }
        if (racesValue === '20plus') { racesMatch = cardRaces > 20; }

        let winsMatch = (winsValue === 'all');
        if (winsValue === '0-5') { winsMatch = cardWins <= 5; }
        if (winsValue === '5-10') { winsMatch = cardWins >= 5 && cardWins <= 10; }
        if (winsValue === '10plus') { winsMatch = cardWins > 10; }

        if (ageMatch && racesMatch && winsMatch) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    };

    const sortFunction = () => {
      const sortValue = sortHorses.value;
      const container = document.querySelector('.horse-list');
      const cardsArray = Array.from(container.querySelectorAll('.horse-card')).filter(c => c.style.display !== 'none');

      cardsArray.sort((a, b) => {
        const ageA = parseInt(a.dataset.age, 10);
        const ageB = parseInt(b.dataset.age, 10);
        const racesA = parseInt(a.dataset.races, 10);
        const racesB = parseInt(b.dataset.races, 10);
        const winsA = parseInt(a.dataset.wins, 10);
        const winsB = parseInt(b.dataset.wins, 10);
        const nameA = a.dataset.name.toLowerCase();
        const nameB = b.dataset.name.toLowerCase();

        switch (sortValue) {
          case 'name': return nameA.localeCompare(nameB);
          case 'age': return ageA - ageB;
          case 'races': return racesA - racesB;
          case 'wins': return winsA - winsB;
          default: return 0;
        }
      });

      cardsArray.forEach(card => container.appendChild(card));
    };

    // Event Listeners
    filterAge.addEventListener('change', () => { filterFunction(); sortFunction(); });
    filterRaces.addEventListener('change', () => { filterFunction(); sortFunction(); });
    filterWins.addEventListener('change', () => { filterFunction(); sortFunction(); });
    sortHorses.addEventListener('change', () => { filterFunction(); sortFunction(); });
  }

  // NEWS PAGE FILTER & SORT
  const newsItems = document.querySelectorAll('.news-item');
  const newsDateInput = document.getElementById('news-date');
  const newsSortSelect = document.getElementById('news-sort');

  if (newsDateInput && newsSortSelect && newsItems.length) {
    const filterNews = () => {
      const selectedMonth = newsDateInput.value; // format "YYYY-MM"
      if (!selectedMonth) {
        newsItems.forEach(item => item.style.display = 'block');
        return;
      }
      newsItems.forEach(item => {
        const itemDate = item.dataset.date; // format "YYYY-MM-DD"
        if (itemDate.startsWith(selectedMonth)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    };

    const sortNews = () => {
      const sortValue = newsSortSelect.value;
      const container = document.querySelector('.news-list');
      const visibleItems = Array.from(container.querySelectorAll('.news-item')).filter(i => i.style.display !== 'none');

      visibleItems.sort((a, b) => {
        const dateA = a.dataset.date;
        const dateB = b.dataset.date;
        // Convert "YYYY-MM-DD" to a comparable number or date object
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();

        return sortValue === 'asc' ? timeA - timeB : timeB - timeA;
      });

      visibleItems.forEach(item => container.appendChild(item));
    };

    newsDateInput.addEventListener('change', () => { filterNews(); sortNews(); });
    newsSortSelect.addEventListener('change', () => { filterNews(); sortNews(); });
  }

  // CONTACT FORM SUBMISSION (Simple Example)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you'd handle form data submission via AJAX or a back-end script
      formStatus.textContent = 'Thank you! Your message has been sent.';
      contactForm.reset();
    });
  }
});





// for news. htmls

 
  document.addEventListener('DOMContentLoaded', () => {
    const newsList = document.getElementById('news-list');
    const newsDateInput = document.getElementById('news-date');
    const newsSortSelect = document.getElementById('news-sort');
    let allNews = [];

    // Fetch news data from the API
    fetch('https://flato.q11.jvmhost.net/api/horses/news')
      .then(res => res.json())
      .then(data => {
        allNews = data;
        renderNews(allNews);
      })
      .catch(err => {
        newsList.innerHTML = '<p>Error loading news.</p>';
        console.error(err);
      });

    // Render news items
    function renderNews(newsItems) {
      newsList.innerHTML = ''; // Clear existing
      newsItems.forEach(item => {
        const article = document.createElement('article');
        article.className = 'news-item';
        article.dataset.date = item.publicationDate;

        const media = item.urlVideo && item.urlVideo.trim()
          ? `<iframe width="100%" height="315" src="${item.urlVideo.replace('watch?v=', 'embed/')}" 
                     frameborder="0" allowfullscreen></iframe>`
          : `<img src="${item.urlImage}" alt="${item.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;" />`;

        article.innerHTML = `
          <h2>${item.title}</h2>
          <p class="date">${formatDate(item.publicationDate)}</p>
          ${media}
          <p class="summary">${item.brief}</p>
          <a href="news-details.html?id=${item.id}">Read More</a>
        `;
        newsList.appendChild(article);
      });
    }

    // Filter and sort logic
    function filterAndSortNews() {
      const selectedMonth = newsDateInput.value;
      const sortOrder = newsSortSelect.value;

      let filtered = [...allNews];

      if (selectedMonth) {
        filtered = filtered.filter(item => item.publicationDate.startsWith(selectedMonth));
      }

      filtered.sort((a, b) => {
        const timeA = new Date(a.publicationDate).getTime();
        const timeB = new Date(b.publicationDate).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });

      renderNews(filtered);
    }

    newsDateInput.addEventListener('change', filterAndSortNews);
    newsSortSelect.addEventListener('change', filterAndSortNews);

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  });
 
