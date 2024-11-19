
const carousel = document.querySelector('.carousel');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-item').length;

// Función para cambiar el slide
function updateCarousel() {
   const offset = currentSlide * -100 / totalSlides;
   carousel.style.transform = `translateX(${offset}%)`;
}

// Función para mover al siguiente slide
function nextSlide() {
   currentSlide = (currentSlide + 1) % totalSlides;
   updateCarousel();
}

// Función para mover al slide anterior
function prevSlide() {
   currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
   updateCarousel();
}

// Añadir eventos a los botones
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Movimiento automático cada 5 segundos
setInterval(nextSlide, 5000);
