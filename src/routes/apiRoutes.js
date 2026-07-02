const router = require('express').Router();

const status = (req, res) => {
  res.json({
    versao: '2.0.0',
    status: 'online',
  });
};

router.get('/status', status);
router.get('/versao', status);

module.exports = router;
