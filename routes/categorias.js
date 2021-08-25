const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { existeCategoria, esRoleValido } = require('../helpers/db-validators');

const router = Router();

// Obtener todas la categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria );

// Crear categoria - privado con cualquier rol
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado con cualquier rol
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], actualizarCategoria );

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria );

module.exports = router;