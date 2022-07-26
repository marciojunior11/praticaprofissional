CREATE TABLE Paises (
	id integer PRIMARY KEY DEFAULT nextval('paises_seq'),
	nmPais varchar NOT NULL,
	sigla varchar(3),
	ddi varchar(4),
	dataCad timestamp NOT NULL,
	ultAlt timestamp NOT NULL
);
CREATE TABLE Estados (
	id integer PRIMARY KEY DEFAULT nextval('estados_seq'),
	nmEstado varchar NOT NULL,
	uf varchar(2),
	fk_idPais integer NOT NULL REFERENCES Paises(id),
	dataCad timestamp NOT NULL,
	ultAlt timestamp NOT NULL
);
CREATE TABLE Cidades (
	id integer PRIMARY KEY DEFAULT nextval('cidades_seq'),
	nmCidade varchar NOT NULL,
	ddd varchar(2),
	fk_idEstado integer NOT NULL REFERENCES Estados(id),
	dataCad timestamp NOT NULL,
	ultAlt timestamp NOT NULL
);
CREATE TABLE Clientes (
	id integer PRIMARY KEY DEFAULT nextval('clientes_seq'),
	nome varchar NOT NULL,
	sexo varchar(9),
	cpf varchar(11) NOT NULL,
	rg varchar,
	telefone varchar(8),
	celular varchar(9),
	email varchar,
	cep varchar(8),
	endereco varchar,
	numEnd varchar,
	bairro varchar,
	fk_idCidade integer NOT NULL REFERENCES Cidades(id),
	associado boolean NOT NULL,
	dataCad timestamp NOT NULL,
	ult timestamp NOT NULL
);
CREATE TABLE Fornecedores (
	id integer PRIMARY KEY DEFAULT nextval('fornecedores_seq'),
	razSocial varchar NOT NULL,
	nmFantasia varchar,
	telefone varchar(8),
	celular varchar(9),
	email varchar,
	documento varchar(14) NOT NULL,
	inscEstadual varchar(14),
	cep varchar(8),
	endereco varchar,
	numEnd varchar,
	bairro varchar,
	fk_idCidade integer NOT NULL REFERENCES Cidades(id),
	dataCad timestamp NOT NULL,
	ultAlt timestamp NOT NULL,
);
CREATE TABLE Tipos_Produto (
	id integer PRIMARY KEY DEFAULT nextval('tipos_produto_seq'),
	descricao varchar NOT NULL
);
CREATE TABLE Produtos (
	id integer PRIMARY KEY DEFAULT nextval('produtos_seq'),
	descricao varchar NOT NULL,
	valorCompra decimal(7,2),
	valorVenda decimal(7,2),
	fk_idTipoProduto integer REFERENCES Tipos_Produto(id),
	fk_idFornecedor integer NOT NULL REFERENCES Fornecedores(id)
);

CREATE TABLE Formas_Pagamento (
	id integer PRIMARY KEY DEFAULT nextval('formas_pagamento_seq'),
	descricao varchar NOT NULL,
	valorCompra decimal(7,2),
	valorVenda decimal(7,2),
	fk_idTipoProduto integer REFERENCES Tipos_Produto(id),
	fk_idFornecedor integer NOT NULL REFERENCES Fornecedores(id)
)

