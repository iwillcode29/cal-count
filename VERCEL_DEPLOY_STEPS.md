# 🚀 Vercel Deployment - Quick Steps

## สำคัญ! อ่านก่อน Deploy

ตอนนี้โปรเจกต์แก้ไขให้ **build ได้แม้ยังไม่มี database**  
แต่ต้อง **เพิ่ม Vercel Postgres ทันทีหลัง deploy** ถึงจะใช้งานได้

---

## 🎯 ขั้นตอนที่ 1: Deploy to Vercel

### 1. Login to Vercel

```bash
# ถ้ายังไม่ได้ติดตั้ง Vercel CLI
npm install -g vercel

# Login
vercel login
```

### 2. Deploy

```bash
vercel
```

**ตอบคำถาม:**
- `Set up and deploy?` → **Y (Yes)**
- `Which scope?` → เลือก account ของคุณ
- `Link to existing project?` → **N (No)**
- `Project name?` → **cal-count** (หรือชื่ออื่น)
- `Directory?` → **./** (กด Enter)
- `Override settings?` → **N (No)**

รอ deploy เสร็จ... จะได้ URL:
```
https://cal-count-xxx.vercel.app
```

⚠️ **แอปยังใช้งานไม่ได้ เพราะยังไม่มี database!**

---

## 🎯 ขั้นตอนที่ 2: เพิ่ม Vercel Postgres (สำคัญมาก!)

### 1. เปิด Vercel Dashboard

```
https://vercel.com/dashboard
```

### 2. เลือกโปรเจกต์ที่เพิ่ง deploy

คลิกที่ **cal-count** (หรือชื่อที่ตั้ง)

### 3. ไปที่แท็บ Storage

คลิกแท็บ **Storage** ด้านบน

### 4. Create Database

1. คลิก **Create Database**
2. เลือก **Postgres**
3. คลิก **Continue**

### 5. ตั้งค่า Database

- **Database Name**: `cal-count-db` (หรือชื่ออื่น)
- **Region**: **Singapore** (ใกล้ไทยที่สุด)
- คลิก **Create**

รอสร้าง database... (ประมาณ 10-30 วินาที)

### 6. Connect to Project

หลังสร้างเสร็จ Vercel จะถาม:

**"Connect this database to a project?"**

- เลือกโปรเจกต์: **cal-count**
- เลือก Environment: 
  - ✅ **Production**
  - ✅ **Preview**
  - ✅ **Development**
- คลิก **Connect**

Vercel จะเพิ่ม environment variables อัตโนมัติ:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

---

## 🎯 ขั้นตอนที่ 3: Run Database Migration

### ทางเลือก A: ผ่าน Vercel CLI (แนะนำ)

```bash
# 1. Pull environment variables
vercel env pull .env.local

# 2. Run migration
npx prisma migrate deploy

# เสร็จแล้ว!
```

### ทางเลือก B: ผ่าน Vercel Dashboard

1. ไปที่ **Settings** → **Environment Variables**
2. Copy ค่า `POSTGRES_PRISMA_URL`
3. ใน terminal:

```bash
export POSTGRES_PRISMA_URL="postgres://..."
npx prisma migrate deploy
```

---

## 🎯 ขั้นตอนที่ 4: เพิ่ม OpenAI API Key

### 1. ไปที่ Environment Variables

Vercel Dashboard → **Settings** → **Environment Variables**

### 2. เพิ่ม Variable ใหม่

คลิก **Add New** แล้วกรอก:

- **Name**: `OPENAI_API_KEY`
- **Value**: `sk-your-actual-api-key`
- **Environments**: เลือกทั้ง 3
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

### 3. Save

คลิก **Save**

---

## 🎯 ขั้นตอนที่ 5: Redeploy

ต้อง redeploy เพื่อให้แอปใช้ environment variables ใหม่:

```bash
vercel --prod
```

หรือใน Vercel Dashboard:
1. ไปที่แท็บ **Deployments**
2. คลิก **...** ที่ deployment ล่าสุด
3. เลือก **Redeploy**

---

## ✅ เสร็จแล้ว! ทดสอบแอป

### 1. เปิดแอป

```
https://cal-count-xxx.vercel.app
```

### 2. ทดสอบ API

```bash
curl https://your-project.vercel.app/api/settings?key=goal
```

ควรได้:
```json
{"key":"goal","value":"2000"}
```

### 3. ทดสอบใช้งาน

- ✅ เพิ่มรายการอาหาร
- ✅ ตั้ง goal
- ✅ ดูประวัติ
- ✅ Upload InBody (ต้องมี OpenAI API key)

---

## 🔄 Auto-Deploy

จากนี้ทุกครั้งที่ push to GitHub:
```bash
git push origin main
```

→ Vercel จะ **auto-deploy** ให้อัตโนมัติ! 🎉

---

## 🐛 Troubleshooting

### ❌ "Failed to fetch" หรือ API errors

**สาเหตุ**: Database ยังไม่ได้ setup หรือ migration ยังไม่ run

**แก้ไข**:
```bash
vercel env pull .env.local
npx prisma migrate deploy
vercel --prod
```

### ❌ "Connection refused"

**สาเหตุ**: Environment variables ไม่ถูกต้อง

**แก้ไข**:
1. เช็ค Settings → Environment Variables
2. ตรวจสอบ `POSTGRES_PRISMA_URL` มีค่าถูกต้อง
3. Redeploy

### ❌ InBody analysis ไม่ทำงาน

**สาเหตุ**: ไม่มี `OPENAI_API_KEY`

**แก้ไข**:
1. เพิ่ม `OPENAI_API_KEY` ใน environment variables
2. Redeploy

---

## 💰 ค่าใช้จ่าย

### Vercel Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ **Postgres**: 60 hours compute + 256 MB storage

### เกินขึ้น:
- Pro: $20/month (unlimited bandwidth)
- Postgres: เริ่ม $10/month

**สำหรับใช้งานส่วนตัว: Free tier เพียงพอ!** 👍

---

## 📱 Local Development

หลัง deploy แล้ว สามารถ dev ในเครื่องด้วย Vercel Postgres:

```bash
# 1. Pull env variables
vercel env pull .env.local

# 2. Run dev server
npm run dev
```

---

## 🎊 เสร็จสมบูรณ์!

ตอนนี้คุณมี:
- ✅ แอป Next.js ที่ deploy บน Vercel
- ✅ Database ที่ใช้ Vercel Postgres
- ✅ Auto-deploy จาก GitHub
- ✅ HTTPS และ CDN ฟรี
- ✅ URL สวย ๆ

**แอปพร้อมใช้งานแล้ว!** 🚀

---

มีคำถามหรือติดปัญหา? บอกได้เลย! 🙌
