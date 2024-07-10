import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
// mock语法参考：http://mockjs.com/examples.html
export default [
  {
    url: '/api/getUserInfo', // 注意，这里只能是string格式
    method: 'get',
    response: (res) => {
      console.log(res)
      return {
        code: 1,
        data: {
          text: Mock.mock({
            "string|1-10": "★"
          }),
          id: res.query.id
        }
      }
    }
  },
] as MockMethod[] // 这里其实就是定义数据格式的，不了解的同学可以参考typescript的官方文档
