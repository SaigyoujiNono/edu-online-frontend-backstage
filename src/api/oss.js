import { verifyImgSize } from '@/utils/validate'
import request from '@/utils/request'

// 上传图片
export function uploadImg(file, action) {
  return new Promise((resolve, reject) => {
    if (!verifyImgSize(file)) {
      reject('图片大于5MB，请重新裁剪！')
    }
    const param = new FormData()
    param.append('file', file)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    request.post(action, param, config).then(res => {
      resolve(res)
    })
  })
}
