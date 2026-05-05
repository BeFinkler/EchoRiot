const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/playlistController');

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.getAll);
router.post('/:id/songs', auth, ctrl.addSong);
router.delete('/:id/songs/:songIndex', auth, ctrl.deleteSong);
router.delete('/:id', auth, ctrl.delete);
router.post('/:id/like', auth, ctrl.like);

module.exports = router;