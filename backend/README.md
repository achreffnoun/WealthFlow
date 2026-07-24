# Backend

API Node/Express + Prisma + PostgreSQL pour le suivi de dépenses (voir `../docs/ARCHITECTURE.md` et `../docs/DATABASE_SCHEMA.md`).

## Démarrage

1. Lancer PostgreSQL + pgAdmin (Docker, depuis la racine du projet) :
   ```
   docker compose up -d postgres pgadmin
   ```
   - PostgreSQL : `localhost:5432` (user `suivi` / password `suivi_password` / db `suivi_depenses`)
   - pgAdmin : http://localhost:5050 (login `admin@suivi-depenses.com` / `admin`)
     - Ajouter un serveur dans pgAdmin avec host `postgres` (nom du service docker), port `5432`.

2. Installer les dépendances et migrer :
   ```
   npm install
   npm run prisma:migrate
   ```

3. Démarrer l'API :
   ```
   npm run dev
   ```
   API sur http://localhost:4000, documentation Swagger sur http://localhost:4000/api/docs.

## Documentation API

Swagger UI : http://localhost:4000/api/docs
Spec OpenAPI brute (JSON) : http://localhost:4000/api/docs.json
