
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { esRoleValido, existeEmail, existeID } = require('../helpers/db-validators');

const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeID ),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener mas de 6 caracteres').isLength({ min: 6 }),
    check('correo').isEmail(),
    check('correo', 'Ingrese un correo valido').custom( existeEmail ),
    // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeID ),
    validarCampos
], usuariosDelete );



module.exports = router;