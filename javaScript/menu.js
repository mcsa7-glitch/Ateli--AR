document.addEventListener("DOMContentLoaded", function () {

  const links = document.querySelectorAll(".menu a");
  const urlAtual = window.location.href;

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (urlAtual.includes(href)) {
      link.classList.add("ativo");
    }
  });

});