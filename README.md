# 🍎 Cal Count - Simple Calorie Tracker

แอปจดแคลอรี่แบบง่ายๆ สำหรับคนไทย พร้อมฟีเจอร์วิเคราะห์ InBody ด้วย AI

## ✨ คุณสมบัติ

### Core Features
- ✅ **AI Calorie Estimation** - พิมพ์แค่ชื่ออาหาร AI ประมาณแคลอรี่ให้
- ✅ **Full Nutrition Info** - Protein, Carbs, Fat, Fiber, Sugar, Sodium
- ✅ **ดูสรุปวันนี้** - แคลอรี่รวม + เป้าหมาย
- ✅ **ย้อนดูประวัติ** - ดูย้อนหลัง 30 วัน

### Advanced Features
- 📊 **Daily Nutrition Dashboard** - กราฟสรุปโภชนาการแบบละเอียด
- 🎯 **Macro Goals** - ตั้งเป้าหมาย Protein/Carbs/Fat พร้อม presets
- 🔔 **Smart Alerts** - แจ้งเตือนเมื่อ macro เกิน/ขาด/ครบเป้าหมาย
- 📸 **InBody Analysis** - Upload InBody report, get personalized recommendations
- 📚 **InBody History** - View and manage up to 10 previous analyses

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local` แล้วใส่ OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**หมายเหตุ:** ต้องมี OpenAI API key เพื่อใช้ฟีเจอร์วิเคราะห์ InBody  
สมัครได้ที่: https://platform.openai.com/api-keys

### 3. ตั้งค่า Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migration
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit database
npm run prisma:studio
```

### 4. รันโปรเจกต์

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

## 📸 วิธีใช้ InBody Feature

1. คลิกปุ่ม **"เป้าหมาย"** 🎯
2. คลิก **"อัพโหลด InBody"**
3. เลือกรูป InBody report
4. คลิก **"วิเคราะห์"**
5. รอ 10-30 วินาที
6. ดูผลลัพธ์และคลิก **"ใช้ค่านี้"**

📚 **คู่มือเพิ่มเติม:**
- [NUTRITION-DASHBOARD.md](./NUTRITION-DASHBOARD.md) - Dashboard และ Macro Goals
- [MACRO-ALERTS.md](./MACRO-ALERTS.md) - Alert System และการแจ้งเตือน
- [INBODY-FEATURE.md](./INBODY-FEATURE.md) - InBody Analysis คู่มือครบถ้วน
- [INBODY-QUICKSTART.md](./INBODY-QUICKSTART.md) - เริ่มใช้ใน 5 นาที

## 🛠 Tech Stack

- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **OpenAI GPT-4o Vision** - InBody Analysis
- **Prisma + SQLite** - Database (NEW! 🎉)
- ~~localStorage~~ - Migrated to Database

## 📱 การใช้งาน

### เพิ่มอาหาร
1. พิมพ์ชื่ออาหาร (เช่น "ข้าวผัดกะเพรา")
2. ใส่แคลอรี่
3. กดเพิ่ม ✅

### ตั้งเป้าหมาย
1. คลิกไอคอนเป้าหมาย 🎯
2. ใส่แคลอรี่ที่ต้องการต่อวัน
3. บันทึก

### ดูประวัติ
1. คลิกไอคอนประวัติ 📊
2. เลือกวันที่ต้องการดู

## 💡 คุณสมบัติเด่น

- 🇹🇭 **Thai-Optimized** - Works great with Thai food names and InBody reports
- 🎨 **Modern UI** - Clean, beautiful interface
- 📱 **Mobile-Friendly** - Works perfectly on all devices
- 💾 **Privacy First** - All data stored locally in your browser
- ⚡ **Fast & Simple** - No login required, start tracking immediately

## 🔐 ความเป็นส่วนตัว

- ข้อมูลทั้งหมดเก็บใน SQLite database ที่เครื่องคุณ (`prisma/dev.db`)
- ไม่มีการส่งข้อมูลไปเซิร์ฟเวอร์ภายนอก (ยกเว้น API OpenAI สำหรับวิเคราะห์ InBody)
- ไม่ต้องสมัครสมาชิกหรือเข้าสู่ระบบ

## 📦 Database Migration

อัปเกรดจาก localStorage เป็น Database แล้ว! ดูวิธีการ migrate ข้อมูลได้ที่:
- [PRISMA_MIGRATION_GUIDE.md](./PRISMA_MIGRATION_GUIDE.md)

## 💰 ค่าใช้จ่าย InBody Analysis

- ~0.60-1.20 บาท/ครั้ง (ใช้ OpenAI API)
- แนะนำ: วิเคราะห์ InBody ทุก 1-2 เดือน

## 📄 License

MIT

## 🙏 Credits

Built with ❤️ for Thai people who want to track their calories simply and effectively.
