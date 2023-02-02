const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  console.log(pixelCrop,"croppedAreaPixels")
  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))


  canvas.width = safeArea
  canvas.height = safeArea


  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
  )
  const data = ctx.getImageData(0, 0, safeArea, safeArea)


  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height


  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  )


  return canvas.toDataURL({ fillColor: "#fff" }, "image/jpeg", 1);

}

//return canvas.toDataURL({ fillColor: "#fff" }, "image/jpeg", 1);

export function dataURItoBlob(dataurl, filename) {
  var arr = dataurl.split(","),
    mime,
    bstr,
    n,
    u8arr;
  if (arr[0]) {
    let mimeTemp = arr[0].match(/:(.*?);/);
    if (mimeTemp && mimeTemp[1]) {
      mime = mimeTemp[1];
    }
  }
  if (arr[1]) {
    bstr = atob(arr[1]);
    n = bstr.length;
    u8arr = new Uint8Array(n);
  }
  if (mime && bstr && n && u8arr) {
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  return false;
}