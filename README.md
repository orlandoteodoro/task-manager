# Task Manager (Kanban) – (Spring Boot + React + MySQL + Docker)

Repositório: **backend Spring Boot (Java 17)**, **frontend React (Vite)** e **MySQL**, tudo via **Docker Compose**.

## ✅ Como rodar com Docker

Pré-requisitos:
- Docker + Docker Compose

Subir tudo:
```bash
docker compose up --build
```

Acessos:
- Frontend: http://localhost:5173
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 🔌 Endpoints principais

Base: `http://localhost:8080/api/tasks`

- `POST /api/tasks` – criar tarefa
- `GET /api/tasks?status=TODO|DOING|DONE` – listar/filtrar
- `GET /api/tasks/{id}` – buscar por id
- `PUT /api/tasks/{id}` – atualizar campos
- `PATCH /api/tasks/{id}/status` – atualizar apenas status (drag & drop)
- `DELETE /api/tasks/{id}` – excluir (remoção física)

## Rodar local (sem Docker)

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Estrutura
- `backend/` Spring Boot + JPA + Validation + Swagger (springdoc) + CORS
- `frontend/` React (Vite) + Axios + Kanban 

## Observações
- Banco MySQL sobe via Docker (porta 3306).
- IDs de task são UUID.
