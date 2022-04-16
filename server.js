const http = require('http')
const mongoose = require('mongoose')
const resHandle = require('./resHandle')
const Post = require('./models/post')
const dotenv = require('dotenv')

dotenv.config({ path: "./config.env" })
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
// 連接資料庫
mongoose.connect(DB)
  .then(() => {
    console.log('連線成功')
  })
  .catch((error) => {
    console.log(error)
  });

const requestListener = async (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find()
    resHandle.successHandle(res, posts)
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newPost = await Post.create({ ...data })
        resHandle.successHandle(res, newPost)
      } catch (error) {
        resHandle.errorHandle(res, 400, error.errors)
      }
    })
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    await Post.deleteMany({})
    resHandle.successHandle(res, [])
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    // 取得欲刪除資料的 ID
    const id = req.url.split('/').pop()
    await Post.findByIdAndDelete(id)

    // 列出剩下的資料
    const posts = await Post.find()
    resHandle.successHandle(res, posts)
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        // 取得欲修改資料的 ID
        const id = req.url.split('/').pop()

        // 取得欲修改的內容
        const data = JSON.parse(body)
        await Post.findByIdAndUpdate(id, { ...data })


        const post = await Post.findOne({ "_id": id })

        resHandle.successHandle(res, post)

      } catch (error) {
        resHandle.errorHandle(res, 400, error.errors)
      }
    })
  } else if (req.method === 'OPTIONS') {
    resHandle.successHandle(res)
  } else {
    resHandle.errorHandle(res, 404)
  }
}

const server = http.createServer(requestListener);

server.listen(process.env.PORT)