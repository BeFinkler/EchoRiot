const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const pedidoController = require('../controllers/pedidoController');

router.use(auth);

router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.buscarPorId);
router.post('/', pedidoController.criar);
router.put('/:id', pedidoController.atualizar);
router.delete('/:id', pedidoController.remover);

module.exports = router;
