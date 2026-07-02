const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const categoriaController = require('../controllers/categoriaController');

router.use(auth);

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);
router.post('/', categoriaController.criar);
router.put('/:id', categoriaController.atualizar);
router.delete('/:id', categoriaController.remover);

module.exports = router;
