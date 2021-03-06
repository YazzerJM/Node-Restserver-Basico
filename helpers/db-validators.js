
const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(role = '') => {
    const existeRole = await Role.findOne({ role });
    if( !existeRole ){
        throw new Error(`El rol ${ role } no esta registrado en la base de datos`);
    }
}

const existeEmail = async( correo = '') => {
    const existe = await Usuario.findOne({ correo });

    if( existe ){
        throw new Error(`El correo ${ correo } ya se encuentra registrado`);
    }
}

const existeID = async( id = '') => {
    const existe = await Usuario.findById(id);

    if( !existe ){
        throw new Error(`El ID ${ id } no se encuentra en la base de datos`);
    }
}

const existeCategoria = async( id = '' ) => {
    const categoria = await Categoria.findById( id );

    if( !categoria ){
        throw new Error(`El ID ${ id } de la categoria no se encuentra en la base de datos`);
    }
}

const existeProducto = async( id = '') => {
    const producto = await Producto.findById( id );

    if( !producto ){
        throw new Error(`El ID ${ id } del producto no se encuentra en la base de datos`);
    }
}

const coleccionesPermitidas = async( coleccion = '', colecciones = []) => {
    
    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeID,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}