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
  let priceLevel = req.param('priceLevel')
  let sort = req.param('sort')
  let skip = (page - 1) * pageSize
  let priceGt = 0
  let priceLte = 5000
  let params = {}
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte = 100
        break
      case '1':
        priceGt = 100
        priceLte = 500
        break
      case '2':
        priceGt = 500
        priceLte = 1000
        break
      case '3':
        priceGt = 1000
        priceLte = 2000
        break
      case '4':
        priceGt = 2000
        priceLte = 5000
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  // 查询商品列表数据
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
// 加入到购物车
router.post('/addCart', function (req, res, next) {
  let userId = '100000077'
  let productId = req.body.productId
  let User = require('../models/user')
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log('userDoc:' + userDoc)
      if (userDoc) {
        var goodsItem = ''
        userDoc.cartList.forEach(function (item) {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum++
          }
        })
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (doc) {
                userDoc.cartList.push({
                  'productId': doc.productId,
                  'productName': doc.productName,
                  'salePrice': doc.salePrice,
                  'productImage': doc.productImage,
                  'productNum': 1,
                  'checked': 1
                })
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err2.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
