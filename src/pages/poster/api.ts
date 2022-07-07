
const qrcode = 'https://qrimg.jd.com/https%3A%2F%2Fitem.m.jd.com%2Fproduct%2F1233203.html%3Fpc_source%3Dpc_productDetail_1233203-118-1-4-2.png'


export function fetchQrcode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(qrcode)
    }, 2000)
  })
}
