const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token nao fornecido' });
  }

  if (!userIdHeader) {
    return res.status(401).json({ msg: 'ID do usuario nao fornecido' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id_usuario || String(decoded.id_usuario) !== String(userIdHeader)) {
      return res.status(403).json({ msg: 'ID do usuario nao confere com o token' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalido' });
  }
};
