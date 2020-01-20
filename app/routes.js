module.exports = function(app,passport){
    app.get('/', (req, res) => {
      res.render('index.ejs')
    })

    app.get('/login',(req,res)=>{
        res.render('login.ejs',{message:req.flash('loginMessage')})
    })

    app.post('/login',passport.authenticate('local-login',{
        successRedirect : '/profile',
        failureRedirect :'/login',
        failureFlash :true
    }),
    function(req,res){
        if(req.body.remenber){
            req.session.cookie.maxAge = 1000 * 60 * 3;
        }else{
            req.session.cookie.expires =false
        }
        res.redirect('/')
    }
    )


    app.get('/signup',(req,res)=>{
        res.render('signup.ejs',{message:req.flash('signupMessage')})
    })

    app.post('/signup', passport.authenticate('local-signup',{
        successRedirect : '/profile',
        failureRedirect :'/signup',
        failureFlash :true
    }))

    app.get('/profile',isLoggedIn, (req, res) => {
        res.render('profile.ejs')
        user:req.user
      })

      app.get('/logout', (req, res) => {
        res.render('logout.ejs')
        req.logout();
        res.redirect();
      })
  

}

function isLoggedIn(req,res,next){
    if(req.isAuthenticate())
        return next()

        res.redirect('/')
}