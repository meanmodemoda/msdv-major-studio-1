var swiper = new Swiper(".swiper", {
  slidesPerView: 7,
  spaceBetween: 2,
  centeredSlides: true,
  freeMode: true,
  grabCursor: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    400: {
      slidesPerView: 10,
    },
    800: {
      slidesPerView: 7,
    },
  },
});
