const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require ('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recursos_humanos2'
})

conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conectada la base de datos correctamente");
    }
})

function login(req, res, next){
    if(req.session.loggedin != true){
        res.render('login/index');
    }else{
        res.redirect('/');
    }
}

function auth(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                userdata.forEach(element => {
                bcrypt.compare(data.password, element.password, (err, isMatch) => {
                    if(!isMatch){
                        res.render('login/index', {error: 'Error: ¡Contraseña incorrecta!'});
                    }else{
                        req.session.loggedin = true;
                        req.session.name = element.name;
                        res.redirect('/');
                    }    
                    });
                })
            }else{
                res.render('login/index', {error: '¡Error: Este usuario no existe!'})
            } 
        });
    });
}

function register(req, res, next){
    if(req.session.loggedin != true){
        res.render('login/register');
    }else{
        res.redirect('/');
    }
}

function storeUser(req, res, next){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if(userdata.length > 0){
                res.render('login/register', {error: 'Error: ¡El E-mail ya se encuentra en uso!'})
            } else {
                bcrypt.hash(data.password, 12).then(hash =>{
                data.password= hash;

                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO users SET ?', [data], (err, rows) => {
                        res.redirect('/');
                            });
                        });
                    });
                }
            });
        });
    }

function logout(req, res){
    if(req.session.loggedin == true){
        req.session.destroy();
    }else{
        res.redirect('/login');
    }
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout
}