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