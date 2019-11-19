var express = require('express')
var router = express.Router()

var User = require('./../models/user')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

// 登录接口
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24
        })
        // res.session.user = doc
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName,
            userPwd: doc.userPwd
          }
        })
      }
    }
  })
})

// 登出接口
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    mag: '',
    result: ''
  })
})
module.exports = router
