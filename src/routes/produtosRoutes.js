const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController');

router.use(auth);

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.remover);

module.exports = router;
