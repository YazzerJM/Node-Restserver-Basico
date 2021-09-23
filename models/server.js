
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {


    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.authPath = '/api/auth';
        this.usuariosPath = '/api/usuarios';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.buscarPath = '/api/buscar';
        this.uploads = '/api/uploads';

        // conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();
        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio public
        this.app.use( express.static('public') );

        // FileUpload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }) );
    }

    routes(){
        this.app.use( this.authPath, require('../routes/auth') );
        this.app.use( this.usuariosPath, require('../routes/usuarios') );
        this.app.use( this.categoriasPath, require('../routes/categorias') );
        this.app.use( this.productosPath, require('../routes/productos') );
        this.app.use( this.buscarPath, require('../routes/buscar') );
        this.app.use( this.uploads, require('../routes/uploads') );
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;