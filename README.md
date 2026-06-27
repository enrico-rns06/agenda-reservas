# Agenda de Reservas

Sistema fullstack de agendamento de reservas com autenticacao JWT, painel do profissional e notificacoes por e-mail.

## Tecnologias

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Banco de dados:** PostgreSQL
- **Autenticacao:** JWT
- **E-mail:** Nodemailer + Gmail

## Funcionalidades

- Cadastro e login de usuarios (cliente e profissional)
- Agendamento de servicos com selecao de profissional, data e horario
- Painel do profissional para visualizar, confirmar e cancelar agendamentos
- Notificacao por e-mail automatica ao confirmar ou cancelar um agendamento
- Rotas protegidas por JWT com controle de perfil

## Como rodar localmente

### Pre-requisitos

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Preencha as variaveis no .env
npm run migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variaveis de ambiente

Veja o arquivo `backend/.env.example` para todas as variaveis necessarias.

## Estrutura do projeto

agenda-reservas/ 

├── backend/ 

│ ├── src/ 

│ │ ├── config/ # Banco de dados e mailer 

│ │ ├── controllers/ # Lógica das rotas 

│ │ ├── middlewares/ # Autenticacao JWT 

│ │ ├── rotas/ # Definição das rotas 

│ │ └── services/ # Serviço de e-mail 

│ └── server.js 

└── frontend/ 

└── src/ 

├── api/ # Configuração do Eixos 

├── context/ # Contexto de autenticação 

├── pages/ # Telas de aplicação 

└── componentes/ # Componentes reutilizáveis

## Autor

Enrico Reno — [github.com/enrico-rns06](https://github.com/enrico-rns06)