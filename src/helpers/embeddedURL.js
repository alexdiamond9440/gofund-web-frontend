export const generateEmbeddedUrl = (youtubeVideoLink) => {
  let splitYoutubeURL;
  
  // split url by watch
  if (youtubeVideoLink && youtubeVideoLink.toLowerCase().includes('watch?v=')) {
    splitYoutubeURL = youtubeVideoLink ? youtubeVideoLink.split('v=') : null;
    splitYoutubeURL =
      splitYoutubeURL && splitYoutubeURL.length ? splitYoutubeURL[1] : null;
  }
  // split url by embed
  else if (youtubeVideoLink && youtubeVideoLink.includes('embed/')) {
    splitYoutubeURL = youtubeVideoLink
      ? youtubeVideoLink.split('embed/')
      : null;
    splitYoutubeURL =
      splitYoutubeURL && splitYoutubeURL.length ? splitYoutubeURL[1] : null;
  }
  // split url by youtu.be
  else if (youtubeVideoLink && youtubeVideoLink.includes('youtu.be')) {
    splitYoutubeURL = youtubeVideoLink
      ? youtubeVideoLink.split('youtu.be/')
      : null;
    splitYoutubeURL =
      splitYoutubeURL && splitYoutubeURL.length ? splitYoutubeURL[1] : null;
  } else {
    splitYoutubeURL = youtubeVideoLink;
  }
  return splitYoutubeURL;
};
