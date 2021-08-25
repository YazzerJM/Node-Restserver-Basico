const { response, json } = require("express");
const { Categoria } = require('../models');

const obtenerCategorias = async( req, res = response ) => {

    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find(query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
            .populate('usuario')
    ]);

    // const total = await Categoria.countDocuments( query );
    // const categorias = await Categoria.find().skip( Number( desde ) ).limit( Number( limite ) ).populate('usuario');
    
    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async( req, res = response ) => {

    const id = req.params.id;

    const categoria = await Categoria.findById( id ).populate('usuario');

    if( !categoria.estado ){
        return res.status(400).json({
            msg: 'Esta categoria ha sido eliminada'
        });
    }

    res.json(categoria);
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// TODO: actualizarCategoria
const actualizarCategoria = async( req, res = response ) => {

    const id = req.params.id;
    const { ...resto } = req.body;
    
    const categoria = await Categoria.findByIdAndUpdate( id, resto );
    
    res.json({
        categoria
    });

} 

// TODO: borrarCategoria - estado:false
const borrarCategoria = async( req, res = response ) => {
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false } );

    res.json(categoria);
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}