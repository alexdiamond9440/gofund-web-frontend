export const Base_url = process.env.REACT_APP_BASE_URL;

export const Backend_url = process.env.REACT_APP_BACKEND_URL;

export const frontUrl = process.env.REACT_APP_FRONTEND_URL;

export const fbShareURL = process.env.REACT_APP_SOCIAL_SHARE_URL;

export const fbAppId = process.env.REACT_APP_FACEBOOK_ID;

// eslint-disable-next-line
export const twitterUrl = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
export const regForUrl = /^(ftp|http|https|www):\/\/[^ "]+$/;
// eslint-disable-next-line
export const facebookUrl = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
export const instaUrl =
  /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_]+)/im;
// eslint-disable-next-line
export const youtubeUrl =
  /((http|https):\/\/|)(www\.|)youtube\.com\/(channel\/|user\/)[a-zA-Z0-9\-]{1,}/;
export const linkedinUrl = /http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?/g;

// eslint-disable-next-line
export const tiktokUrl = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;

export const testprofileUrl = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
// eslint-disable-next-line
export const youtubeLinkUrl =
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

export const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*$/;
export const removeImgTagRegex = /(<([^>]+)>)/gi;
export const imageRegex = '/<img[^>]*>/g';
export const facebookBaseUrl = 'https://www.facebook.com/';
export const twitterBaseUrl = 'https://twitter.com/';
export const tiktokBaseUrl = 'https://tiktok.com/';
export const linkedinBaseUrl = 'https://www.linkedin.com/in/';
export const instagramBaseUrl = 'https://www.instagram.com/';
export const youtubeUserBaseUrl = 'https://www.youtube.com/channel/';
export const youtubeVideoBaseUrl = 'https://www.youtube.com/';
export const whatsappBaseUrl = `https://wa.me/`;
export const twitchBaseUrl = 'https://www.twitch.tv/';
export const instaFeedUserName = '_gofundher';
export const INPUT_DATE_FROMAT = 'MM-DD-YY';
export const DATE_FORMAT = 'YYYY-MM-DD';
