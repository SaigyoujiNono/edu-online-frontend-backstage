/**
 * Created by PanJiaChen on 16/11/18.
 */
import { Message } from 'element-ui'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 检验文件类型是否符合要求
 * @param file
 * @returns {boolean}
 */
export function verifyImgType(file) {
  const isImg = file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/jpeg'
  if (!isImg) {
    Message({
      type: 'error',
      message: '只能上传png/jpg/bmp格式的图片'
    })
    return false
  }
  return true
}

/**
 * 检验文件大小是否符合要求
 * @param file
 * @returns {boolean}
 */
export function verifyImgSize(file) {
  return file.size < 1024 * 1024 * 5
}
