// header.js
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
  