# 📖 คู่มือการติดตั้งและตั้งค่า Work Management System

คู่มือฉบับสมบูรณ์สำหรับการติดตั้งและตั้งค่าระบบจัดการงาน

## 📝 สารบัญ

1. [เตรียมความพร้อม](#เตรียมความพร้อม)
2. [ตั้งค่า SQL Server](#ตั้งค่า-sql-server)
3. [ตั้งค่า Backend API](#ตั้งค่า-backend-api)
4. [ตั้งค่า Frontend](#ตั้งค่า-frontend)
5. [การทดสอบระบบ](#การทดสอบระบบ)
6. [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)

---

## 1️⃣ เตรียมความพร้อม

### ✅ ติดตั้ง Software ที่จำเป็น

#### 1.1 Node.js (v14 หรือสูงกว่า)
- ดาวน์โหลดจาก: https://nodejs.org/
- ตรวจสอบการติดตั้ง:
  ```bash
  node --version
  npm --version
  ```

#### 1.2 SQL Server 2016+ 
**ตัวเลือกที่ 1: SQL Server Express (ฟรี)**
- ดาวน์โหลดจาก: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- เลือก "Express" edition

**ตัวเลือกที่ 2: SQL Server Developer Edition (ฟรี)**
- ดาวน์โหลดจาก: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- เลือก "Developer" edition

#### 1.3 SQL Server Management Studio (SSMS)
- ดาวน์โหลดจาก: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
- ใช้สำหรับจัดการ database

**หรือใช้ Azure Data Studio (ทางเลือก)**
- ดาวน์โหลดจาก: https://docs.microsoft.com/en-us/sql/azure-data-studio/download

#### 1.4 Git
- ดาวน์โหลดจาก: https://git-scm.com/downloads
- ตรวจสอบการติดตั้ง:
  ```bash
  git --version
  ```

---

## 2️⃣ ตั้งค่า SQL Server

### Step 1: เปิด SQL Server

1. เปิด "SQL Server Configuration Manager"
2. ไปที่ "SQL Server Services"
3. ตรวจสอบว่า "SQL Server (SQLEXPRESS)" หรือ "SQL Server (MSSQLSERVER)" กำลังทำงานอยู่
4. ถ้ายังไม่ทำงาน ให้คลิกขวาและเลือก "Start"

### Step 2: เปิดใช้งาน TCP/IP

1. ใน "SQL Server Configuration Manager"
2. ไปที่ "SQL Server Network Configuration" > "Protocols for SQLEXPRESS"
3. คลิกขวาที่ "TCP/IP" และเลือก "Enable"
4. คลิกขวาที่ "TCP/IP" อีกครั้งและเลือก "Properties"
5. ไปที่แท็บ "IP Addresses"
6. ใน "IPAll" ตั้งค่า:
   - TCP Port: `1433`
7. Restart SQL Server Service

### Step 3: ตั้งค่า Authentication Mode

1. เปิด SQL Server Management Studio (SSMS)
2. Connect to server
3. คลิกขวาที่ server name > "Properties"
4. ไปที่ "Security"
5. เลือก "SQL Server and Windows Authentication mode"
6. คลิก OK และ Restart SQL Server

### Step 4: สร้าง Login User

```sql
-- เปิด SSMS และรัน query นี้
USE master;
GO

-- สร้าง login
CREATE LOGIN workmanager WITH PASSWORD = 'YourStrongPassword123!';
GO

-- สร้าง user ใน master database
CREATE USER workmanager FOR LOGIN workmanager;
GO

-- ให้สิทธิ์สร้าง database
ALTER SERVER ROLE dbcreator ADD MEMBER workmanager;
GO
```

### Step 5: รัน Database Schema

1. เปิด SSMS
2. เลือก "File" > "Open" > "File..."
3. เลือกไฟล์ `database/schema.sql`
4. คลิก "Execute" หรือกด F5
5. ตรวจสอบว่าไม่มี error

### Step 6: ตรวจสอบ Database

```sql
-- ตรวจสอบว่า database ถูกสร้างแล้ว
SELECT name FROM sys.databases WHERE name = 'WorkManagementDB';

-- ใช้ database
USE WorkManagementDB;

-- ตรวจสอบ tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;

-- ตรวจสอบข้อมูล sample
SELECT * FROM Departments;
SELECT * FROM Users;
```

**ผลลัพธ์ที่ควรได้:**
- Database: WorkManagementDB
- Tables: Tasks, PurchaseRequests, PurchaseRequestItems, Departments, Users
- Sample data: 6 Departments, 4 Users

---

## 3️⃣ ตั้งค่า Backend API

### Step 1: ติดตั้ง Dependencies

```bash
# เข้าไปในโฟลเดอร์ server
cd server

# ติดตั้ง packages
npm install
```

### Step 2: สร้างไฟล์ .env

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` และเพิ่มเนื้อหาดังนี้:

```env
# SQL Server Configuration
DB_SERVER=localhost
DB_PORT=1433
DB_USER=workmanager
DB_PASSWORD=YourStrongPassword123!
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Server Configuration
PORT=3001
NODE_ENV=development
```

**⚠️ หมายเหตุ:**
- ถ้าใช้ SQL Server Express ให้เปลี่ยน `DB_SERVER` เป็น `localhost\\SQLEXPRESS`
- ถ้าใช้ Named Instance ให้ใส่ชื่อ instance ด้วย เช่น `localhost\\YOUR_INSTANCE_NAME`
- เปลี่ยน `DB_PASSWORD` เป็นรหัสผ่านที่คุณตั้งไว้

### Step 3: ทดสอบการเชื่อมต่อ Database

สร้างไฟล์ `server/test-connection.js`:

```javascript
require('dotenv').config();
const { getConnection } = require('./config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const pool = await getConnection();
    const result = await pool.request().query('SELECT 1 AS test');
    console.log('✅ Database connected successfully!');
    console.log('Test result:', result.recordset);
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

testConnection();
```

รันคำสั่ง:
```bash
node test-connection.js
```

**ควรได้ผลลัพธ์:**
```
Testing database connection...
✅ Connected to SQL Server successfully
✅ Database connected successfully!
Test result: [ { test: 1 } ]
```

### Step 4: รัน Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# หรือ Production mode
npm start
```

**ควรเห็น:**
```
✅ Connected to SQL Server successfully
🚀 Server is running on port 3001
📍 API URL: http://localhost:3001
🏥 Health check: http://localhost:3001/api/health
```

### Step 5: ทดสอบ API Endpoints

เปิดเบราว์เซอร์หรือใช้ Postman:

1. **Health Check:**
   - URL: `http://localhost:3001/api/health`
   - Method: GET
   - ควรได้: `{"status":"OK","message":"Work Management API is running"}`

2. **Get Tasks:**
   - URL: `http://localhost:3001/api/tasks`
   - Method: GET
   - ควรได้: `[]` (array ว่าง)

3. **Get Departments:**
   - URL: `http://localhost:3001/api/departments`
   - Method: GET
   - ควรได้ข้อมูล 6 แผนก

---

## 4️⃣ ตั้งค่า Frontend

### Step 1: กลับไปที่ Root Directory

```bash
# ถ้าอยู่ในโฟลเดอร์ server
cd ..
```

### Step 2: ติดตั้ง Dependencies

```bash
npm install
```

### Step 3: สร้างไฟล์ .env

สร้างไฟล์ `.env` ใน root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### Step 4: รัน Frontend

```bash
npm run dev
```

**ควรเห็น:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 5: เปิดเบราว์เซอร์

เปิด: `http://localhost:5173`

**ควรเห็น:**
- หน้า Dashboard
- สถิติงานและ PR เป็น 0
- สามารถคลิกไปยังหน้าอื่นๆ ได้

---

## 5️⃣ การทดสอบระบบ

### ✅ ทดสอบฟีเจอร์ Tasks

1. ไปที่เมนู "ติดตามงาน"
2. คลิก "เพิ่มงานใหม่"
3. กรอกข้อมูล:
   - ชื่องาน: "ทดสอบระบบ"
   - รายละเอียด: "ทดสอบการทำงานของระบบ"
   - สถานะ: "รอดำเนินการ"
   - ลำดับความสำคัญ: "สูง"
   - ผู้รับผิดชอบ: "Admin"
   - กำหนดส่ง: (เลือกวันที่)
4. คลิก "เพิ่มงาน"
5. ตรวจสอบว่างานปรากฏในหน้าจอ

**ตรวจสอบใน Database:**
```sql
USE WorkManagementDB;
SELECT * FROM Tasks;
```

### ✅ ทดสอบฟีเจอร์ Purchase Request

1. ไปที่เมนู "เปิด PR"
2. คลิก "สร้าง PR ใหม่"
3. กรอกข้อมูล:
   - ผู้ขอ: "Admin"
   - แผนก: "IT"
   - วันที่: (เลือกวันที่)
4. เพิ่มรายการสินค้า:
   - ชื่อสินค้า: "Notebook"
   - รายละเอียด: "Dell Latitude"
   - จำนวน: 1
   - ราคา/หน่วย: 25000
5. คลิก "ส่ง PR"
6. ตรวจสอบว่า PR ปรากฏในตาราง

**ตรวจสอบใน Database:**
```sql
USE WorkManagementDB;
SELECT * FROM PurchaseRequests;
SELECT * FROM PurchaseRequestItems;
```

### ✅ ทดสอบ Dashboard

1. กลับไปที่หน้า "แดชบอร์ด"
2. ตรวจสอบว่าสถิติแสดงผลถูกต้อง:
   - งานทั้งหมด: 1
   - รอดำเนินการ: 1
   - PR ทั้งหมด: 1
   - รออนุมัติ: 1

---

## 6️⃣ แก้ปัญหาที่พบบ่อย

### ❌ ปัญหา: ไม่สามารถเชื่อมต่อ SQL Server

**อาการ:**
```
Error: Failed to connect to localhost:1433
```

**วิธีแก้:**
1. ตรวจสอบว่า SQL Server กำลังทำงาน
2. ตรวจสอบว่า TCP/IP ถูกเปิดใช้งาน
3. ตรวจสอบ Firewall:
   ```bash
   # เปิด Windows Firewall
   # เพิ่ม rule สำหรับ port 1433
   ```
4. ถ้าใช้ Named Instance ลอง:
   ```env
   DB_SERVER=localhost\\SQLEXPRESS
   ```

### ❌ ปัญหา: Login failed for user

**อาการ:**
```
Error: Login failed for user 'workmanager'
```

**วิธีแก้:**
1. ตรวจสอบว่า Authentication Mode เป็น "Mixed Mode"
2. ตรวจสอบ username/password ในไฟล์ `.env`
3. ลองสร้าง login ใหม่:
   ```sql
   DROP LOGIN workmanager;
   CREATE LOGIN workmanager WITH PASSWORD = 'YourPassword';
   ```

### ❌ ปัญหา: Port 3001 already in use

**อาการ:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**วิธีแก้:**
1. เปลี่ยน PORT ในไฟล์ `server/.env`:
   ```env
   PORT=3002
   ```
2. อัพเดทไฟล์ `.env` ของ frontend:
   ```env
   VITE_API_URL=http://localhost:3002/api
   ```

### ❌ ปัญหา: Frontend ไม่แสดงข้อมูล

**อาการ:**
- Dashboard แสดงสถิติเป็น 0 แม้ว่ามีข้อมูลใน database
- Console แสดง CORS error

**วิธีแก้:**
1. ตรวจสอบว่า backend กำลังทำงาน (http://localhost:3001/api/health)
2. ตรวจสอบไฟล์ `.env` ของ frontend
3. เปิด Developer Console (F12) ดู error
4. ลอง Refresh หน้าเบราว์เซอร์

### ❌ ปัญหา: npm install ล้มเหลว

**วิธีแก้:**
1. ลบ `node_modules` และ `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. ลองใช้ yarn แทน:
   ```bash
   npm install -g yarn
   yarn install
   ```
3. ตรวจสอบ Node.js version:
   ```bash
   node --version  # ควรเป็น v14+
   ```

---

## 🎉 สำเร็จ!

ถ้าทำตามขั้นตอนทั้งหมดแล้ว คุณควรจะมี:

✅ SQL Server พร้อม Database และ Sample Data  
✅ Backend API ทำงานที่ port 3001  
✅ Frontend ทำงานที่ port 5173  
✅ สามารถเพิ่ม แก้ไข ลบ งานและ PR ได้  
✅ ข้อมูลถูกบันทึกใน Database  

## 📞 ต้องการความช่วยเหลือ?

- อ่านเอกสารเพิ่มเติมใน `README.md`
- อ่าน Backend documentation ใน `server/README.md`
- ตรวจสอบ issues ใน GitHub repository
- ติดต่อผู้พัฒนา

---

**Happy Coding! 🚀**

