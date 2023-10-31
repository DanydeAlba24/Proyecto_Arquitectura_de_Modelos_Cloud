const express = require('express');
const { engine } = require('express-handlebars');
const cors = require('cors');
const mysql = require ('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');
const app = express();
const myconnection = require('express-myconnection');

app.use(myconnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'recursos_humanos2'
}));

app.set('port', 4000);

app.set('views', __dirname + '/views');
app.engine('.html', engine ({
    extname: '.html',
}))

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.listen(app.get('port'), () => {
    console.log('El servidor está corriendo', app.get('port'));
});

app.use('/', loginRoutes);

app.get('/', (req, res) =>{
    if(req.session.loggedin == true){
        res.render('home', {name: req.session.name});
    }else{
        res.redirect('/login')
    }
    
})

