create table usuarios(
  id serial primary key,
  nome text not null,
  email text not null,
  senha text not null
);

create table categorias(
  id serial primary key,
  descricao text not null
);

create table postagens (
  id serial primary key,
  data timestamptz default now(),
  usuario_id int not null references usuarios(id),
  texto text not null
);

create table postagem_fotos(
  id serial primary key,
  postagem_id int not null references postagens(id),
  imagem text not null
);

create table postagem_comentarios (
  	id serial primary key,
    texto text not null,
  data timestamptz default now(),
  usuario_id int not null references usuarios(id),
  postagem_id int not null references postagens(id)
  )
  
create table postagem_curtidas (
  usuario_id int not null references usuarios(id),
  postagem_id int not null references postagens(id),
  data timestamptz default now()
  );

 create table produtos (
  id serial primary key,
  descricao text not null,
  quantidade_estoque int,
  valor int not null,
  produto_imagem text,
  categoria_id int references categorias(id)
 );

 create table pedidos (
  id serial primary key,
  cliente_id int not null references clientes(id),
  observacao text not null,
  valor_total int not null
  );

  create table pedido_produtos(
  id serial primary key,
  pedido_id integer references pedidos(id),
  produto_id integer references produtos(id),
  quantidade_produto integer not null,
  valor_produto integer not null
  );

 create table clientes (
  id serial primary key,
  nome text not null,
  email text not null unique,
  cpf text not null unique,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  estado text
 );