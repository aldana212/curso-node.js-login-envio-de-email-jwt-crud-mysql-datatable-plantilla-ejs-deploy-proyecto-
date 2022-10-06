const { Router } = require('express');
const conexion = require('../database/db');

//proceso para guardar

exports.saveUser = (req, res) =>{
    const email = req.body.email;
    const name = req.body.name;
    const rol = req.body.rol;

    // console.log(email + "-" + name + "-" +rol);
    conexion.query('INSERT INTO usarios SET ?', {email:email, name:name, rol:rol}, (err, results) =>{
        if(err){
            console.error(err)
        }else{
            res.redirect('/');
        }       
    });
}

//proceso para actualizar
exports.updateUser = (req, res) =>{
    const id  = req.body.id
    const name = req.body.name
    const email = req.body.email
    const rol = req.body.rol

    conexion.query('UPDATE usarios SET ? WHERE id = ?', [{ name:name, email:email, rol:rol}, id], (err, results) =>{
        if(err){
            console.error(err)
        }else{
            res.redirect('/');
        }       
    })
}