const sliderContent = document.querySelector('.slider-content');
const slides = document.querySelectorAll('.slide-box');
const navManual = document.querySelector('.nav-manual');

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
const totalSlides = slides.length;
const dots = [];
let intervalo;

// ================= CRIAR BOLINHAS =================
for (let i = 0; i < totalSlides; i++) {

    const dot = document.createElement('span');

    dot.classList.add('manual-btn');

    if (i === 0) {
        dot.classList.add('ativo');
    }

    dot.addEventListener('click', () => {

        currentIndex = i;

        showSlide(currentIndex);

        reiniciarSlider();
    });

    navManual.appendChild(dot);

    dots.push(dot);
}

// ================= MOSTRAR SLIDE =================
function showSlide(index) {

    sliderContent.style.transform =
        `translateX(-${index * 100}%)`;

    dots.forEach(dot => {
        dot.classList.remove('ativo');
    });

    dots[index].classList.add('ativo');
}

// ================= SLIDER AUTOMÁTICO =================
function iniciarSlider() {

    clearInterval(intervalo);

    intervalo = setInterval(() => {

        currentIndex =
            (currentIndex + 1) % totalSlides;

        showSlide(currentIndex);

    }, 6000);
}

// ================= REINICIAR =================
function reiniciarSlider() {

    clearInterval(intervalo);

    iniciarSlider();
}

// ================= BOTÃO PRÓXIMO =================
nextBtn.addEventListener("click", () => {

    currentIndex =
        (currentIndex + 1) % totalSlides;

    showSlide(currentIndex);

    reiniciarSlider();
});

// ================= BOTÃO VOLTAR =================
prevBtn.addEventListener("click", () => {

    currentIndex =
        (currentIndex - 1 + totalSlides) % totalSlides;

    showSlide(currentIndex);

    reiniciarSlider();
});

// ================= INICIAR =================
iniciarSlider();