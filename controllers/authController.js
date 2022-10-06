const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const nodemailer = require('nodemailer');
//proceso para registrar

exports.regsiter = async (req, res) =>{
  try{
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
   let passHash = await bcryptjs.hash(pass, 10)
   conexion.query('INSERT INTO usarios SET ?', {name: name, email: email, pass: passHash}, (error, results) =>{
    if(error){
        res.render('register', {
            alert: true,
            alertMessage: 'este email ya existe'
        })
    }else{       
           
                //creamos el cuerpo del email
                contentHTML = `
                    <h1>User Information</h1>
                    <ul>
                        <li>Username: ${name} </li>
                        <li>User Email: ${email} </li>
                    </ul>
                `;
                //set email configuration, sender and server
                //
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'danielaldana212@gmail.com',
                        pass: 'npqvekyzzpfgtyvy'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                //send email                
                const info =  transporter.sendMail({
                    from: "'Daniel aldana' <danielaldana212@gmail.com>",
                    to: email,
                    subject: 'Website contact form',
                    html: contentHTML
                });
      res.redirect('/');
      
    }
   })
  }catch(error){
    console.error(error);
  }

}

//procedure to login
exports.login = async (req, res)=>{
    try {
        const email = req.body.email
        const pass = req.body.pass        
        //verificar si no vienen estos campos
        if(!email || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Warning",
                alertMessage: "Enter your email and password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM usarios WHERE email = ?', [email], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    //parametros para una alert
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Email or Password invalid",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false, 
                        ruta: 'login'    
                    })
                }else{
                    //login OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_EXPIRATION_TIME
                    })
                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                            alert: true,
                            alertTitle: "Successful connection",
                            alertMessage: "¡CORRECT LOGIN!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

//procedure to authenticate
exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usarios WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}

                row = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
} 

//proceso para el logout
exports.logout = (req, res) =>{
    res.clearCookie('jwt')
    return res.redirect('/login');
}