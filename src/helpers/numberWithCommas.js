export const numberWithCommas = (x) => {
  return String(x).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ',');
};
