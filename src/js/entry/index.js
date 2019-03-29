import $ from 'jquery';
import { debounce, loadLazyImgs, footerPosition } from './utils';
import handleMobileMenu from './sidebar-mobile';

// require('css/index.css');
window.jQuery = $; window.$ = $;
require('bootstrap');

function setBannerHeight() {
  const windowHeight = window.innerHeight;
  const windowWidth = $('.container-fluid').innerWidth();
  const heroHeight = $('.c-banner__hero').outerHeight();
  const bannerHeightMin = heroHeight * 1.4 + 80 < 568 ? 568 : heroHeight * 1.4 + 80;
  const bannerHeightMax = 4000;
  let bannerHeight;

  if (windowHeight < 0.5 * windowWidth) {
    bannerHeight = 0.5 * windowWidth;
  } else if (windowHeight > 2 * windowWidth) {
    bannerHeight = 2 * windowWidth;
  } else {
    bannerHeight = windowHeight;
  }

  if (bannerHeight > bannerHeightMax) {
    bannerHeight = bannerHeightMax;
  } else if (bannerHeight < bannerHeightMin) {
    bannerHeight = bannerHeightMin;
  }

  $('.c-banner').css('height', bannerHeight);
  return bannerHeight;
}

function resetInitialStyling() {
  const hero = $('.l-banner__hero');
  hero.css('top', 'auto');
}

function setupBanner() {
  resetInitialStyling();
  setBannerHeight();
}

function setupContainerFluid() {
  const bodyHeight = window.innerHeight;
  const bodyPaddingTop = parseInt($('body').css('padding-top'), 10)
  const bodyPaddingBottom = parseInt($('body').css('padding-bottom'), 10);
  const bodyInnerHeight = bodyHeight - bodyPaddingTop - bodyPaddingBottom;
  $('.c-banner__filter').css('height', `${bodyInnerHeight}px`);
}

$(window).ready(() => {
  handleMobileMenu();
  footerPosition();
  setupContainerFluid();
  // setupBanner();
  loadLazyImgs();

  $(window).on('resize', debounce(() => {
    footerPosition();
    setupContainerFluid();
    // setupBanner();
  }));

});