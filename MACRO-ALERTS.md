# 🔔 Macro Goals Alerts & Notifications

## ✨ ภาพรวม

ระบบแจ้งเตือนอัจฉริยะที่ช่วยติดตามความคืบหน้า Macro Goals แบบ real-time พร้อมแจ้งเตือนเมื่อเกินหรือขาดเป้าหมาย

---

## 🎯 คุณสมบัติ

### 1. **Smart Alerts**
แจ้งเตือนอัตโนมัติตาม progress:
- ✅ **ครบเป้าหมาย** - เมื่อถึง 100-110%
- ⚠️ **เกินเป้าหมาย** - เมื่อเกิน 110%
- 🚨 **ขาดมาก** - เมื่อต่ำกว่า 50%

### 2. **Visual Indicators**
แสดงสถานะบนการ์ด Macro:
- **Status Icons:**
  - ✅ = ครบแล้ว (100%+)
  - 👍 = ใกล้ครบ (80-99%)
  - ⏳ = กำลังไป (50-79%)
  - ⚠️ = น้อยไป (<50%)

- **Color Coding:**
  - 🟢 เขียว = ครบเป้าหมาย (100-110%)
  - 🟡 เหลือง = ใกล้เคียง (80-99%)
  - 🟠 ส้ม = ยังขาด (<80%)
  - 🔴 แดง = เกินเป้า (>110%)

### 3. **Dismissible Alerts**
- กดปิดได้ทีละรายการ
- จำสถานะที่ปิดไปแล้ว
- ไม่แสดงซ้ำในวันเดียวกัน

### 4. **Daily Summary**
- แสดงสรุปท้ายวัน
- เปรียบเทียบกับเป้าหมาย
- ข้อความกำลังใจ

---

## 📱 ตัวอย่างการใช้งาน

### Scenario 1: เพิ่มกล้ามเนื้อ 🏋️

**เป้าหมาย:**
- Protein: 150g
- Carbs: 250g
- Fat: 65g

**เวลา 12:00 น. (กินไป 50%)**
```
⏳ โปรตีนน้อยไป! เหลือ 75g 🚨
```

**เวลา 18:00 น. (กินไป 90%)**
```
👍 ใกล้ครบแล้ว! โปรตีน 135g / 150g
```

**เวลา 20:00 น. (กินครบ)**
```
✅ ยอดเยี่ยม! โปรตีนครบ 150g แล้ว 🎯
```

**กินเกินเป้า**
```
⚠️ โปรตีนเกินเป้า 165g / 150g ⚠️
```

---

### Scenario 2: Low Carb Diet 🥗

**เป้าหมาย:**
- Protein: 120g
- Carbs: 50g (ต่ำ)
- Fat: 80g

**เช้า (กินคาร์บ 45g)**
```
👍 คาร์บใกล้ครบ 45g / 50g
```

**กลางวัน (กินคาร์บเพิ่ม 15g = รวม 60g)**
```
⚠️ คาร์บเกินเป้า 60g / 50g ⚠️
แนะนำ: หลีกเลี่ยงคาร์บมื้อเย็น
```

---

### Scenario 3: สมบูรณ์แบบ 🎉

**เมื่อครบทุก Macro (100-110%)**
```
┌─────────────────────────┐
│  🎉 สมบูรณ์แบบ!         │
│  ครบทุก macro แล้ว      │
│                          │
│  💪 โปรตีน: 148g/150g   │
│  🍚 คาร์บ: 245g/250g    │
│  🥑 ไขมัน: 63g/65g      │
│                          │
│  เยี่ยมมาก! ✨           │
└─────────────────────────┘
```

---

## 🎨 Visual Examples

### การ์ด Macro กับ Status

```
┌──────────────────┐
│ โปรตีน        ✅ │  ← Status Icon
│                  │
│   145g           │  ← Current
│   จาก 150g      │  ← Goal
│                  │
│ ████████████░░   │  ← Progress Bar (green)
│ 97% ครบแล้ว      │  ← Status Text
└──────────────────┘
```

```
┌──────────────────┐
│ คาร์บ         ⚠️ │  ← Warning Icon
│                  │
│   280g           │  ← Over goal!
│   จาก 250g      │
│                  │
│ ██████████████   │  ← Progress Bar (red)
│ 112% เกิน!       │  ← Warning Text
└──────────────────┘
```

---

## 🔔 Alert Types

