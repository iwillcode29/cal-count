# 🚨 Quick Fix: Database Connection Error

## ปัญหา
API ใช้งานไม่ได้เพราะ Vercel ยังไม่มี Database Connection

## แก้ไขใน 3 ขั้นตอน

### 1️⃣ เพิ่ม Vercel Postgres Database

ไปที่: https://vercel.com/iwillcodes-projects/cal-count

1. คลิก **"Storage"** tab
2. คลิก **"Create Database"**
3. เลือก **"Postgres"**
4. คลิก **"Continue"**
5. เลือก region: **"Singapore (sin1)"** (ใกล้บ้านเรา)
6. คลิก **"Create"**
7. **Connect to Project** → เลือก `cal-count` → **"Connect"**

✅ Vercel จะเพิ่ม environment variables อัตโนมัติ:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 2️⃣ Redeploy Application

หลังจาก connect database แล้ว:

1. ไปที่ **Deployments** tab
2. คลิกที่ deployment ล่าสุด
3. คลิก **"..."** → **"Redeploy"**
4. คลิก **"Redeploy"** อีกครั้งเพื่อยืนยัน

### 3️⃣ เพิ่ม OpenAI API Key (สำหรับ InBody Analysis)

1. ไปที่: https://vercel.com/iwillcodes-projects/cal-count/settings/environment-variables
2. คลิก **"Add New"**
3. ใส่:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (ใช้ API key จาก .env.local)
   - **Environment**: เลือกทั้งหมด (Production, Preview, Development)
4. คลิก **"Save"**
5. **Redeploy** อีกครั้ง

## ✅ เสร็จแล้ว!

ลองเปิด app อีกครั้ง:
- https://cal-count-psi.vercel.app

---

## หมายเหตุ

**อย่าลืม!** หลังจาก setup Vercel Postgres แล้ว:
- Tables จะถูกสร้างอัตโนมัติจาก `postinstall` script
- ถ้า tables ยังไม่มี ให้ redeploy อีกครั้ง
