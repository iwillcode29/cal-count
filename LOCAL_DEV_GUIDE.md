# 💻 Local Development Guide

## 🎯 การ Dev ในเครื่อง (Local)

เนื่องจากตอนนี้โปรเจกต์ใช้ PostgreSQL + Neon adapter แล้ว มี 2 ทางเลือกสำหรับ dev:

---

## ตัวเลือก 1: ใช้ Vercel Postgres (แนะนำ) ⭐

ใช้ database เดียวกับ production ทำให้ไม่มีปัญหา database ไม่ตรงกัน

### Setup

```bash
# 1. Pull environment variables จาก Vercel
vercel env pull .env.local

# 2. Run dev server
npm run dev
```

ไฟล์ `.env.local` จะมีหน้าตาแบบนี้:
```env
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
OPENAI_API_KEY="sk-..."
```

### ข้อดี:
- ✅ ใช้ database จริง
- ✅ ไม่ต้องติดตั้งอะไรเพิ่ม
- ✅ ข้อมูลเดียวกับ production

### ข้อเสี้ย:
- ⚠️ ต้องมี internet
- ⚠️ ใช้ quota Vercel Postgres

---

## ตัวเลือก 2: ใช้ Local PostgreSQL

ติดตั้ง Postgres ในเครื่อง

### macOS (ใช้ Postgres.app)

1. Download: https://postgresapp.com/
2. เปิด Postgres.app
3. สร้าง database:
```bash
createdb calcount_dev
```

4. สร้าง `.env.local`:
```env
DATABASE_URL="postgresql://localhost:5432/calcount_dev"
OPENAI_API_KEY="sk-your-key"
```

5. Run migration:
```bash
npx prisma migrate dev
```

6. Run dev server:
```bash
npm run dev
```

### ใช้ Docker

```bash
# Start Postgres
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=calcount_dev \
  -p 5432:5432 \
  -d postgres:16

# สร้าง .env.local
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/calcount_dev"' > .env.local

# Run migration
npx prisma migrate dev

# Run dev server
npm run dev
```

---

## ตัวเลือก 3: SQLite (สำหรับ dev เท่านั้น)

ถ้าไม่อยากติดตั้ง Postgres

### Setup

1. แก้ `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
}
```

2. สร้าง `.env.local`:
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-your-key"
```

3. แก้ `lib/db.ts` (ลบ Neon adapter):
```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

4. Run migration:
```bash
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

5. Run dev server:
```bash
npm run dev
```

⚠️ **หมายเหตุ**: เมื่อ deploy ต้องเปลี่ยนกลับเป็น PostgreSQL!

---

## 🔧 Troubleshooting

### ❌ "No DATABASE_URL found"

ตรวจสอบ `.env.local`:
```bash
cat .env.local
```

ควรมี `DATABASE_URL` หรือ `POSTGRES_PRISMA_URL`

### ❌ Connection refused

**ถ้าใช้ Vercel Postgres:**
- เช็ค internet connection
- ลอง `vercel env pull .env.local` ใหม่

**ถ้าใช้ local Postgres:**
- ตรวจสอบว่า Postgres รันอยู่: `pg_isready`
- เช็ค port: `lsof -i :5432`

### ❌ Migration failed

```bash
# Reset database
npx prisma migrate reset

# Apply migrations
npx prisma migrate dev
```

---

## 📊 View Database

### Prisma Studio (GUI)

```bash
npm run prisma:studio
```

เปิด browser ที่ http://localhost:5555

### psql (CLI)

```bash
# Connect to local database
psql -d calcount_dev

# หรือ Vercel Postgres
psql "postgres://..."
```

---

## 🎯 แนะนำ

**สำหรับ personal project:**
→ ใช้ **Vercel Postgres** (ตัวเลือก 1)
- ง่าย ไม่ต้องติดตั้งอะไร
- Database เดียวกับ production

**สำหรับ team project:**
→ ใช้ **Docker PostgreSQL** (ตัวเลือก 2)
- แยก dev/production ชัดเจน
- ไม่กิน quota production

---

## 📚 Resources

- [Prisma Local Development](https://www.prisma.io/docs/guides/development-environment)
- [Postgres.app](https://postgresapp.com/)
- [Docker Postgres](https://hub.docker.com/_/postgres)

---

**Need help?** ถามได้เลยครับ! 🙌
