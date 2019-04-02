import $ from 'jquery';
import { debounce, footerPosition } from './utils';
import { setActiveNavLinks, activateSlideOnClick } from './slides';
import handleMobileMenu from './sidebar-mobile';

require('bootstrap');
window.jQuery = $; window.$ = $;

$(window).ready(() => {
  handleMobileMenu();
  footerPosition();
  setActiveNavLinks();
  activateSlideOnClick();

  $(window).on('resize', debounce(() => {
    footerPosition();
  }));
});
