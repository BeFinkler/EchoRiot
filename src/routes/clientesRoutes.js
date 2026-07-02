const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const clienteController = require('../controllers/clienteController');

router.use(auth);

router.get('/', clienteController.listar);
router.get('/:id', clienteController.buscarPorId);
router.post('/', clienteController.criar);
router.put('/:id', clienteController.atualizar);
router.delete('/:id', clienteController.remover);

module.exports = router;
