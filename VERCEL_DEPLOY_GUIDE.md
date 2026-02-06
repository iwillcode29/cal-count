# 🚀 Vercel + Postgres Deployment Guide

## ✅ เตรียมโปรเจกต์เรียบร้อยแล้ว!

โปรเจกต์ถูกอัปเดตให้พร้อม deploy to Vercel แล้ว

### สิ่งที่เปลี่ยน:
- ✅ เปลี่ยน Prisma schema จาก SQLite → PostgreSQL
- ✅ ใช้ Neon adapter สำหรับ Prisma v7 + Vercel Postgres
- ✅ เพิ่ม postinstall script สำหรับ Vercel
- ✅ อัปเดต environment variables config
- ✅ รองรับทั้ง local dev และ production

## 📋 Step-by-Step Deployment

### Step 1: Commit Changes

```bash
# Add all changes
git add .

# Commit
git commit -m "feat: migrate to PostgreSQL for Vercel deployment"

# Push to GitHub
git push origin main
```

### Step 2: Install Vercel CLI (ถ้ายังไม่ได้ติดตั้ง)

```bash
npm i -g vercel
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: [ปล่อยว่างหรือใส่ชื่อ]
# - Directory: ./
# - Override settings? No
```

### Step 4: Add Vercel Postgres

1. เปิด https://vercel.com
2. ไปที่โปรเจกต์ที่เพิ่ง deploy
3. คลิก **Storage** tab
4. คลิก **Create Database**
5. เลือก **Postgres**
6. คลิก **Continue**
7. ตั้งชื่อ database (เช่น "cal-count-db")
8. เลือก region (แนะนำ: Singapore สำหรับไทย)
9. คลิก **Create**

### Step 5: Connect Database to Project

Vercel จะถามว่าต้องการ connect กับ project ไหน:
- เลือกโปรเจกต์ที่เพิ่ง deploy
- เลือก environment: **Production**, **Preview**, **Development** (เลือกหมด)
- คลิก **Connect**

Vercel จะเพิ่ม environment variables อัตโนมัติ:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 6: Run Database Migration

```bash
# Set environment variable (copy from Vercel dashboard)
export POSTGRES_PRISMA_URL="postgres://..."

# Run migration
npx prisma migrate deploy
```

หรือใช้ Vercel CLI:

```bash
# Connect to production
vercel env pull

# Run migration
npm run prisma:migrate:deploy
```

### Step 7: Redeploy

```bash
vercel --prod
```

### Step 8: เพิ่ม OpenAI API Key

1. ไปที่ Vercel dashboard
2. เลือกโปรเจกต์
3. Settings → Environment Variables
4. เพิ่ม:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-actual-api-key`
   - Environment: Production, Preview, Development

5. Redeploy อีกครั้ง:
```bash
vercel --prod
```

## ✅ เสร็จแล้ว!

โปรเจกต์จะมี URL แบบนี้:
```
https://your-project.vercel.app
```

## 🧪 ทดสอบการทำงาน

```bash
# Test API
curl https://your-project.vercel.app/api/settings?key=goal

# ควรได้ response:
# {"key":"goal","value":"2000"}
```

## 📊 ดูข้อมูลใน Database

### ผ่าน Vercel Dashboard
1. Storage → เลือก database
2. คลิก **Query** หรือ **Browse Data**

### ผ่าน Prisma Studio (Local)
```bash
# Pull environment variables
vercel env pull

# Open Prisma Studio
npm run prisma:studio
```

## 🔄 Development Workflow

### Local Development
```bash
# ใช้ SQLite ต่อ (ถ้าต้องการ)
DATABASE_URL="file:./dev.db" npm run dev

# หรือเชื่อม Vercel Postgres
vercel env pull
npm run dev
```

### Deploy Changes
```bash
git add .
git commit -m "your changes"
git push origin main

# Vercel auto-deploy!
```

## 💰 ค่าใช้จ่าย Vercel

### Free Tier ได้:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 60 hours Postgres compute/month
- ✅ 256 MB Postgres storage

### เกินขึ้น:
- Pro: $20/month
- Postgres: เริ่ม $10/month

สำหรับแอปนี้ free tier น่าจะพอใช้งานส่วนตัวได้นาน!

## 🐛 Troubleshooting

### ❌ Migration Failed
```bash
# Reset migrations
npx prisma migrate reset

# Deploy again
npx prisma migrate deploy
```

### ❌ Connection Error
- เช็คว่า `POSTGRES_PRISMA_URL` ถูกต้อง
- ตรวจสอบใน Vercel dashboard → Settings → Environment Variables

### ❌ Build Failed
```bash
# Check build logs in Vercel dashboard
# Usually it's:
# 1. Missing OPENAI_API_KEY
# 2. Prisma generate failed
```

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

**Need help?** ถามได้เลยครับ! 🙌
