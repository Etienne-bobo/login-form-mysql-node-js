const localStrategy = require('passport-local').Strategy;

const mysql = require('mysql')
const bcrypt = require('bcrypt')
const dbConfig = require('./database')
const connection = mysql.createConnection(dbConfig.connection)

connection.query('USE' + dbConfig.database)

module.exports = function (passport) {
    passport.serializeUser(function(user,done){
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done){
        connection.query('SELECT * FROM users WHERE id = ?',[id],
        function(err,rows){
            done(err,rows[0])
        })
        
    })

    passport.use(
        'local-signup',
        new localStrategy({
            
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },function(req,username,password,done){
            connection.query('SELECT * FROM users WHERE username = ? ',
            [username],
            function(err,rows){
               if(err){
                   return done(err)
               }
               if(rows.length){
                   return done(null,false,req.flash(('signupMessage','That is already taken')))
               }else{
                   var newUserMysql = {
                       username : username,
                       password : bcrypt.hashSync(password,null,null)
                   }

                   var insertQuery = 'INSERT INTO users  (username,password) values (?,?)'
                   connection.query(insertQuery,[newUserMysql.username,newUserMysql.password],
                   function(err,rows){
                       newUserMysql.id = rows.insertId
                       return done(null,newUserMysql)
                   })

               }
            })
        })

        
        
    )

    passport.use(
        'local-lopgin',
        new localStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },function(req,username,password,done){
            connection.query('SELECT * FROM users WHERE username = ?',[username],
            function(err,rows){
                if(err){
                    return done(err)
                }
                if(!rows.length){
                    return done(null ,false,req.flash('loginMessage','No user found'))
                }
                if(!bcrypt.compareSync(password,rows[0].password))
                    return done(null,false,req.flash('loginMesaage','Wrong password'))
                    return done(null,rows[0])
                

            })
        })
        
    )
}