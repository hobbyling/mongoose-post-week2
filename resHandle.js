const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, DELETE, OPTIONS',
  'Content-Type': 'application/json'
}

exports.successHandle = function (res, data) {
  res.writeHead(200, headers)
  if (data) {
    res.write(JSON.stringify({
      "status": "success",
      "data": data
    }))
  }
  res.end()
}

exports.errorHandle = function (res, code, error) {
  const message = code === 400
    ? "欄位格式錯誤，或無此 todo id"
    : "無此網路路由"
  res.writeHead(400, headers)
  if (error) {
    // 取得自定義的錯誤提示
    let errorMessage = Object.values(error).map(item => item.message)
    res.write(JSON.stringify({
      "status": "false",
      "message": message,
      "error": errorMessage
    }))
  } else {
    res.write(JSON.stringify({
      "status": "false",
      "message": message
    }))
  }
  res.end()
}