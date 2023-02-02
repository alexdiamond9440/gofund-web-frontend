export const scrollToTop = () => {
  const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  if (supportsNativeSmoothScroll) {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo(0, 0);
  }
};
