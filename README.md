# Work Tracking System

ระบบจัดการและติดตามงาน พร้อมฟอร์มสร้าง Purchase Request (PR)

## คุณสมบัติ

### 1. แดชบอร์ด (Dashboard)
- แสดงภาพรวมสถิติของงานทั้งหมด
- แสดงสถิติ Purchase Request
- แสดงรายการงานล่าสุด

### 2. ระบบติดตามงาน (Work Tracking)
- เพิ่ม แก้ไข ลบงาน
- กำหนดสถานะงาน (รอดำเนินการ, กำลังดำเนินการ, เสร็จสิ้น)
- กำหนดลำดับความสำคัญ (ต่ำ, ปานกลาง, สูง)
- กำหนดผู้รับผิดชอบและวันที่กำหนดส่ง
- ข้อมูลจัดเก็บใน Local Storage

### 3. ฟอร์มเปิด PR (Purchase Request)
- สร้าง PR พร้อมรายละเอียดสินค้า
- เพิ่มรายการสินค้าได้หลายรายการ
- คำนวณราคารวมอัตโนมัติ
- บันทึกร่างหรือส่ง PR
- ดูรายละเอียด PR ทั้งหมด
- ติดตามสถานะ PR (แบบร่าง, รออนุมัติ, อนุมัติแล้ว, ไม่อนุมัติ)

## เทคโนโลยีที่ใช้

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Local Storage** - Data Persistence

## การติดตั้งและรัน

### ติดตั้ง Dependencies

```bash
npm install
```

### รันโปรเจ็กต์ในโหมด Development

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

### Build สำหรับ Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## โครงสร้างโปรเจ็กต์

```
work-tracking-system/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Layout หลักพร้อม Navigation
│   ├── pages/
│   │   ├── Dashboard.tsx       # หน้าแดชบอร์ด
│   │   ├── WorkTracking.tsx    # หน้าระบบติดตามงาน
│   │   └── PurchaseRequest.tsx # หน้าฟอร์ม PR
│   ├── types.ts                # TypeScript Types
│   ├── App.tsx                 # Main App Component
│   ├── main.tsx                # Entry Point
│   └── index.css               # Global Styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## การใช้งาน

### เพิ่มงานใหม่
1. ไปที่เมนู "ติดตามงาน"
2. คลิก "เพิ่มงานใหม่"
3. กรอกข้อมูลงาน
4. คลิก "เพิ่มงาน"

### สร้าง Purchase Request
1. ไปที่เมนู "เปิด PR"
2. คลิก "สร้าง PR ใหม่"
3. กรอกข้อมูลผู้ขอและแผนก
4. เพิ่มรายการสินค้า
5. เลือก "บันทึกร่าง" หรือ "ส่ง PR"

## หมายเหตุ

- ข้อมูลทั้งหมดจัดเก็บใน Local Storage ของเบราว์เซอร์
- ไม่ต้องการฐานข้อมูลหรือ Backend
- เหมาะสำหรับการใช้งานส่วนตัวหรือการสาธิต

## License

MIT

