import $ from 'jquery';
import { setActiveNavLinks, activateSlideOnClick } from './slides';
import handleMobileMenu from './sidebar-mobile';

require('bootstrap');
window.jQuery = $; window.$ = $;

$(window).ready(() => {
  handleMobileMenu();
  setActiveNavLinks();
  activateSlideOnClick();

  const footer = $('.footers').outerHeight();
  $('body').css('paddingBottom', `${footer}px`);
});
