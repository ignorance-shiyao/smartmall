var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

// 链接 mongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_smartmall')
mongoose.connection.on('connected', () => {
  console.log('MongoDB connect success.')
})
mongoose.connection.on('error', () => {
  console.log('MongoDB connect fail.')
})
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connect disconnected.')
})
/* GET goods page. */
router.get('/', (req, res, next) => {
  // res.render('index', {title: 'Express'})
  // res.send('hello,goods list.')
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize

  let params = {}
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec({}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

module.exports = router
