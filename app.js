const express = require('express')
const app = express()
const path = require('path');
const doenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { json } = require('express');
const multer = require('multer');
//variables 
doenv.config({path: './env/.env'})

//middlewares
const storage = multer.diskStorage({
    // creamos un destino para las image
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        //fecha y todo los datos doriginales de la imagen
        cb(null, Date.now() + path.extname(file.originalname).toLocaleLowerCase());
    }
})

//middlewares
app.use(multer({
    //constante ya creada
    storage,
    // este es el destino de las image
    dest: path.join(__dirname, 'public/uploads'),
    // tamaño maximo de la image
    limits: {fileSize: 2 * 1024 * 1024},  // 2 MB
    //formato de la imagen
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        if (mimetype && extname) {
            return cb(null, true)
        }
        cb("Error: File must be an valid image")
    }
}).single('image'));

//establecemos que vamos a trabajar con este montor
app.set('view engine', 'ejs')
app.use(express.urlencoded({extends:false}));
app.use(express(json))
app.use(cookieParser())


// import the router
app.use('/', require('./routes/routers'));

//mide
//permite usar archivos static
app.use(express.static(path.join(__dirname, '/public')))


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('Server running in port:', PORT)
});