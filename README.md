# EchoRiot

EchoRiot é uma aplicação web de gerenciamento de playlists musicais com autenticação de usuário. O projeto usa Node.js, Express, MongoDB e EJS para renderização do frontend.

## 🌟 Funcionalidades

- Cadastro e login de usuário com autenticação JWT
- Criação de playlists com nome e descrição
- Adição e remoção de músicas em playlists
- Edição de nome e descrição das playlists
- Busca e ordenação de playlists
- Painel de estatísticas de playlists e músicas
- Interface responsiva com Bootstrap 5

## 🧰 Stack

- Node.js
- Express
- MongoDB / Mongoose
- EJS
- Bootstrap 5
- JWT
- bcrypt
- dotenv

## 🚀 Pré-requisitos

Antes de rodar o projeto, instale:

- Node.js 18+ ou superior
- npm (vem com Node.js)
- MongoDB local ou MongoDB Atlas

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/EchoRiot.git
cd EchoRiot
```

2. Instale dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/echoriot
JWT_SECRET=SUA_CHAVE_SECRETA
```

> Se usar MongoDB Atlas, substitua `MONGO_URI` pela URL fornecida pelo Atlas.

## 🗄️ Configurando o MongoDB

### Opção 1: MongoDB local

- Garanta que o serviço do MongoDB esteja rodando.
- Use o endereço padrão:

```env
MONGO_URI=mongodb://localhost:27017/echoriot
```

### Opção 2: MongoDB Atlas

- Crie uma conta em https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Crie um database user com permissão de leitura e escrita
- Copie a string de conexão e substitua no `.env`

Exemplo:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/echoriot?retryWrites=true&w=majority
```

## ▶️ Executando a aplicação

### Modo de desenvolvimento

```bash
npm run dev
```

### Modo de produção

```bash
npm start
```

O servidor rodará em `http://localhost:5000` por padrão.

## 📁 Estrutura do projeto

```
src/
  app.js
  config/
    db.js
  controllers/
    authController.js
    playlistController.js
  middlewares/
    authMiddleware.js
  models/
    Playlist.js
    User.js
  public/
    css/
      style.css
    js/
      main.js
  routes/
    authRoutes.js
    playlistRoutes.js
  views/
    index.ejs
    login.ejs
    register.ejs
package.json
README.md
```

## 🧪 Testando a aplicação

1. Abra o browser em `http://localhost:5000`
2. Crie uma conta ou faça login
3. Crie playlists, adicione músicas e use a busca

## 🌐 Rotas principais

- `GET /` — página principal com playlists
- `GET /login` — tela de login
- `GET /register` — tela de cadastro
- `POST /api/auth/register` — cadastrar usuário
- `POST /api/auth/login` — autenticar usuário
- `GET /api/playlists` — listar playlists do usuário
- `POST /api/playlists` — criar playlist
- `PUT /api/playlists/:id` — editar playlist
- `DELETE /api/playlists/:id` — deletar playlist
- `POST /api/playlists/:id/songs` — adicionar música
- `DELETE /api/playlists/:id/songs/:songIndex` — remover música
- `GET /api/playlists/stats` — estatísticas de playlists

## 💡 Dicas

- Use nomes claros para as playlists e músicas
- Atualize o navegador ao criar novas playlists, se não aparecer imediatamente
- Verifique se o token JWT está salvo no `localStorage` para acessar as rotas protegidas
