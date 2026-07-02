CREATE DATABASE IF NOT EXISTS loja;
USE loja;

DROP TABLE IF EXISTS produtos_pedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE categorias (
  id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_categoria)
);

CREATE TABLE clientes (
  id_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  status ENUM('bom', 'medio', 'ruim') DEFAULT 'medio',
  PRIMARY KEY (id_cliente)
);

CREATE TABLE endereco (
  id_endereco INT UNSIGNED NOT NULL AUTO_INCREMENT,
  logradouro VARCHAR(45) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  bairro VARCHAR(45) NOT NULL,
  cep VARCHAR(12) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  clientes_id_cliente INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_endereco),
  CONSTRAINT fk_endereco_clientes
    FOREIGN KEY (clientes_id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE produtos (
  id_produto INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  valor DOUBLE NOT NULL,
  estoque INT NOT NULL DEFAULT 1,
  categorias_id_categoria INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_produto),
  CONSTRAINT fk_produtos_categorias
    FOREIGN KEY (categorias_id_categoria) REFERENCES categorias (id_categoria)
);

CREATE TABLE pedidos (
  id_pedido INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data DATE NOT NULL,
  clientes_id_cliente INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_pedido),
  CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (clientes_id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE produtos_pedidos (
  produtos_id_produto INT UNSIGNED NOT NULL,
  pedidos_id_pedido INT UNSIGNED NOT NULL,
  quantidade DOUBLE NOT NULL,
  valor DOUBLE NOT NULL,
  PRIMARY KEY (produtos_id_produto, pedidos_id_pedido),
  CONSTRAINT fk_produtos_pedidos_produtos
    FOREIGN KEY (produtos_id_produto) REFERENCES produtos (id_produto),
  CONSTRAINT fk_produtos_pedidos_pedidos
    FOREIGN KEY (pedidos_id_pedido) REFERENCES pedidos (id_pedido)
);

CREATE TABLE usuarios (
  id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  nick VARCHAR(15) NOT NULL,
  senha VARCHAR(90) NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uk_usuarios_nick (nick)
);

INSERT INTO categorias (id_categoria, nome) VALUES
(1, 'Note Books'),
(2, 'Impressoras'),
(3, 'Telas'),
(4, 'Suprimentos'),
(5, 'Acessorio'),
(6, 'Softwares');

INSERT INTO clientes (id_cliente, nome, telefone, status) VALUES
(1, 'Avaro Alvarenga', '51987455432', 'medio'),
(2, 'Euclides da Cunha', '51998776123', 'medio'),
(3, 'Gaciliano Ramos', '51971488123', 'medio'),
(4, 'Ariclenes de Almeida', '51992575315', 'medio');

INSERT INTO produtos (id_produto, nome, valor, estoque, categorias_id_categoria) VALUES
(1, 'Impressora Multifuncional Laser MF262DW', 1259, 5, 2),
(2, 'Impressora Multifuncional HP Smart Tank 581', 862, 9, 2),
(6, 'Monitor Gamer LG 24', 736, 15, 3),
(12, 'Notebook ASUS Vivobook Go 15', 2034, 3, 1),
(17, 'Microsoft 365 Family com Copilot', 499, 12, 6);

INSERT INTO pedidos (id_pedido, data, clientes_id_cliente) VALUES
(1, '2026-04-16', 1),
(2, '2026-04-16', 3);

INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES
(1, 1, 1, 1259),
(6, 1, 1, 736),
(2, 2, 1, 862);

INSERT INTO usuarios (id_usuario, nome, nick, senha) VALUES
(1, 'Candido Farias', 'candido', 'e10adc3949ba59abbe56e057f20f883e');
