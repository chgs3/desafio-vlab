# AulaPlan

Sistema de gerenciamento de planos de aula com apoio de Inteligência Artificial.

O **AulaPlan** é uma aplicação web desenvolvida para apoiar docentes, conteudistas e equipes pedagógicas na criação, organização e consulta de planos de aula. Além do CRUD tradicional, o sistema conta com uma funcionalidade de **Smart Assist**, que utiliza IA para sugerir conteúdos complementares, tópicos relacionados, recursos de apoio e tags com base nas informações da aula.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Como executar com Docker](#como-executar-com-docker)
- [Como executar localmente](#como-executar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rotas da API](#rotas-da-api)
- [Smart Assist com IA](#smart-assist-com-ia)
- [Observabilidade e logs](#observabilidade-e-logs)
- [Integração contínua](#integração-contínua)
- [Validação e segurança](#validação-e-segurança)
- [Decisões técnicas](#decisões-técnicas)
- [Melhorias futuras](#melhorias-futuras)
- [Autor](#autor)

---

## Sobre o projeto

O **AulaPlan** foi desenvolvido como solução para um desafio técnico de desenvolvimento de software.

A aplicação permite que o usuário cadastre, consulte, edite, exclua e organize planos de aula. Cada plano possui informações como título, objetivo, ementa, data prevista, disciplina, conteúdos, recursos de apoio e tags.

O principal diferencial do sistema é o recurso **Smart Assist**, que auxilia o usuário no preenchimento de campos pedagógicos a partir de uma integração com uma API de Inteligência Artificial.

---

## Funcionalidades

### Planos de Aula

- Cadastro de planos de aula.
- Listagem de planos cadastrados.
- Edição de planos existentes.
- Exclusão de planos.
- Paginação na listagem.
- Busca por título.
- Filtro por disciplina.
- Filtro por tag.
- Filtro por data prevista.
- Ordenação por título.
- Ordenação por data de cadastro.

### Smart Assist com IA

- Botão **Gerar Recomendações com IA** no formulário de cadastro/edição.
- Envio de título, disciplina e ementa/resumo para o backend.
- Geração automática de:
  - conteúdos complementares;
  - tópicos relacionados;
  - recursos de apoio;
  - 3 tags recomendadas.
- Preenchimento automático dos campos do formulário.
- Estado de carregamento enquanto a IA processa a solicitação.
- Tratamento de erro caso a IA falhe ou demore a responder.

### Interface

- SPA desenvolvida com React.
- Layout responsivo.
- Feedback visual para carregamentos.
- Mensagens de validação no formulário.
- Filtros unificados para melhor experiência de uso.
- Identidade visual própria com o nome **AulaPlan**.

---

## Tecnologias utilizadas

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- Pino
- Google GenAI SDK

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Zod
- Axios
- CSS puro

### DevOps e Qualidade

- Docker
- Docker Compose
- GitHub Actions
- Prisma Migrate
- TypeScript Typecheck

---

## Arquitetura do projeto

```txt
desafio-vlab/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Como executar com Docker

A forma mais simples de executar a aplicação é utilizando Docker Compose.

### Pré-requisitos

- Docker instalado.
- Docker Compose disponível.
- Chave de API da IA configurada.

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd desafio-vlab
```

### 2. Crie o arquivo `.env` na raiz do projeto

```env
AI_API_KEY=sua-chave-da-api
```

### 3. Suba os containers

```bash
docker compose up --build
```

### 4. Acesse a aplicação

Frontend:

```txt
http://localhost:5173
```

Backend health check:

```txt
http://localhost:3333/health
```

---

## Como executar localmente

Também é possível rodar backend e frontend separadamente.

### Pré-requisitos

- Node.js 22+
- PostgreSQL
- npm
- Chave de API da IA

---

### Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lesson_plans"
PORT=3333
FRONTEND_URL="http://localhost:5173"

AI_PROVIDER="gemini"
AI_API_KEY="sua-chave-da-api"
AI_TIMEOUT_MS=15000
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute o backend:

```bash
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:3333
```

---

### Frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

Execute o frontend:

```bash
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

---

## Variáveis de ambiente

### Backend

Arquivo:

```txt
backend/.env
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão com o banco PostgreSQL |
| `PORT` | Porta em que a API será executada |
| `FRONTEND_URL` | URL permitida no CORS |
| `AI_PROVIDER` | Provedor de IA utilizado |
| `AI_API_KEY` | Chave da API de IA |
| `AI_TIMEOUT_MS` | Tempo máximo de espera pela resposta da IA |

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lesson_plans"
PORT=3333
FRONTEND_URL="http://localhost:5173"

AI_PROVIDER="gemini"
AI_API_KEY="sua-chave-da-api"
AI_TIMEOUT_MS=15000
```

### Frontend

Arquivo:

```txt
frontend/.env
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API backend |

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

### Docker

Na raiz do projeto:

```txt
.env
```

```env
AI_API_KEY=sua-chave-da-api
```

---

## Rotas da API

### Health Check

#### `GET /health`

Verifica se a API está em execução.

Resposta:

```json
{
  "status": "ok",
  "timestamp": "2026-05-19T14:00:00.000Z"
}
```

---

### Planos de Aula

#### `POST /lesson-plans`

Cria um novo plano de aula.

Body:

```json
{
  "title": "Introdução ao OSPF",
  "objective": "Apresentar os fundamentos do protocolo OSPF.",
  "summary": "Aula introdutória sobre roteamento dinâmico usando OSPF.",
  "plannedDate": "2026-06-01",
  "discipline": "Redes de Computadores",
  "contents": [
    "Roteamento dinâmico",
    "Áreas OSPF",
    "Custo de enlace"
  ],
  "supportResources": [
    "Slides",
    "Packet Tracer"
  ],
  "tags": [
    "redes",
    "ospf",
    "roteamento"
  ]
}
```

---

#### `GET /lesson-plans`

Lista planos de aula com paginação, filtros e ordenação.

Query params disponíveis:

| Parâmetro | Descrição |
|---|---|
| `page` | Página atual |
| `limit` | Quantidade de registros por página |
| `search` | Busca por título |
| `discipline` | Filtro por disciplina |
| `tag` | Filtro por tag |
| `plannedDate` | Filtro por data prevista |
| `sortBy` | Campo de ordenação: `title` ou `createdAt` |
| `sortOrder` | Ordem: `asc` ou `desc` |

Exemplo:

```txt
GET /lesson-plans?page=1&limit=10&search=ospf&sortBy=createdAt&sortOrder=desc
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Introdução ao OSPF",
      "objective": "Apresentar os fundamentos do protocolo OSPF.",
      "summary": "Aula introdutória sobre roteamento dinâmico usando OSPF.",
      "plannedDate": "2026-06-01T00:00:00.000Z",
      "discipline": "Redes de Computadores",
      "contents": [
        "Roteamento dinâmico",
        "Áreas OSPF"
      ],
      "supportResources": [
        "Slides",
        "Packet Tracer"
      ],
      "tags": [
        "redes",
        "ospf",
        "roteamento"
      ],
      "createdAt": "2026-05-19T14:00:00.000Z",
      "updatedAt": "2026-05-19T14:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### `GET /lesson-plans/:id`

Busca um plano de aula pelo ID.

---

#### `PUT /lesson-plans/:id`

Atualiza um plano de aula existente.

Body parcial permitido:

```json
{
  "title": "OSPF Avançado"
}
```

---

#### `DELETE /lesson-plans/:id`

Remove um plano de aula.

Resposta esperada:

```txt
204 No Content
```

---

### Smart Assist

#### `POST /smart-assist/recommendations`

Gera recomendações pedagógicas com IA.

Body:

```json
{
  "title": "Introdução ao OSPF",
  "discipline": "Redes de Computadores",
  "summary": "Aula introdutória sobre roteamento dinâmico usando OSPF."
}
```

Resposta:

```json
{
  "complementaryContents": [
    "Funcionamento do algoritmo SPF",
    "Tipos de LSA",
    "Convergência em redes OSPF"
  ],
  "relatedTopics": [
    "Protocolos de roteamento dinâmico",
    "RIP",
    "BGP"
  ],
  "supportResources": [
    "Slides com topologias",
    "Simulador Packet Tracer",
    "Exercícios práticos de configuração"
  ],
  "recommendedTags": [
    "ospf",
    "roteamento",
    "redes"
  ]
}
```

---

## Smart Assist com IA

O recurso **Smart Assist** foi implementado no backend para evitar exposição da chave da API no frontend.

Fluxo da funcionalidade:

1. O usuário informa título, disciplina e ementa/resumo.
2. O frontend envia esses dados para o backend.
3. O backend monta um prompt orientando a IA a atuar como um assistente pedagógico.
4. A IA retorna sugestões em JSON.
5. O backend valida a resposta com Zod.
6. O frontend preenche automaticamente os campos do formulário.

O prompt foi construído para solicitar uma resposta exclusivamente em JSON válido, evitando texto adicional, markdown ou explicações fora do formato esperado.

Além disso, a chamada possui tratamento de erro e timeout configurável por variável de ambiente.

---

## Observabilidade e logs

O backend utiliza **Pino** para geração de logs estruturados.

São registrados logs para:

- requisições HTTP;
- erros não tratados;
- chamadas para a IA;
- tempo de resposta da IA;
- sucesso ou falha na geração de recomendações.

Exemplo de log esperado para IA:

```json
{
  "message": "AI Request completed",
  "title": "Introdução ao OSPF",
  "discipline": "Redes de Computadores",
  "latencyMs": 1420
}
```

Exemplo de erro:

```json
{
  "message": "AI Request failed",
  "title": "Introdução ao OSPF",
  "discipline": "Redes de Computadores",
  "latencyMs": 15000,
  "error": "AI_TIMEOUT"
}
```

---

## Integração contínua

O projeto possui uma pipeline de CI configurada com **GitHub Actions**.

O workflow é executado em:

- `push`
- `pull_request`

A pipeline realiza:

### Backend

- Instalação das dependências.
- Geração do Prisma Client.
- Typecheck com TypeScript.
- Build da aplicação.

### Frontend

- Instalação das dependências.
- Build da aplicação.

Essa configuração ajuda a garantir que alterações futuras não quebrem a compilação do projeto.

---

## Validação e segurança

Algumas práticas adotadas no projeto:

- Validação de dados no backend com Zod.
- Validação de formulário no frontend com React Hook Form e Zod.
- Tratamento centralizado de erros no backend.
- Uso de variáveis de ambiente para dados sensíveis.
- Chave da API de IA mantida apenas no backend.
- Arquivos `.env` ignorados pelo Git.
- Arquivos `.env.example` disponibilizados para configuração do ambiente.
- CORS configurado para o frontend.
- Timeout na chamada para a IA.
- Tipagem estrita com TypeScript.

---

## Decisões técnicas

### TypeScript

O TypeScript foi utilizado tanto no backend quanto no frontend para aumentar a segurança do código, melhorar a manutenção e reduzir erros em tempo de desenvolvimento.

### Express

O Express foi escolhido pela simplicidade e pela facilidade de estruturar uma API RESTful clara para o desafio.

### Prisma

O Prisma foi utilizado como ORM para facilitar a modelagem dos dados, criação de migrations e acesso ao PostgreSQL.

### PostgreSQL

O PostgreSQL foi escolhido como banco relacional por ser robusto, amplamente utilizado e adequado para cenários de produção.

### Zod

O Zod foi utilizado para validar entradas da API e formulários, garantindo que os dados estejam no formato esperado antes de serem processados.

### React + Vite

O frontend foi desenvolvido como SPA utilizando React e Vite, permitindo uma experiência rápida de desenvolvimento e build otimizado.

### Docker

Docker e Docker Compose foram utilizados para facilitar a execução local e reduzir problemas de ambiente.

### Smart Assist no backend

A integração com IA foi concentrada no backend por segurança, evitando expor a chave da API no navegador.

---

## Melhorias futuras

Algumas melhorias possíveis para evolução do AulaPlan:

- Autenticação de usuários.
- Controle de permissões por perfil.
- Associação de planos de aula a usuários específicos.
- Histórico de versões dos planos.
- Exportação de planos em PDF.
- Testes automatizados de integração.
- Testes end-to-end no frontend.
- Deploy em ambiente cloud.
- Dashboard com indicadores por disciplina ou período.
- Melhorias avançadas no prompt da IA.
- Cache de recomendações geradas pela IA.

---

## Autor

Desenvolvido por **Caique Santos**.

Projeto criado como parte de um desafio técnico para desenvolvimento de uma aplicação de gerenciamento de planos de aula com apoio de Inteligência Artificial.