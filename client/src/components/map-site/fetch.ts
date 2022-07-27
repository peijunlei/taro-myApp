import Taro from "@tarojs/taro";


interface RequestProps {
  url: string;
  method: "GET" | "POST",
  params: any
}
const serverKey = "d44a341bc63aee604518e1d2c15a6255"

export default function request(req: RequestProps) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: req.url,
      data: { ...req.params, key: serverKey },
      method: req.method,
      header: { "content-type": "application/json" },
      success: (data) => {
        return resolve(data.data ? data.data : data)
      },
      fail: (err) => reject(err),
    })
  })
}