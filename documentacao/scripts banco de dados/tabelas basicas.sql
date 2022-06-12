CREATE TABLE Paises (
	id integer PRIMARY KEY DEFAULT nextval('paises_seq'),
	pais varchar NOT NULL,
	sigla char(4)
);
CREATE TABLE Estados (
	id integer PRIMARY KEY DEFAULT nextval('estados_seq'),
	estado varchar NOT NULL,
	uf char(3),
	fk_idPais integer NOT NULL REFERENCES Paises(id)
);
CREATE TABLE Cidades (
	id integer PRIMARY KEY DEFAULT nextval('cidades_seq'),
	cidade varchar NOT NULL,
	fk_idEstado integer NOT NULL REFERENCES Estados(id)
);
CREATE TABLE Clientes (
	id integer PRIMARY KEY DEFAULT nextval('clientes_seq'),
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
	id integer PRIMARY KEY DEFAULT nextval('fornecedores_seq'),
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
)

