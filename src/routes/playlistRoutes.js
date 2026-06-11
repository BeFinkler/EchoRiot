const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/playlistController');

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Cria uma nova playlist
 *     description: Cria uma nova playlist para o usuário autenticado
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Minha Playlist Rock
 *               description:
 *                 type: string
 *                 example: As melhores músicas de rock
 *     responses:
 *       201:
 *         description: Playlist criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 owner:
 *                   type: string
 *                 songs:
 *                   type: array
 *                 likes:
 *                   type: array
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post('/', auth, ctrl.create);

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Lista todas as playlists do usuário
 *     description: Retorna todas as playlists criadas pelo usuário autenticado
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de playlists recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   owner:
 *                     type: string
 *                   songs:
 *                     type: array
 *                   likes:
 *                     type: array
 *       401:
 *         description: Não autenticado
 */
router.get('/', auth, ctrl.getAll);

/**
 * @swagger
 * /api/playlists/{id}:
 *   put:
 *     summary: Atualiza uma playlist
 *     description: Atualiza os dados de uma playlist específica
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Playlist Atualizada
 *               description:
 *                 type: string
 *                 example: Descrição atualizada
 *     responses:
 *       200:
 *         description: Playlist atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Playlist não encontrada
 */
router.put('/:id', auth, ctrl.update);

/**
 * @swagger
 * /api/playlists/stats:
 *   get:
 *     summary: Obtém estatísticas das playlists
 *     description: Retorna estatísticas gerais das playlists do usuário
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPlaylists:
 *                   type: integer
 *                 totalSongs:
 *                   type: integer
 *                 totalLikes:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */
router.get('/stats', auth, ctrl.getStats);

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   post:
 *     summary: Adiciona uma música à playlist
 *     description: Adiciona uma nova música à playlist especificada
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *                 example: Stairway to Heaven
 *               artist:
 *                 type: string
 *                 example: Led Zeppelin
 *               album:
 *                 type: string
 *                 example: Led Zeppelin IV
 *               duration:
 *                 type: integer
 *                 example: 482
 *     responses:
 *       201:
 *         description: Música adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Playlist não encontrada
 */
router.post('/:id/songs', auth, ctrl.addSong);

/**
 * @swagger
 * /api/playlists/{id}/songs/{songIndex}:
 *   delete:
 *     summary: Remove uma música da playlist
 *     description: Remove uma música específica da playlist
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *       - in: path
 *         name: songIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice da música na playlist
 *     responses:
 *       200:
 *         description: Música removida com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Playlist ou música não encontrada
 */
router.delete('/:id/songs/:songIndex', auth, ctrl.deleteSong);

/**
 * @swagger
 * /api/playlists/{id}:
 *   delete:
 *     summary: Deleta uma playlist
 *     description: Remove uma playlist específica
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     responses:
 *       200:
 *         description: Playlist deletada com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Playlist não encontrada
 */
router.delete('/:id', auth, ctrl.delete);

/**
 * @swagger
 * /api/playlists/{id}/like:
 *   post:
 *     summary: Adiciona um like à playlist
 *     description: Incrementa o número de likes da playlist
 *     tags:
 *       - Playlists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da playlist
 *     responses:
 *       200:
 *         description: Like adicionado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Playlist não encontrada
 */
router.post('/:id/like', auth, ctrl.like);

module.exports = router;