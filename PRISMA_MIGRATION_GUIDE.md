# Prisma Migration Guide

โปรเจกต์นี้ได้ถูกอัปเกรดให้ใช้ **Prisma + SQLite Database** แทน localStorage แล้ว! 🎉

## สิ่งที่เปลี่ยนแปลง

### เดิม (localStorage)
- ข้อมูลถูกเก็บใน browser localStorage
- ข้อมูลจะหายเมื่อลบ browser data
- ไม่สามารถ sync ข้อมูลข้าม device ได้

### ใหม่ (Prisma + SQLite)
- ข้อมูลถูกเก็บใน SQLite database (`prisma/dev.db`)
- ข้อมูลถาวร persistent บน server
- พร้อมสำหรับการ deploy production
- สามารถขยายเป็น PostgreSQL/MySQL ได้ในอนาคต

## โครงสร้าง Database

### Tables
1. **FoodEntry** - รายการอาหารแต่ละมื้อ
   - id, name, calories, meal, date, nutrition info
   
2. **UserSettings** - การตั้งค่าผู้ใช้
   - goal (เป้าหมายแคลอรี่)
   - macro_goals (เป้าหมายโภชนาการ)
   
3. **InBodyAnalysis** - ผลวิเคราะห์ InBody
   - ข้อมูลร่างกายทั้งหมดจากการ upload และวิเคราะห์

## การใช้งาน

### Development

```bash
# ติดตั้ง dependencies (ถ้ายังไม่ได้ทำ)
npm install

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start dev server
npm run dev

# เปิด Prisma Studio (GUI สำหรับดู/แก้ไข database)
npm run prisma:studio
```

### Production Build

```bash
npm run build
npm start
```

## API Routes

### Food Entries
- `GET /api/food-entries?date=YYYY-MM-DD` - ดึงรายการอาหารตามวันที่
- `POST /api/food-entries` - เพิ่มรายการอาหารใหม่
- `PUT /api/food-entries` - แก้ไขรายการอาหาร
- `DELETE /api/food-entries?id=xxx` - ลบรายการอาหาร

### Settings
- `GET /api/settings?key=goal` - ดึงการตั้งค่า
- `POST /api/settings` - บันทึกการตั้งค่า

### InBody Analysis
- `GET /api/inbody` - ดึงประวัติ InBody
- `POST /api/inbody` - บันทึกผลวิเคราะห์ใหม่
- `DELETE /api/inbody?id=xxx` - ลบผลวิเคราะห์

### History
- `GET /api/history?limit=30` - ดึงวันที่มีข้อมูล

## Migration จาก localStorage

⚠️ **สำคัญ**: ข้อมูลเก่าใน localStorage จะไม่ถูก migrate อัตโนมัติ

หากต้องการเก็บข้อมูลเก่า มี 2 ทางเลือก:

### ทางเลือกที่ 1: Export/Import Manual
1. ก่อนอัปเดต: เปิด browser console และรัน:
```javascript
// Export data
const data = {
  goal: localStorage.getItem('calcount_goal'),
  macroGoals: localStorage.getItem('calcount_macro_goals'),
  inbody: localStorage.getItem('calcount_inbody_history'),
  days: {}
};

// Export all day data
for (let i = 0; i < 60; i++) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split('T')[0];
  const dayData = localStorage.getItem(`calcount_${dateStr}`);
  if (dayData) {
    data.days[dateStr] = dayData;
  }
}

console.log(JSON.stringify(data, null, 2));
// Copy output และบันทึกเป็นไฟล์
```

2. หลังอัปเดต: สามารถใช้ Prisma Studio หรือเขียน script import เข้า database

### ทางเลือกที่ 2: ใช้ทั้ง 2 ระบบควบคู่กัน
- `lib/storage.ts` = localStorage (เก่า)
- `lib/storageDb.ts` = Prisma Database (ใหม่)

ปัจจุบันโปรเจกต์ใช้ `lib/storageDb.ts` แล้ว แต่คุณสามารถสลับกลับไปใช้ `lib/storage.ts` ได้ชั่วคราว

## การปรับแต่ง Database Schema

หากต้องการแก้ไข database schema:

1. แก้ไขไฟล์ `prisma/schema.prisma`
2. Run migration:
```bash
npx prisma migrate dev --name describe_your_changes
```
3. Generate Prisma Client ใหม่:
```bash
npx prisma generate
```

## Deploy to Production

### Option 1: Vercel (แนะนำ)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. เปลี่ยน database เป็น PostgreSQL:
   - เพิ่ม Vercel Postgres
   - แก้ไข `datasource db` ใน `schema.prisma`
   - Run migration: `npx prisma migrate deploy`

### Option 2: Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## Backup Database

```bash
# Backup
cp prisma/dev.db prisma/dev.db.backup

# Restore
cp prisma/dev.db.backup prisma/dev.db
```

## ปัญหาที่อาจพบ

### ❌ "Database dev.db does not exist"
**วิธีแก้**: Run `npx prisma migrate dev`

### ❌ "PrismaClient is unable to run in this browser environment"
**สาเหตุ**: พยายามใช้ PrismaClient ใน client component
**วิธีแก้**: ใช้ API routes แทน (ซึ่งโปรเจกต์นี้ทำแล้ว)

### ❌ "Failed to fetch" หรือ API errors
**เช็ค**:
1. Dev server กำลังรันอยู่หรือไม่ (`npm run dev`)
2. Database file มีอยู่หรือไม่ (`prisma/dev.db`)
3. เปิด browser console ดู error details

## เพิ่มเติม

### Prisma Studio
Prisma Studio คือ GUI tool สำหรับดู/แก้ไข database:
```bash
npm run prisma:studio
```
จะเปิด browser ที่ `http://localhost:5555`

### Database File Location
- Development: `prisma/dev.db`
- ไฟล์นี้ถูก ignore ใน git (`.gitignore`)
- ควร backup เป็นประจำ

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js with Prisma](https://www.prisma.io/nextjs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

สร้างโดย AI Assistant 🤖
Last updated: February 6, 2026
