const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos } = require("../middlewares");
const { existeProducto, existeCategoria } = require("../helpers/db-validators");
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto );

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio'),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto );

router.put('/:id', [
    validarJWT,
    // check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto );

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto );

module.exports = router;