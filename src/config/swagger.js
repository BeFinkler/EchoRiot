const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'EchoRiot API',
    version: '2.0.0',
    description:
      'Documentacao interativa da API REST de vendas EchoRiot, com autenticacao JWT e CRUDs de categorias, produtos, clientes e pedidos.',
    contact: {
      name: 'Equipe EchoRiot',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor local padrao',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor local alternativo',
    },
  ],
  tags: [
    { name: 'Status', description: 'Monitoramento basico da API' },
    { name: 'Autenticacao', description: 'Cadastro e login de usuarios' },
    { name: 'Categorias', description: 'CRUD de categorias de produtos' },
    { name: 'Produtos', description: 'CRUD de produtos da loja' },
    { name: 'Clientes', description: 'CRUD de clientes' },
    { name: 'Pedidos', description: 'CRUD de pedidos e seus itens' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Informe o token JWT retornado no login.',
      },
      userIdHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'x-user-id',
        description: 'ID do usuario autenticado. Deve ser igual ao id_usuario presente no token.',
      },
    },
    parameters: {
      idCategoria: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID da categoria',
        schema: { type: 'integer', example: 1 },
      },
      idProduto: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do produto',
        schema: { type: 'integer', example: 1 },
      },
      idCliente: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do cliente',
        schema: { type: 'integer', example: 1 },
      },
      idPedido: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'ID do pedido',
        schema: { type: 'integer', example: 1 },
      },
    },
    schemas: {
      Status: {
        type: 'object',
        properties: {
          versao: { type: 'string', example: '2.0.0' },
          status: { type: 'string', example: 'online' },
        },
      },
      UsuarioRegistro: {
        type: 'object',
        required: ['nome', 'nick', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Candido Farias' },
          nick: { type: 'string', example: 'candido' },
          senha: { type: 'string', example: '123456' },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id_usuario: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Candido Farias' },
          nick: { type: 'string', example: 'candido' },
        },
      },
      Login: {
        type: 'object',
        required: ['nick', 'senha'],
        properties: {
          nick: { type: 'string', example: 'candido' },
          senha: { type: 'string', example: '123456' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          usuario: { $ref: '#/components/schemas/Usuario' },
        },
      },
      CategoriaInput: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', example: 'Notebooks' },
        },
      },
      Categoria: {
        allOf: [
          { $ref: '#/components/schemas/CategoriaInput' },
          {
            type: 'object',
            properties: {
              id_categoria: { type: 'integer', example: 1 },
            },
          },
        ],
      },
      ProdutoInput: {
        type: 'object',
        required: ['nome', 'valor', 'estoque', 'id_categoria'],
        properties: {
          nome: { type: 'string', example: 'Notebook ASUS Vivobook Go 15' },
          valor: { type: 'number', format: 'double', example: 2034 },
          estoque: { type: 'integer', example: 3 },
          id_categoria: { type: 'integer', example: 1 },
        },
      },
      Produto: {
        allOf: [
          { $ref: '#/components/schemas/ProdutoInput' },
          {
            type: 'object',
            properties: {
              id_produto: { type: 'integer', example: 12 },
              categoria: { type: 'string', example: 'Note Books' },
            },
          },
        ],
      },
      ClienteInput: {
        type: 'object',
        required: ['nome', 'telefone'],
        properties: {
          nome: { type: 'string', example: 'Euclides da Cunha' },
          telefone: { type: 'string', example: '51998776123' },
          status: {
            type: 'string',
            enum: ['bom', 'medio', 'ruim'],
            example: 'medio',
          },
        },
      },
      Cliente: {
        allOf: [
          { $ref: '#/components/schemas/ClienteInput' },
          {
            type: 'object',
            properties: {
              id_cliente: { type: 'integer', example: 2 },
            },
          },
        ],
      },
      PedidoItemInput: {
        type: 'object',
        required: ['id_produto', 'quantidade', 'valor'],
        properties: {
          id_produto: { type: 'integer', example: 1 },
          quantidade: { type: 'number', format: 'double', example: 1 },
          valor: { type: 'number', format: 'double', example: 1259 },
        },
      },
      PedidoItem: {
        allOf: [
          { $ref: '#/components/schemas/PedidoItemInput' },
          {
            type: 'object',
            properties: {
              produto: { type: 'string', example: 'Impressora Multifuncional Laser MF262DW' },
            },
          },
        ],
      },
      PedidoInput: {
        type: 'object',
        required: ['data', 'id_cliente', 'itens'],
        properties: {
          data: { type: 'string', format: 'date', example: '2026-04-16' },
          id_cliente: { type: 'integer', example: 1 },
          itens: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/PedidoItemInput' },
          },
        },
      },
      PedidoResumo: {
        type: 'object',
        properties: {
          id_pedido: { type: 'integer', example: 1 },
          data: { type: 'string', format: 'date', example: '2026-04-16' },
          id_cliente: { type: 'integer', example: 1 },
          cliente: { type: 'string', example: 'Avaro Alvarenga' },
        },
      },
      Pedido: {
        allOf: [
          { $ref: '#/components/schemas/PedidoResumo' },
          {
            type: 'object',
            properties: {
              itens: {
                type: 'array',
                items: { $ref: '#/components/schemas/PedidoItem' },
              },
            },
          },
        ],
      },
      Mensagem: {
        type: 'object',
        properties: {
          msg: { type: 'string', example: 'Operacao realizada com sucesso' },
        },
      },
      Erro: {
        type: 'object',
        properties: {
          msg: { type: 'string', example: 'Registro nao encontrado' },
        },
      },
      ErroInterno: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Mensagem tecnica do erro' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Token ou ID do usuario nao informado/invalido',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro' },
            examples: {
              semToken: { value: { msg: 'Token nao fornecido' } },
              semUsuario: { value: { msg: 'ID do usuario nao fornecido' } },
            },
          },
        },
      },
      Forbidden: {
        description: 'ID do usuario nao confere com o token',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Erro' },
            example: { msg: 'ID do usuario nao confere com o token' },
          },
        },
      },
      InternalError: {
        description: 'Erro interno no servidor',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErroInterno' },
          },
        },
      },
    },
  },
  paths: {
    '/api/status': {
      get: {
        tags: ['Status'],
        summary: 'Consultar status da API',
        responses: {
          200: {
            description: 'API online',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Status' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/versao': {
      get: {
        tags: ['Status'],
        summary: 'Consultar versao da API',
        responses: {
          200: {
            description: 'Versao e status da API',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Status' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Cadastrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioRegistro' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios ausentes ou usuario ja existente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Realizar login',
        description:
          'Tambem aceita os campos email e password como alternativas para nick e senha.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          400: {
            description: 'Nick e senha nao informados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Nick e senha sao obrigatorios' },
              },
            },
          },
          401: {
            description: 'Credenciais invalidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Credenciais invalidas' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Listar categorias',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        responses: {
          200: {
            description: 'Lista de categorias',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Categoria' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Categorias'],
        summary: 'Criar categoria',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoriaInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Categoria criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Categoria' },
              },
            },
          },
          400: {
            description: 'Nome nao informado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Nome e obrigatorio' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/categorias/{id}': {
      get: {
        tags: ['Categorias'],
        summary: 'Buscar categoria por ID',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCategoria' }],
        responses: {
          200: {
            description: 'Categoria encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Categoria' },
              },
            },
          },
          404: {
            description: 'Categoria nao encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Categoria nao encontrada' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Categorias'],
        summary: 'Atualizar categoria',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCategoria' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoriaInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Categoria atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Categoria' },
              },
            },
          },
          400: {
            description: 'Nome nao informado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Nome e obrigatorio' },
              },
            },
          },
          404: {
            description: 'Categoria nao encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Categoria nao encontrada' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Remover categoria',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCategoria' }],
        responses: {
          200: {
            description: 'Categoria removida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mensagem' },
                example: { msg: 'Categoria removida com sucesso' },
              },
            },
          },
          404: {
            description: 'Categoria nao encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Categoria nao encontrada' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar produtos',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        responses: {
          200: {
            description: 'Lista de produtos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Produto' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Criar produto',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProdutoInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Produto criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios nao informados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Nome, valor, estoque e id_categoria sao obrigatorios' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/produtos/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto por ID',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idProduto' }],
        responses: {
          200: {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' },
              },
            },
          },
          404: {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Produto nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idProduto' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProdutoInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Produto atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios nao informados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Nome, valor, estoque e id_categoria sao obrigatorios' },
              },
            },
          },
          404: {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Produto nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remover produto',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idProduto' }],
        responses: {
          200: {
            description: 'Produto removido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mensagem' },
                example: { msg: 'Produto removido com sucesso' },
              },
            },
          },
          404: {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Produto nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        responses: {
          200: {
            description: 'Lista de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Cliente' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Criar cliente',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Cliente criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios ausentes ou status invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/clientes/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Buscar cliente por ID',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCliente' }],
        responses: {
          200: {
            description: 'Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          404: {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Cliente nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Atualizar cliente',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCliente' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Cliente atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios ausentes ou status invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
              },
            },
          },
          404: {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Cliente nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Remover cliente',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idCliente' }],
        responses: {
          200: {
            description: 'Cliente removido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mensagem' },
                example: { msg: 'Cliente removido com sucesso' },
              },
            },
          },
          404: {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Cliente nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/pedidos': {
      get: {
        tags: ['Pedidos'],
        summary: 'Listar pedidos',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        responses: {
          200: {
            description: 'Lista de pedidos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PedidoResumo' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Pedidos'],
        summary: 'Criar pedido',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PedidoInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Pedido criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios nao informados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/pedidos/{id}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Buscar pedido por ID',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idPedido' }],
        responses: {
          200: {
            description: 'Pedido encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          404: {
            description: 'Pedido nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Pedido nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      put: {
        tags: ['Pedidos'],
        summary: 'Atualizar pedido',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idPedido' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PedidoInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Pedido atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          400: {
            description: 'Dados obrigatorios nao informados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
              },
            },
          },
          404: {
            description: 'Pedido nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Pedido nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      delete: {
        tags: ['Pedidos'],
        summary: 'Remover pedido',
        security: [{ bearerAuth: [], userIdHeader: [] }],
        parameters: [{ $ref: '#/components/parameters/idPedido' }],
        responses: {
          200: {
            description: 'Pedido removido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mensagem' },
                example: { msg: 'Pedido removido com sucesso' },
              },
            },
          },
          404: {
            description: 'Pedido nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Erro' },
                example: { msg: 'Pedido nao encontrado' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
