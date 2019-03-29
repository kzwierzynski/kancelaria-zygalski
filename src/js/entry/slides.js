import $ from 'jquery';
import Swiper from 'swiper';

const linkClassStr = 'js-service';
const activeLinkClass = 'c-slide-nav__link--active';
const grayImgUrlArray = ['img/prawo-karne-gray.png', 'img/prawo-cywilne-gray.png', 'img/prawo-rodzinne-gray.png', 'img/prawo-gospodarcze-gray.png'];
const colorImgUrlArray = ['img/prawo-karne-color.png', 'img/prawo-cywilne-color.png', 'img/prawo-rodzinne-color.png', 'img/prawo-gospodarcze-color.png'];
const slideNavImgClass = '.c-slide-nav__icon-img';

const swiperServices = new Swiper('.swiper-services', {
  speed: 800,
  spaceBetween: 10,
  resistanceRatio: 0,
  scrollbar: {
    el: '.swiper-scrollbar'
  }
});

function activateSlide(linkClass, swiperVar) {
  $(`.${linkClass}`).each((_, link) => {
    const linkedSlideId = $(link).attr('data-slide');
    $(link).click(() => {
      swiperVar.slideTo(linkedSlideId);
    });
  });
}

export function activateSlideOnClick() {
  activateSlide(linkClassStr, swiperServices);
}

function setActiveNavLink(linkClass, swiperVar) {
  $(`.${linkClass}`).each((_, link) => {
    const linkedSlideId = parseInt($(link).attr('data-slide'), 10);
    const activeSlideId = parseInt(swiperVar.activeIndex, 10);
    if (linkedSlideId === activeSlideId) {
      const colorImgSrc = colorImgUrlArray[linkedSlideId];
      $(link).addClass(activeLinkClass);
      $(link).find(slideNavImgClass).attr('src', colorImgSrc);
    } else {
      const grayImgSrc = grayImgUrlArray[linkedSlideId];
      $(link).removeClass(activeLinkClass);
      $(link).find(slideNavImgClass).attr('src', grayImgSrc);
    }
  });
}

export function setActiveNavLinks() {
  setActiveNavLink(linkClassStr, swiperServices);

  swiperServices.on('slideChange', () => {
    setActiveNavLink(linkClassStr, swiperServices);
  });
}