### 1. Success Alert (เขียว)
```
✅ ยอดเยี่ยม! โปรตีนครบ 150g แล้ว 🎯
```
- แสดงเมื่อ: 100% ≤ progress < 110%
- สี: เขียว (#4CAF82)
- Action: เป็นกำลังใจ

### 2. Warning Alert (ส้ม)
```
⚠️ คาร์บเกินเป้า 280g / 250g ⚠️
```
- แสดงเมื่อ: progress ≥ 110%
- สี: ส้ม (#D4725C)
- Action: แจ้งเตือนระวัง

### 3. Danger Alert (แดง)
```
🚨 โปรตีนน้อยไป! เหลือ 100g 🚨
```
- แสดงเมื่อ: progress < 50%
- สี: แดง (#C75B7A)
- Action: เร่งด่วน!

---

## ⚙️ การทำงาน

### Alert Logic

```javascript
// Success: 100-110%
if (current >= goal && current < goal * 1.1) {
  show "ครบแล้ว ✅"
}

// Warning: >110%
if (current >= goal * 1.1) {
  show "เกินเป้า ⚠️"
}

// Danger: <50%
if (current < goal * 0.5) {
  show "น้อยไป 🚨"
}
```

### Visual Status

```javascript
// Icon based on percentage
percentage >= 100 → ✅
percentage >= 80  → 👍
percentage >= 50  → ⏳
percentage < 50   → ⚠️

// Color based on percentage
percentage >= 110 → 🔴 Red (over)
percentage >= 100 → 🟢 Green (perfect)
percentage >= 80  → 🟡 Yellow (close)
percentage < 80   → 🟠 Orange (low)
```

---

## 📊 Use Cases

### คนเล่นกล้าม (150g โปรตีน/วัน)

**เช้า 7:00 (20g)**
```
⚠️ โปรตีนน้อยไป! เหลือ 130g 🚨
```

**กลางวัน 12:00 (+40g = 60g รวม)**
```
⏳ โปรตีน 60g / 150g (40%)
```

**ว่าง 15:00 (+30g = 90g รวม)**
```
⏳ โปรตีน 90g / 150g (60%)
```

**เย็น 19:00 (+45g = 135g รวม)**
```
👍 ใกล้ครบ! โปรตีน 135g / 150g (90%)
```

**ก่อนนอน (+20g = 155g รวม)**
```
✅ ยอดเยี่ยม! โปรตีนครบ 155g แล้ว 🎯
```

---

### Low Carb Diet (50g คาร์บ/วัน)

**เช้า 7:00 (15g)**
```
⏳ คาร์บ 15g / 50g (30%)
```

**กลางวัน 12:00 (+25g = 40g รวม)**
```
👍 คาร์บ 40g / 50g (80%)
```

**เย็น 19:00 (+8g = 48g รวม)**
```
👍 คาร์บ 48g / 50g (96%)
```

**ถ้ากินเกิน (+15g = 63g รวม)**
```
⚠️ คาร์บเกินเป้า 63g / 50g (126%) ⚠️
หยุดกินคาร์บวันนี้!
```

---

## 🎯 Benefits

### สำหรับ Users
1. ✅ รู้ว่าต้องกินอะไรเพิ่ม
2. ✅ ไม่กินเกินโดยไม่รู้ตัว
3. ✅ ติดตามง่ายตลอดวัน
4. ✅ มีกำลังใจเมื่อทำได้

### สำหรับ Goals
- **Muscle Building** - แน่ใจว่าได้โปรตีนพอ
- **Weight Loss** - ไม่กินคาร์บเกิน
- **Keto** - คุมคาร์บแน่นหนา
- **Balanced** - สมดุลทุกวัน

---

## 💾 Technical Details

### Files
```
app/
  components/
    MacroAlert.tsx                    # Alert notifications
    DailySummaryNotification.tsx      # End-of-day summary
    NutritionDashboard.tsx            # Visual indicators
```

### State Management
- Alerts จัดการโดย `useState`
- Dismissed alerts เก็บใน `Set<string>`
- Reset ทุกวัน (ไม่เก็บใน localStorage)

### Performance
- Real-time updates
- Efficient re-rendering
- Auto-dismiss after 8 seconds
- Smooth animations

---

## 🚀 การใช้งานจริง

### Setup
1. เพิ่มอาหาร → Dashboard แสดงอัตโนมัติ
2. เห็น progress bars และ status icons
3. Alerts แสดงเมื่อถึง threshold
4. กดปิดได้ถ้าไม่ต้องการเห็น

### Tips
- ✅ เช็ค Dashboard เป็นระยะ
- ✅ ปรับอาหารตาม alerts
- ✅ ใช้ presets ที่เหมาะกับเป้าหมาย
- ✅ ติดตามทุกวันสม่ำเสมอ

---

## 📈 Future Enhancements

### Phase 2
- [ ] Push notifications (ถ้าทำ PWA)
- [ ] Reminder notifications
- [ ] Weekly summary
- [ ] Trend analysis

### Phase 3
- [ ] Smart recommendations
- [ ] Meal suggestions based on remaining macros
- [ ] Custom alert thresholds
- [ ] Sound/vibration options

---

## 🎯 Summary

Macro Goals Alerts ช่วยให้:
- ✅ ติดตามความคืบหน้าแบบ real-time
- ✅ แจ้งเตือนเมื่อเกินหรือขาด
- ✅ มี visual indicators ชัดเจน
- ✅ เพิ่มโอกาสสำเร็จในการบรรลุเป้าหมาย

**ทำให้ tracking macros ง่ายและสนุกขึ้น!** 🎉
