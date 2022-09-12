CREATE TABLE Paises (
	id integer PRIMARY KEY DEFAULT nextval('paises_seq'),
	nmPais varchar NOT NULL,
	sigla varchar(3),
	ddi varchar,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Estados (
	id integer PRIMARY KEY DEFAULT nextval('estados_seq'),
	nmEstado varchar NOT NULL,
	uf varchar,
	fk_idPais integer NOT NULL REFERENCES Paises(id),
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Cidades (
	id integer PRIMARY KEY DEFAULT nextval('cidades_seq'),
	nmCidade varchar NOT NULL,
	ddd varchar,
	fk_idEstado integer NOT NULL REFERENCES Estados(id),
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Condicoes_Pagamento (
	id integer PRIMARY KEY DEFAULT nextval('condicoes_pagamento_seq'),
	descricao varchar NOT NULL,
	txDesc real NOT NULL,
	txMulta real NOT NULL,
	txJuros real NOT NULL,
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
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
	fk_idCondPgto integer REFERENCES Condicoes_Pagamento(id),
	flAssociado varchar(1) NOT NULL,
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
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
	fk_idCondPgto integer REFERENCES Condicoes_Pagamento(id),
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Tributacoes (
	id integer PRIMARY KEY DEFAULT nextval('tributacoes_seq'),
	descricao varchar NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Origens (
	id integer PRIMARY KEY DEFAULT nextval('origens_seq'),
	descricao varchar NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Grades (
	id integer PRIMARY KEY DEFAULT nextval('grades_seq'),
	descricao varchar NOT NULL,
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Caracteristicas (
	id integer PRIMARY KEY DEFAULT nextval('caracteristicas_seq'),
	descricao varchar,
	fk_idGrade integer REFERENCES Grades(id),
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Variacoes (
	id integer PRIMARY KEY DEFAULT nextval('variacoes_seq'),
	descricao varchar,
	fk_idCaracteristica integer REFERENCES Caracteristicas(id),
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Itens (
	id integer PRIMARY KEY DEFAULT nextval('itens_seq'),
	gtin varchar(14),
	numFabricante varchar,
	descricao varchar NOT NULL,
	apelido varchar,
	marca varchar,
	undMedida varchar,
	unidade real,
	vlCusto decimal(7,2),
	vlVenda decimal(7,2),
	lucro real,
	pesoBruto real,
	pesoLiq real,
	ncm varchar,
	cfop varchar,
	percIcmsSaida real,
	percIpi real,
	cargaTrib real,
	fk_idTributacao integer REFERENCES Tributacoes(id),
	fk_idOrigem integer REFERENCES Origens(id),
	fk_idGrade integer REFERENCES Grades(id),
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE Formas_Pagamento (
	id integer PRIMARY KEY DEFAULT nextval('formas_pagamento_seq'),
	descricao varchar NOT NULL,
	flSituacao varchar(1) NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

CREATE TABLE parcelas (
	fk_idCondPgto integer REFERENCES Condicoes_Pagamento(id),
	numero integer,
	dias integer,
	percentual real,
	PRIMARY KEY (fk_idCondPgto, numero),
	fk_idFormaPgto integer REFERENCES Formas_Pagamento(id),
	flSituacao varchar NOT NULL,
	dataCad timestamp(0) NOT NULL,
	ultAlt timestamp(0) NOT NULL
);

