CREATE TABLE Paises (
	id integer PRIMARY KEY,
	pais varchar NOT NULL,
	sigla char(4)
);
CREATE TABLE Estados (
	id integer PRIMARY KEY,
	estado varchar NOT NULL,
	uf char(3),
	fk_idPais integer NOT NULL REFERENCES Paises(id)
);
CREATE TABLE Cidades (
	id integer PRIMARY KEY,
	cidade varchar NOT NULL,
	fk_idEstado integer NOT NULL REFERENCES Estados(id)
);
CREATE TABLE Clientes (
	id integer PRIMARY KEY,
	nome varchar NOT NULL,
	cpf char(15) NOT NULL,
	rg char(13),
	telefone varchar,
	endereco varchar,
	numEnd varchar,
	bairro varchar,
	fk_idCidade integer NOT NULL REFERENCES Cidades(id),
	associado bit NOT NULL
);
CREATE TABLE Fornecedores (
	id integer PRIMARY KEY,
	razSocial varchar NOT NULL,
	nomeFantasia varchar,
	cnpj char(20) NOT NULL,
	telefone varchar,
	endereco varchar,
	numEnd varchar,
	bairro varchar,
	fk_idCidade integer NOT NULL REFERENCES Cidades(id)
);
CREATE TABLE Tipos_Produto (
	id integer PRIMARY KEY,
	descricao varchar NOT NULL
);
CREATE TABLE Produtos (
	id integer PRIMARY KEY,
	descricao varchar NOT NULL,
	valorCompra decimal(7,2),
	valorVenda decimal(7,2),
	fk_idTipoProduto integer REFERENCES Tipos_Produto(id),
	fk_idFornecedor integer NOT NULL REFERENCES Fornecedores(id)
)

