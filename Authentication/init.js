var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

const user = {
  username: 'my-test-user',
  password: 'my-user-password',
  id: 1
}

function initPassport(app) {
  app.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
    }
  );

  app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  passport.use(new LocalStrategy(
    function (username, password, done) {

      if (user.username === username && user.password === password) {
        return done(null, user);
      }

      return done(null, false);
      // findUser(username, function (err, user) {
      //   if (err) {
      //     return done(err)
      //   }
      //   if (!user) {
      //     return done(null, false)
      //   }
      //   if (password !== user.password  ) {
      //     return done(null, false)
      //   }
      //   return done(null, user)
      // })
    }
  ));

  // passport.authenticationMiddleware = authenticationMiddleware;
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = initPassport;