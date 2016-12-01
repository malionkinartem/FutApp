function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.params[0] === '/login' || req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

module.exports = authenticationMiddleware;