export function loadLazyImgs() {
  $('img').each((_, img) => {
    if ($(img).attr('data-src') && !$(img).attr('data-loaded')) {
      img.src = $(img).attr('data-src');
      $(img).attr('data-loaded', 'true');
    }
  });
}

export function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function footerPosition() {
  const footer = $('.footers').outerHeight();
  $('body').css('paddingBottom', `${footer}px`);
}
