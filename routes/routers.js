const express = require('express')
const router = express.Router()
//invocar el metodo
const usersControllers = require('../controllers/userController');
const authControllers = require('../controllers/authController');

const { json } = require('express')
//Invoke the database connection
const conexion = require('../database/db')

router.get('/users',authControllers.isAuthenticated, (req, res) => {
    // res.send('hola mundo')
    conexion.query('SELECT * FROM usarios', (error, results) => {
        if(error){
            throw error;
        } else {
            if(row.rol == 'Admin'){
                res.render('users', { results: results, titleWeb: "List Users"})
            }else{
                res.render('index', { userName: row.name, image:row.image, titleWeb: "control Dashboard"})        
            }
        }
    })
})

router.get('/createUser', authControllers.isAuthenticated, (req, res) =>{
    if(row.rol == "Admin"){
        res.render('createUser', {titleWeb: "Create Users"})
    }else{
        res.render('index', { userName: row.name, image:row.image, titleWeb: "control Dashboard"})
    }
})

router.get('/editUser/:id',authControllers.isAuthenticated,(req, res) =>{
    const id = req.params.id;
    conexion.query('SELECT * FROM usarios WHERE id = ?', [id] ,(error, results) =>{
        if(error){
            throw error;
        } else {
            if(row.rol == 'Admin'){
                res.render('editUser', {user: results[0], titleWeb: "Edit Users"})
            }else{
                res.render('index', { userName: row.name, image:row.image, titleWeb: "control Dashboard"})
            }
            
        }
    })
});

router.post('/saveUser', usersControllers.saveUser);
router.post('/updateUser', usersControllers.updateUser);

router.get('/deleteUser/:id', (req, res) => {
    const id = req.params.id
    conexion.query('DELETE FROM usarios WHERE id= ?', [id], (error, results) => {
        if(error){
            throw error;
        } else {
                res.redirect('/users')
        }
    })
});

router.get('/', authControllers.isAuthenticated, (req, res) =>{
    res.render('index', { userName: row.name, image:row.image, titleWeb: "control Dashboard"})
})

router.get('/logout', authControllers.logout)


router.get('/login', (req, res) =>{
    res.render('login',{ alert: false })
})

router.get('/register', (req, res) =>{
    res.render('register', { alert: false })
})

router.post('/register', authControllers.regsiter);
router.post('/login', authControllers.login);

router.post('/upload/:id', (req, res) => {
    const id = req.params.id
    const image = req.file.filename

    conexion.query('UPDATE usarios SET ? WHERE id= ?', [{image:image}, id], (error, results) => {
        if(error){
            console.error(error);
        } else {
            res.redirect('/users')
        }
    })
})

module.exports = router;