const currentPage = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});