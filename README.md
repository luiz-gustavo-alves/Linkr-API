# Linkr 🔗
Projeto Full Stack para construção de uma rede social de compartilhamento de links!

## Requisitos Obrigatórios ⚠️

### Geral:
- **Deploy do projeto back-end e do banco de dados na nuvem**.
- Utilização do banco de dados PostgreSQL.
- Arquiteturar o projeto em _controllers_, _routers_, _middlewares_, _schemas_ e _services_.
- Validação de dados utilizando a dependência _joi_.
- _dump SQL_.
- Scroll Infinito.

### Armazenamento dos Dados:

- Formato geral dos dados:

``` sql
"users" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(64) NOT NULL,
	"email" VARCHAR(128) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"imageURL" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

"posts" (
	"id" SERIAL PRIMARY KEY,
	"description" TEXT NOT NULL,
	"URL" TEXT NOT NULL,
	"URL_title" TEXT NOT NULL,
	"URL_description" TEXT NOT NULL,
	"URL_image" TEXT NOT NULL,
	"userID" INTEGER NOT NULL REFERENCES "users" ("id"),
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

"likes" (
	"id" SERIAL PRIMARY KEY,
	"userID" INTEGER NOT NULL REFERENCES "users" ("id"),
	"postID" INTEGER NOT NULL REFERENCES "posts" ("id")
);

"hashtags" (
	"id" SERIAL PRIMARY KEY,
	"hashtag" VARCHAR(255) NOT NULL UNIQUE,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

"hashtagPosts" (
	"id" SERIAL PRIMARY KEY,
	"hashtagID" INTEGER NOT NULL REFERENCES "hashtags" ("id"),
	"postID" INTEGER NOT NULL REFERENCES "posts" ("id")
);

"follows" (
  "id" SERIAL PRIMARY KEY,
	"userID_following" INTEGER NOT NULL REFERENCES "users" ("id"),
	"userID_follower" INTEGER NOT NULL REFERENCES "users" ("id")
);

"comments" (
	"id" SERIAL PRIMARY KEY,
	"userID_owner" INTEGER NOT NULL REFERENCES "users" ("id"),
	"userID_comment" INTEGER NOT NULL REFERENCES "users" ("id"),
	"postID" INTEGER NOT NULL REFERENCES "posts" ("id"),
	"comment" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

"
```

## Endpoints ⚙️
### 🚩 AuthRouter 🚩
### /
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **email** e **password** pelo _body_ e realiza o login do usuário/prestador de serviço.
### /sign-up
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **name, email** e **password** pelo _body_ e realiza o cadastro do usuário.
### /logout
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **token** pelo _header_ e realiza o logout do usuário/prestador de serviço.
<br>
### 🚩 HashtagsRouter 🚩
### /hashtags
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna lista de hasthags. Limitado por 10 hashtags.<br>
### /hashtags/:hashtag
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna postagens que contém a hashtag fornecida por _params_.<br>
### 🚩 PostsRouter 🚩
### /create-post
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **description** e **URL** pelo _body_ e cadastra uma postagem.
### /update-post/:postID
![](https://place-hold.it/80x20/ec7926/ffffff?text=PUT&fontsize=16) Recebe **description** e **URL** pelo _body_ e edita uma postagem do usuário de acordo com o ID fornecido por _params_.
### /delete-post/:postID
![](https://place-hold.it/80x20/ec2626/ffffff?text=DELETE&fontsize=16) Deleta uma postagem do usuário de acordo com o ID fornecido por _params_.
### 🚩 UserRouter 🚩
### /countFollowing
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna o total de seguidores do usuário.
### /countTimelinePosts
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna o total de postagens da timeline do usuário.
### /timeline
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna a timeline com postagens do usuário e dos seguidores.
### /user/:id
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna postagens de um usuário de acordo com ID fornecido.
### /timeline/search/users/:search
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Retorna lista de usuários pesquisados na barra de pesquisa.
### /follow/:id
![](https://place-hold.it/80x20/26baec/ffffff?text=GET&fontsize=16) Verifica se o usuário segue um outro usuário de acordo com ID fornecido.
### /follow/:id
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Segue ou deixa de seguir um usuário de acordo com ID do usuário fornecido.
### /post/like/:id
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Dê ou deixa de dar like em uma postagem de acordo com ID da postagem fornecido.
### /comments
![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) Recebe **comment, postID** e **userID_owner** pelo _body_ e realiza um comentário em uma postagem.
<br>
## Middlewares 🔛
### schemaValidation:
- Recebe um _Schema_ por parámetro de função e realiza as verificações dos dados recebidos pelo _body_.
- Rotas que utilizam esses _middlewares_:
  - **AuthRouter**:
    -  ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/**
    -  ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/sign-up**
  - **PostsRouter**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/create-post**
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/update-post/:postID**
  - **UserRouter**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/comments** 

### authValidation:
- Recebe um **token** pelo _header_ e verifica se o **token** é válido e se o usuário está autentificado no sistema.
- Rotas que utilizam esse _middleware_:
  - **HashtagsRouter**
  - **PostsRouter**
  - **UserRouter**
 
### getHashtags:
- Recebe a descrição de uma postagem pelo _body_ e realiza um mapeamento de hashtags da postagem.
- Rotas que utilizam esse _middleware_:
  - **PostsRouter**:
    - ![](https://place-hold.it/80x20/26ec48/ffffff?text=POST&fontsize=16) **/create-post**

## Deploy Front-End do Projeto 💻

| Plataforma | Deploy |
| --- | --- |
| <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a> | https://linkr-cyan.vercel.app/ 
