# API de Vendas

API REST para gerenciamento de vendas usando Node.js, Express e MySQL.

O projeto foi refatorado para remover views, arquivos estaticos e persistencia NoSQL. Agora a aplicacao trabalha apenas como API, com autenticacao JWT e acesso ao banco relacional `loja`.

## Funcionalidades

- Rota publica de status da API.
- Login com usuario salvo no MySQL.
- CRUD de categorias.
- CRUD de produtos.
- CRUD de clientes.
- CRUD de pedidos/vendas.
- Protecao das rotas privadas com token JWT e `x-user-id`.
- Queries SQL com prepared statements usando `?`.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2/promise
- JWT
- dotenv
- helmet
- cors

## Como rodar

Instale as dependencias:

```bash
npm install
```

Configure o arquivo `.env` na raiz do projeto:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=loja
JWT_SECRET=123456
```

Importe o banco MySQL. O projeto possui um script base em:

```txt
database/loja.sql
```

Tambem pode ser usado o dump fornecido pelo professor, desde que ele tenha as tabelas `categorias`, `clientes`, `produtos`, `pedidos`, `produtos_pedidos` e `usuarios`.

Depois rode a API:

```bash
npm start
```

Ou em modo desenvolvimento:

```bash
npm run dev
```

A API roda por padrao em:

```txt
http://localhost:5000
```

## Rotas publicas

```http
GET /api/status
GET /api/versao
```

Resposta esperada:

```json
{
  "versao": "2.0.0",
  "status": "online"
}
```

## Login

```http
POST /api/auth/login
```

Body:

```json
{
  "nick": "candido",
  "senha": "123456"
}
```

Resposta:

```json
{
  "token": "token_jwt",
  "usuario": {
    "id_usuario": 1,
    "nome": "Candido Farias",
    "nick": "candido"
  }
}
```

## Rotas privadas

Todas as rotas de CRUD precisam dos headers:

```http
Authorization: Bearer SEU_TOKEN
x-user-id: 1
Content-Type: application/json
```

Se o token nao for enviado, a API retorna `401`.

Se o `x-user-id` nao for enviado ou nao bater com o ID do token, a API retorna `401` ou `403`.

## Categorias

```http
GET /api/categorias
GET /api/categorias/:id
POST /api/categorias
PUT /api/categorias/:id
DELETE /api/categorias/:id
```

Exemplo de criacao:

```json
{
  "nome": "Perifericos"
}
```

## Produtos

```http
GET /api/produtos
GET /api/produtos/:id
POST /api/produtos
PUT /api/produtos/:id
DELETE /api/produtos/:id
```

Exemplo de criacao:

```json
{
  "nome": "Mouse Gamer",
  "valor": 120.5,
  "estoque": 10,
  "id_categoria": 5
}
```

O `id_categoria` precisa existir na tabela `categorias`.

## Clientes

```http
GET /api/clientes
GET /api/clientes/:id
POST /api/clientes
PUT /api/clientes/:id
DELETE /api/clientes/:id
```

Exemplo de criacao:

```json
{
  "nome": "Cliente Teste",
  "telefone": "51999999999",
  "status": "bom"
}
```

Status aceitos:

```txt
bom, medio, ruim
```

## Pedidos

```http
GET /api/pedidos
GET /api/pedidos/:id
POST /api/pedidos
PUT /api/pedidos/:id
DELETE /api/pedidos/:id
```

Exemplo de criacao:

```json
{
  "data": "2026-07-01",
  "id_cliente": 1,
  "itens": [
    {
      "id_produto": 1,
      "quantidade": 1,
      "valor": 1259
    }
  ]
}
```

O `id_cliente` precisa existir na tabela `clientes`.

Cada `id_produto` precisa existir na tabela `produtos`.

## Estrutura

```txt
src/
  app.js
  config/
    database.js
  controllers/
    authController.js
    categoriaController.js
    produtoController.js
    clienteController.js
    pedidoController.js
  middlewares/
    authMiddleware.js
  models/
    usuarioModel.js
    categoriaModel.js
    produtoModel.js
    clienteModel.js
    pedidoModel.js
  routes/
    apiRoutes.js
    authRoutes.js
    categoriaRoutes.js
    produtosRoutes.js
    clientesRoutes.js
    pedidosRoutes.js
database/
  loja.sql
```

## Sequencia sugerida para demonstracao

1. `GET /api/status`
2. `GET /api/categorias` sem token para mostrar bloqueio `401`
3. `POST /api/auth/login`
4. `GET /api/categorias` com `Authorization` e `x-user-id`
5. `POST /api/categorias` para criar uma categoria
6. Conferir no MySQL:

```sql
USE loja;
SELECT * FROM categorias;
```
