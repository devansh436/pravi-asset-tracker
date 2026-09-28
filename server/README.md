# Asset Tracker API Foundation

## Setup

```powershell
cd server
Copy-Item .env.example .env
npm install
npm start
```

Set `DATABASE_URL` in `.env` to the Aiven PostgreSQL connection string, then run:

```powershell
npm run migrate
npm run seed
npm start
```

The foundation exposes `GET /api/health` and does not mount business routes yet.

## Temporary demo actor

JWT is installed for the next backend phase but authentication is not included yet.

Responses use `{ success, data, error }` for the health and error middleware surfaces.