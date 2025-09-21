# Hospital Backend (SQLite + Prisma)

## Setup
```bash
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
# API: http://localhost:3333
```

### Usuários seed
- medico.demo / **123** (MEDICO)
- atendente.demo / **123** (ATENDENTE)

### Endpoints
- POST /auth/login { username, password }
- POST /patients { name, reason }
- GET  /patients?status=TRIAGEM|FILA|ATENDIMENTO|CONCLUIDO
- POST /attend/:id/start { doctorId }
- POST /attend/:id/finish
- GET  /history?name=&from=&to=&status=
- GET  /reports

> Banco: SQLite (arquivo `dev.db` no diretório). `npx prisma studio` para ver dados.
