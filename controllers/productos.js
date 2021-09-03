const { response, json } = require("express");
const { models } = require("mongoose");
const { Producto, Categoria } = require("../models");


const obtenerProductos = async( req, res = response ) => {

    const { desde = 0, hasta = 5 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .skip( Number(desde) )
            .limit( Number(hasta) )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async( req, res ) => {

    const id = req.params.id;

    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async( req, res ) => {

    const { estado, usuario, ...body } = req.body;

    const nombre = body.nombre.toUpperCase();
    const categoria = body.categoria.toUpperCase();
    const { precio, descripcion } = req.body;
    
    const productoDB = await Producto.findOne({ nombre });
    
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    const categoriaDB = await Categoria.findOne({ nombre: categoria });

    if( !categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoria }, no existe`
        });
    }


    const data = {
        nombre,
        precio,
        descripcion,
        categoria: categoriaDB._id,
        usuario: req.usuario._id,   
    }

    const producto = new Producto(data);

    await producto.save();

    res.json(producto);
}

const actualizarProducto = async( req, res ) => {
    
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;

    data.categoria = data.categoria.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre: data.categoria });
    
    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;
    data.categoria = categoriaDB._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json( producto );

}

const borrarProducto = async( req, res ) => {
    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );

    return res.json( producto );
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}