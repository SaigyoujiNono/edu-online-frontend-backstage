// 将base64的图片转换为file文件
export function convertBase64UrlToBlob(urlData) {
  const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  const temp = new Blob([ab])
  console.log('convertBase64UrlToBlob', temp)
  return blobToFile(temp)
}

export function blobToFile(blob) {
  return new File([blob], 'upload.jpg', { type: 'image/jpeg' })
}
