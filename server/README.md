# Work Management System - Backend API

Backend API สำหรับระบบจัดการและติดตามงาน พร้อมฟอร์มสร้าง Purchase Request

## 🛠️ Technology Stack

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **mssql** - SQL Server Driver
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment Variables Management

## 📋 Prerequisites

- Node.js v14+ 
- SQL Server 2016+
- npm หรือ yarn

## 🚀 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd server
npm install
```

### 2. ตั้งค่า Database

รัน SQL script เพื่อสร้าง database และ tables:

```bash
# เปิด SQL Server Management Studio (SSMS)
# แล้วรัน script จากไฟล์ ../database/schema.sql
```

หรือใช้คำสั่ง:

```bash
sqlcmd -S localhost -U your_username -P your_password -i ../database/schema.sql
```

### 3. สร้างไฟล์ .env

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

### 4. รัน Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server จะเริ่มที่ `http://localhost:3001`

## 📡 API Endpoints

### Tasks (งาน)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | ดึงรายการงานทั้งหมด |
| GET | `/api/tasks/:id` | ดึงข้อมูลงานตาม ID |
| POST | `/api/tasks` | สร้างงานใหม่ |
| PUT | `/api/tasks/:id` | แก้ไขงาน |
| DELETE | `/api/tasks/:id` | ลบงาน (soft delete) |
| GET | `/api/tasks/stats/summary` | ดึงสถิติงาน |

### Purchase Requests (PR)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase-requests` | ดึงรายการ PR ทั้งหมด |
| GET | `/api/purchase-requests/:id` | ดึงข้อมูล PR ตาม ID |
| POST | `/api/purchase-requests` | สร้าง PR ใหม่ |
| PUT | `/api/purchase-requests/:id` | แก้ไข PR |
| DELETE | `/api/purchase-requests/:id` | ลบ PR (soft delete) |
| GET | `/api/purchase-requests/stats/summary` | ดึงสถิติ PR |

### Departments (แผนก)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | ดึงรายการแผนกทั้งหมด |
| POST | `/api/departments` | สร้างแผนกใหม่ |

### Users (ผู้ใช้งาน)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | ดึงรายการผู้ใช้ทั้งหมด |
| GET | `/api/users/:id` | ดึงข้อมูลผู้ใช้ตาม ID |
| POST | `/api/users` | สร้างผู้ใช้ใหม่ |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API Information |
| GET | `/api/health` | Health Check |

## 📝 ตัวอย่างการใช้งาน API

### สร้างงานใหม่

```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "ทำเอกสารสรุปโครงการ",
  "description": "สรุปผลการทำงานประจำเดือน",
  "status": "todo",
  "priority": "high",
  "assignee": "สมชาย ใจดี",
  "dueDate": "2024-12-31"
}
```

### สร้าง Purchase Request

```bash
POST /api/purchase-requests
Content-Type: application/json

{
  "requestNumber": "PR-2024-001",
  "requestor": "สมหญิง รักงาน",
  "department": "IT",
  "date": "2024-11-10",
  "status": "pending",
  "notes": "จัดซื้ออุปกรณ์คอมพิวเตอร์",
  "items": [
    {
      "itemName": "Laptop Dell XPS 15",
      "description": "Ram 16GB, SSD 512GB",
      "quantity": 2,
      "unitPrice": 45000,
      "totalPrice": 90000
    },
    {
      "itemName": "Mouse Logitech MX Master 3",
      "description": "เมาส์ไร้สาย",
      "quantity": 2,
      "unitPrice": 3500,
      "totalPrice": 7000
    }
  ],
  "totalAmount": 97000
}
```

## 🗂️ โครงสร้างโปรเจค

```
server/
├── config/
│   └── database.js          # Database configuration
├── routes/
│   ├── tasks.js            # Tasks API routes
│   ├── purchaseRequests.js # Purchase Requests API routes
│   ├── departments.js      # Departments API routes
│   └── users.js            # Users API routes
├── .env                    # Environment variables (create this)
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## 🔒 Security Notes

⚠️ **สำคัญ**: ในการใช้งานจริง ควรเพิ่ม:

1. **Authentication & Authorization** - ระบบ Login และการจัดการสิทธิ์
2. **Input Validation** - ตรวจสอบข้อมูลที่รับเข้ามา
3. **Rate Limiting** - จำกัดจำนวน request
4. **HTTPS** - เข้ารหัสการสื่อสาร
5. **SQL Injection Prevention** - ป้องกัน SQL Injection (ใช้ Parameterized Queries แล้ว)

## 🐛 Troubleshooting

### ไม่สามารถเชื่อมต่อ Database

1. ตรวจสอบว่า SQL Server กำลังทำงานอยู่
2. ตรวจสอบ username/password ในไฟล์ `.env`
3. ตรวจสอบว่า SQL Server ยอมรับ TCP/IP connections
4. ตรวจสอบ Firewall settings

### Port 3001 ถูกใช้งานแล้ว

เปลี่ยน PORT ในไฟล์ `.env`:

```env
PORT=3002
```

## 📄 License

MIT

