# Work Management System

ระบบจัดการและติดตามงาน พร้อมฟอร์มสร้าง Purchase Request (PR) พร้อม Backend API และ SQL Server Database

## 🎯 คุณสมบัติ

### 1. แดชบอร์ด (Dashboard)
- แสดงภาพรวมสถิติของงานทั้งหมด
- แสดงสถิติ Purchase Request
- แสดงรายการงานล่าสุด
- ปฏิทินงาน

### 2. ระบบติดตามงาน (Work Tracking)
- เพิ่ม แก้ไข ลบงาน
- กำหนดสถานะงาน (รอดำเนินการ, กำลังดำเนินการ, เสร็จสิ้น)
- กำหนดลำดับความสำคัญ (ต่ำ, ปานกลาง, สูง)
- กำหนดผู้รับผิดชอบและวันที่กำหนดส่ง
- **ข้อมูลจัดเก็บใน SQL Server Database**

### 3. ฟอร์มเปิด PR (Purchase Request)
- สร้าง PR พร้อมรายละเอียดสินค้า
- เพิ่มรายการสินค้าได้หลายรายการ
- คำนวณราคารวมอัตโนมัติ
- บันทึกร่างหรือส่ง PR
- ดูรายละเอียด PR ทั้งหมด
- ติดตามสถานะ PR (แบบร่าง, รออนุมัติ, อนุมัติแล้ว, ไม่อนุมัติ)
- **ข้อมูลจัดเก็บใน SQL Server Database**

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **mssql** - SQL Server Driver
- **CORS** - Cross-Origin Resource Sharing

### Database
- **SQL Server 2016+** - Relational Database

## 📋 ความต้องการของระบบ

- Node.js v14+
- npm หรือ yarn
- SQL Server 2016+
- SQL Server Management Studio (SSMS) หรือ Azure Data Studio (แนะนำ)

## 🚀 การติดตั้งและรัน

### 1️⃣ Clone โปรเจค

```bash
git clone https://github.com/funnyprom/work-management-system.git
cd work-management-system
```

### 2️⃣ ตั้งค่า Database

**ขั้นตอนที่ 1: สร้าง Database และ Tables**

เปิด SQL Server Management Studio (SSMS) และรัน script:

```bash
# ใช้ SSMS เปิดไฟล์ database/schema.sql และรัน
# หรือใช้คำสั่ง
sqlcmd -S localhost -U your_username -P your_password -i database/schema.sql
```

**ขั้นตอนที่ 2: ตรวจสอบการสร้าง Database**

```sql
USE WorkManagementDB;
SELECT * FROM Tasks;
SELECT * FROM PurchaseRequests;
SELECT * FROM Departments;
SELECT * FROM Users;
```

### 3️⃣ ตั้งค่า Backend API

**ขั้นตอนที่ 1: ติดตั้ง Dependencies**

```bash
cd server
npm install
```

**ขั้นตอนที่ 2: สร้างไฟล์ `.env`**

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/`:

```env
# SQL Server Configuration
DB_SERVER=localhost
DB_PORT=1433
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Server Configuration
PORT=3001
NODE_ENV=development
```

**ขั้นตอนที่ 3: รัน Backend Server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server จะเริ่มที่: `http://localhost:3001`

### 4️⃣ ตั้งค่า Frontend

**ขั้นตอนที่ 1: กลับไปที่ root directory**

```bash
cd ..
```

**ขั้นตอนที่ 2: ติดตั้ง Dependencies**

```bash
npm install
```

**ขั้นตอนที่ 3: สร้างไฟล์ `.env`**

สร้างไฟล์ `.env` ใน root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

**ขั้นตอนที่ 4: รัน Frontend**

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่: `http://localhost:5173`

## 📂 โครงสร้างโปรเจ็กต์

```
work-management-system/
├── database/
│   └── schema.sql              # Database schema และ sample data
├── server/
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── routes/
│   │   ├── tasks.js            # Tasks API endpoints
│   │   ├── purchaseRequests.js # PR API endpoints
│   │   ├── departments.js      # Departments API endpoints
│   │   └── users.js            # Users API endpoints
│   ├── .env                    # Environment variables (สร้างเอง)
│   ├── server.js               # Main server file
│   ├── package.json
│   └── README.md
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Layout หลัก
│   │   └── Calendar.tsx        # ปฏิทิน
│   ├── pages/
│   │   ├── Dashboard.tsx       # หน้าแดชบอร์ด
│   │   ├── WorkTracking.tsx    # หน้าระบบติดตามงาน
│   │   └── PurchaseRequest.tsx # หน้าฟอร์ม PR
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── types.ts                # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Frontend environment variables (สร้างเอง)
├── README.md
├── package.json
└── vite.config.ts
```

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - ดึงรายการงานทั้งหมด
- `GET /api/tasks/:id` - ดึงข้อมูลงานตาม ID
- `POST /api/tasks` - สร้างงานใหม่
- `PUT /api/tasks/:id` - แก้ไขงาน
- `DELETE /api/tasks/:id` - ลบงาน
- `GET /api/tasks/stats/summary` - ดึงสถิติงาน

### Purchase Requests
- `GET /api/purchase-requests` - ดึงรายการ PR ทั้งหมด
- `GET /api/purchase-requests/:id` - ดึงข้อมูล PR ตาม ID
- `POST /api/purchase-requests` - สร้าง PR ใหม่
- `PUT /api/purchase-requests/:id` - แก้ไข PR
- `DELETE /api/purchase-requests/:id` - ลบ PR
- `GET /api/purchase-requests/stats/summary` - ดึงสถิติ PR

### Departments & Users
- `GET /api/departments` - ดึงรายการแผนก
- `GET /api/users` - ดึงรายการผู้ใช้

### Health Check
- `GET /api/health` - ตรวจสอบสถานะ API

## 🐛 การแก้ปัญหา

### ไม่สามารถเชื่อมต่อ Database

1. ตรวจสอบว่า SQL Server กำลังทำงานอยู่
2. ตรวจสอบ username/password ในไฟล์ `.env`
3. ตรวจสอบว่า SQL Server ยอมรับ TCP/IP connections
4. ตรวจสอบ Firewall settings

### Port ถูกใช้งานแล้ว

เปลี่ยน PORT ในไฟล์ `.env`:
```env
PORT=3002  # สำหรับ backend
```

หรือ
```env
VITE_PORT=5174  # สำหรับ frontend
```

### ข้อมูลไม่แสดง

1. ตรวจสอบว่า backend server กำลังทำงานอยู่ที่ port 3001
2. เปิด Developer Console (F12) เพื่อดู error messages
3. ตรวจสอบว่าไฟล์ `.env` ถูกตั้งค่าถูกต้อง

## 📝 Fallback Mode

ระบบมี **Fallback Mode** ที่จะใช้ Local Storage เมื่อไม่สามารถเชื่อมต่อกับ Backend ได้:
- ข้อมูลจะถูกบันทึกใน localStorage ของเบราว์เซอร์
- เหมาะสำหรับการทดสอบหรือใช้งานแบบ offline

## 🔒 Security Notes

⚠️ **สำคัญ**: ในการใช้งานจริง ควรเพิ่ม:
1. Authentication & Authorization
2. Input Validation
3. Rate Limiting
4. HTTPS
5. Environment Variables Protection

## 📄 License

MIT

## 👨‍💻 ผู้พัฒนา

FunNyProM

## 📞 ติดต่อ

- GitHub: [funnyprom](https://github.com/funnyprom)
- Repository: [work-management-system](https://github.com/funnyprom/work-management-system)
