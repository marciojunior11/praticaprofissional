CREATE SEQUENCE IF NOT EXISTS paises_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS estados_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;
	
CREATE SEQUENCE IF NOT EXISTS cidades_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS condicoespagamento_seq
	increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;
	
CREATE SEQUENCE IF NOT EXISTS clientes_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS fornecedores_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS grades_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS caracteristicas_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS variacoes_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS formaspagamento_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS produtos_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS vendas_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS contratos_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

CREATE SEQUENCE IF NOT EXISTS movimentacoes_seq
    increment 1
	minvalue 1
	no maxvalue
	start 1
	cache 1;

create table paises (
    id integer primary key default nextval('paises_seq'),
    nmpais varchar not null,
    sigla varchar not null,
    ddi varchar,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table estados (
    id integer primary key default nextval('estados_seq'),
    nmestado varchar not null,
    uf varchar not null,
    fk_idpais integer not null references paises(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table cidades (
    id integer primary key default nextval('cidades_seq'),
    nmcidade varchar not null,
    ddd varchar,
    fk_idestado integer not null references estados(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table formaspagamento (
    id integer primary key default nextval('formaspagamento_seq'),
    descricao varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table condicoespagamento (
    id integer primary key default nextval('condicoespagamento_seq'),
    descricao varchar not null,
    txdesc real not null,
    txmulta real not null,
    txjuros real not null,
    flsituacao varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table parcelas (
    fk_idcondpgto integer not null references condicoespagamento(id),
    numero integer not null,
    primary key (fk_idcondpgto, numero),
    dias integer not null,
    percentual real not null,
    fk_idformapgto integer not null references formaspagamento(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table fornecedores (
    id integer primary key default nextval('fornecedores_seq'),
    razsocial varchar not null,
    nmfantasia varchar,
    inscestadual varchar,
    telefone varchar,
    celular varchar,
    email varchar,
    cnpj varchar,
    cep varchar,
    endereco varchar,
    numend varchar,
    bairro varchar,
    fk_idcidade integer not null references cidades(id),
    fk_idcondpgto integer references condicoespagamento(id),
    flsituacao varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table clientes (
    id integer primary key default nextval('clientes_seq'),
    nmcliente varchar not null,
    sexo varchar not null,
    datanasc date,
    cpf varchar not null,
    rg varchar,
    telefone varchar,
    celular varchar,
    email varchar,
    cep varchar,
    endereco varchar,
    numend varchar,
    bairro varchar,
    fk_idcidade integer not null references cidades(id),
    fk_idcondpgto integer references condicoespagamento(id),
    flassociado varchar not null,
    flsituacao varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table grades (
    id integer primary key default nextval('grades_seq'),
    descricao varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table caracteristicas (
    id integer primary key default nextval('caracteristicas_seq'),
    descricao varchar not null,
    fk_idgrade integer not null references grades(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table variacoes (
    id integer primary key default nextval('variacoes_seq'),
    descricao varchar not null,
    fk_idcaracteristica integer not null references caracteristicas(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table produtos (
    id integer primary key default nextval('produtos_seq'),
    gtin varchar not null,
    descricao varchar not null,
    apelido varchar not null,
    marca varchar not null,
    undmedida varchar not null,
    unidade real,
    vlcusto real,
    vlcompra real,
    vlvenda real,
    lucro real,
    pesoliq real,
    pesobruto real,
    ncm varchar not null,
    cfop varchar not null,
    percicmssaida real,
    percipi real,
    cargatribut real,
    vlfrete real,
    qtdatual real,
    qtdideal real,
    qtdmin real,
    fk_idforneceor integer not null references fornecedores(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table produtos_variacoes (
    fk_idproduto integer not null references produtos(id),
    fk_idvariacao integer not null references variacoes(id),
    primary key (fk_idproduto, fk_idvariacao)
);

create table compras (
    numnf varchar not null,
    serienf varchar not null,
    modelonf varchar not null,
    fk_idfornecedor integer not null references fornecedores(id),
    primary key(numnf, serienf, modelonf, fk_idfornecedor),
    observacao varchar,
    vlfrete real,
    vlpedagio real,
    vloutrasdespesas real,
    vltotal real not null,
    dataemissao date not null,
    dataentrada date not null,
    flsituacao varchar not null,
    flmovimentacao varchar,
    fk_idcondpgto integer not null references condicoespagamento(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table produtos_compra (
    fk_numnf varchar not null,
    fk_serienf varchar not null,
    fk_modelonf varchar not null,
    fk_idfornecedor integer not null,
    foreign key (fk_numnf, fk_serienf, fk_modelonf, fk_idfornecedor) references compras(numnf, serienf, modelonf, fk_idfornecedor),
    fk_idproduto integer not null references produtos(id),
    primary key (fk_numnf, fk_serienf, fk_modelonf, fk_idfornecedor, fk_idproduto),
    qtd integer not null,
    vlcusto real not null,
    vlcompra real not null
);

create table contaspagar (
    nrparcela integer not null,
    fk_numnf varchar not null,
    fk_serienf varchar not null,
    fk_modelonf varchar not null,
    fk_idfornecedor integer not null,
    foreign key (fk_numnf, fk_serienf, fk_modelonf, fk_idfornecedor) references compras(numnf, serienf, modelonf, fk_idfornecedor),
    primary key (nrparcela, fk_numnf, fk_serienf, fk_modelonf, fk_idfornecedor),
    percparcela real not null,
    txdesc real not null,
    txmulta real not null,
    txjuros real not null,
    dtvencimento date not null,
    fk_idformapgto integer not null references formaspagamento(id),
    vltotal real not null,
    observacao varchar,
    flsituacao varchar,
    florigem varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table vendas (
    id integer primary key default nextval('vendas_seq'),
    fk_idcliente integer not null references clientes(id),
    observacao varchar,
    fk_idcondpgto integer not null references condicoespagamento(id),
    vltotal real not null,
    flsituacao varchar not null,
    flmovimentacao varchar not null,
    dataemissao date not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table produtos_venda (
    fk_idvenda integer not null references vendas(id),
    fk_idproduto integer not null references produtos(id),
    primary key (fk_idvenda, fk_idproduto),
    qtd integer not null,
    vlvenda real not null
);

create table contasreceber (
    nrparcela integer not null,
    fk_idvenda integer not null references vendas(id),
    primary key (nrparcela, fk_idvenda),
    fk_idcliente integer not null references clientes(id),
    percparcela real not null,
    txdesc real not null,
    txmulta real not null,
    txjuros real not null,
    dtvencimento date not null,
    fk_idformapgto integer not null references formaspagamento(id),
    vltotal real not null,
    observacao varchar,
    flsituacao varchar not null,
    florigem varchar not null,
    datacad timestamp not null,
    ultalt timestamp not null
);

create table contratos (
    id integer primary key default nextval('contratos_seq'),
    fk_idcliente integer not null references clientes(id),
    qtdmeses integer not null,
    vltotal real not null,
    flsituacao varchar not null,
    fk_idcondpgto integer not null references condicoespagamento(id),
    datavalidade date not null,
    fk_idvenda integer not null references vendas(id),
    datacad timestamp not null,
    ultalt timestamp not null
);

create table movimentacoes (
    id integer primary key default nextval('movimentacoes_seq'),
    tipo varchar not null,
    dtmovimentacao date not null,
    valor real not null,
    idpessoa integer not null
);