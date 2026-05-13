# Booking Page – IDI Research Booking System

Prosta aplikacja webowa do rezerwacji terminów rozmów IDI (Individual Depth Interview) dla Profitia Management Consultants.

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Baza danych**: PostgreSQL (Neon) + Prisma ORM
- **Deploy**: Render (single Web Service)
- **Email**: Nodemailer (SMTP)

## Architektura

```
Booking page/
├── client/     # React + Vite frontend
├── server/     # Express API + serwuje statyczne pliki
├── prisma/     # Schema + migracje + seed
├── render.yaml # Konfiguracja Render
└── .env.example
```

## Setup lokalny

### Wymagania

- Node.js 20+
- npm 10+
- Dostęp do bazy PostgreSQL (Neon lub lokalna)

### Instalacja

```bash
git clone https://github.com/profitia/Booking-page.git
cd Booking-page
npm install
```

### Konfiguracja .env

```bash
cp .env.example .env
# Uzupełnij .env swoimi danymi
```

Wymagane zmienne:

```
DATABASE_URL=postgresql://...
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=
```

### Konfiguracja Neon

1. Utwórz projekt na [neon.tech](https://neon.tech) (konto Profitia)
2. Skopiuj Connection String do `DATABASE_URL` w `.env`
3. Uruchom migracje:

```bash
npx prisma migrate deploy
```

### Uruchomienie lokalne

Terminal 1 – backend:
```bash
npm run dev:server
```

Terminal 2 – frontend:
```bash
npm run dev:client
```

Frontend: http://localhost:5173 (proxy `/api` → `http://localhost:3000`)

### Seed slotów

Sloty generowane są automatycznie przy pierwszym uruchomieniu serwera (jeśli baza jest pusta).

Aby uruchomić seed ręcznie:
```bash
npm run db:seed
```

## Konfiguracja SMTP

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=twoj@email.pl
SMTP_PASS=haslo
SMTP_FROM="Profitia Research <twoj@email.pl>"
ADMIN_EMAIL=admin@profitia.pl
```

## Podmiana materiałów

- **PDF**: Umieść plik w `client/public/materials/informacja-o-badaniu.pdf`
- **Film YouTube**: Zmień URL w `client/src/components/Materials.tsx`

## Deploy Render

1. Utwórz nowy **Web Service** na [render.com](https://render.com) (konto Profitia)
2. Podłącz repozytorium `profitia/Booking-page`
3. Render automatycznie wykryje `render.yaml`

### Zmienne środowiskowe na Render

W panelu Render → Environment → ustaw wszystkie zmienne z `.env.example`.

### Co robi Render automatycznie

1. `npm install` — instaluje wszystkie workspace'y + generuje Prisma Client
2. `npx prisma migrate deploy` — migruje bazę danych
3. `npm run build` — buduje frontend (Vite)
4. `npm start` — uruchamia serwer Express

## Prisma

Lokalne tworzenie nowej migracji:
```bash
npx prisma migrate dev --name nazwa_migracji
```

Aplikowanie na produkcji:
```bash
npx prisma migrate deploy
```

## Ważne

- Brak logowania i panelu admina — celowo (MVP)
- Powiadomienia o rezerwacjach trafiają na `ADMIN_EMAIL`
- Zarezerwowane sloty są zablokowane i nie można ich wybrać ponownie
- Aplikacja uruchamiana jako jeden Web Service na Render (Express serwuje build React)
