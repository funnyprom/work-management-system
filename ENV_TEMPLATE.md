# 📝 Template สำหรับไฟล์ .env

เมื่อ clone โปรเจคมาใหม่ ต้องสร้างไฟล์ `.env` ทั้ง 2 ไฟล์ด้านล่างนี้

**หมายเหตุ:** ไฟล์ `.env` ไม่ได้อยู่ใน GitHub เพราะมี password และข้อมูลสำคัญ

---

## 📁 ไฟล์ที่ 1: `server/.env`

**ตำแหน่ง:** `server/.env`

```env
# SQL Server Configuration
DB_SERVER=localhost\SQLEXPRESS
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPasswordHere
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 📌 คำอธิบายแต่ละค่า:

| ค่า | คำอธิบาย | ตัวอย่าง |
|-----|----------|----------|
| `DB_SERVER` | ชื่อ SQL Server instance | `localhost\SQLEXPRESS` |
| `DB_PORT` | Port ของ SQL Server | `1433` |
| `DB_USER` | Username สำหรับเข้า SQL Server | `sa` |
| `DB_PASSWORD` | Password สำหรับเข้า SQL Server | `P@ssw0rd` |
| `DB_DATABASE` | ชื่อ Database | `WorkManagementDB` |
| `DB_ENCRYPT` | เปิดใช้ encryption หรือไม่ | `false` |
| `DB_TRUST_SERVER_CERTIFICATE` | Trust certificate หรือไม่ | `true` |
| `PORT` | Port สำหรับ Backend API | `3001` |
| `NODE_ENV` | Environment mode | `development` |

### 🔍 วิธีหาชื่อ SQL Server Instance:

**Windows PowerShell:**
```powershell
Get-Service | Where-Object {$_.Name -like "*SQL*"}
```

**SQL Server Management Studio (SSMS):**
- เปิด SSMS
- ดูที่ "Connect to Server" > Server name
- ตัวอย่าง: `DESKTOP-ABC123\SQLEXPRESS`

### 💡 กรณีพิเศษ:

**ถ้าใช้ SQL Server เครื่องอื่น:**
```env
DB_SERVER=192.168.1.100\SQLEXPRESS
```

**ถ้าใช้ Azure SQL Database:**
```env
DB_SERVER=yourserver.database.windows.net
DB_USER=your_username@yourserver
DB_PASSWORD=your_password
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

---

## 📁 ไฟล์ที่ 2: `.env` (root directory)

**ตำแหน่ง:** `.env` (ในโฟลเดอร์หลักของโปรเจค)

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
```

### 📌 คำอธิบาย:

| ค่า | คำอธิบาย | ตัวอย่าง |
|-----|----------|----------|
| `VITE_API_URL` | URL ของ Backend API | `http://localhost:3001/api` |

### 💡 กรณีพิเศษ:

**ถ้า Backend อยู่คนละเครื่อง:**
```env
VITE_API_URL=http://192.168.1.100:3001/api
```

**ถ้าเปลี่ยน Port ของ Backend:**
```env
VITE_API_URL=http://localhost:3002/api
```

---

## 🚀 วิธีสร้างไฟล์ .env

### วิธีที่ 1: ใช้ Text Editor

1. เปิด VS Code หรือ Notepad
2. สร้างไฟล์ใหม่
3. Copy template ด้านบน
4. แก้ไขค่าตามที่ต้องการ
5. Save as:
   - `server/.env`
   - `.env` (root)

### วิธีที่ 2: ใช้ Command Line

**Windows PowerShell:**

```powershell
# สร้างไฟล์ server/.env
@"
DB_SERVER=localhost\SQLEXPRESS
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=P@ssw0rd
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
PORT=3001
NODE_ENV=development
"@ | Out-File -FilePath server/.env -Encoding UTF8

# สร้างไฟล์ .env (root)
@"
VITE_API_URL=http://localhost:3001/api
"@ | Out-File -FilePath .env -Encoding UTF8
```

**macOS/Linux:**

```bash
# สร้างไฟล์ server/.env
cat > server/.env << 'EOF'
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=P@ssw0rd
DB_DATABASE=WorkManagementDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
PORT=3001
NODE_ENV=development
EOF

# สร้างไฟล์ .env (root)
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3001/api
EOF
```

---

## ✅ ตรวจสอบว่าสร้างถูกต้อง

### ตรวจสอบไฟล์:

```powershell
# ตรวจสอบว่ามีไฟล์
Test-Path server/.env
Test-Path .env

# ดูเนื้อหาไฟล์
Get-Content server/.env
Get-Content .env
```

### ทดสอบการเชื่อมต่อ:

```bash
# ทดสอบ Backend
cd server
node -e "require('dotenv').config(); console.log('DB_SERVER:', process.env.DB_SERVER);"

# ควรเห็นค่าที่ตั้งไว้
```

---

## ⚠️ คำเตือนความปลอดภัย

### ❌ สิ่งที่ไม่ควรทำ:

- ❌ **อย่า push** ไฟล์ `.env` ขึ้น GitHub
- ❌ **อย่าแชร์** password ใน chat/email
- ❌ **อย่า commit** ไฟล์ที่มี credentials

### ✅ สิ่งที่ควรทำ:

- ✅ ใช้ password ที่แข็งแรง
- ✅ แต่ละเครื่องสร้างไฟล์ `.env` ของตัวเอง
- ✅ ถ้าต้องแชร์ ใช้ผ่าน secure channel (เช่น password manager)
- ✅ `.gitignore` จะช่วยป้องกันไม่ให้ push โดยไม่ตั้งใจ

---

## 🔒 ตรวจสอบว่าไฟล์ .env ถูก Ignore

```bash
# ตรวจสอบว่าไฟล์ .env จะไม่ถูก track โดย git
git check-ignore -v server/.env
git check-ignore -v .env

# ถ้าถูก ignore จะแสดง:
# .gitignore:19:server/.env   server/.env
```

---

## 📚 เอกสารที่เกี่ยวข้อง

- [CLONE_SETUP.md](CLONE_SETUP.md) - คู่มือติดตั้งบนเครื่องใหม่
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - คู่มือติดตั้งแบบละเอียด
- [README.md](README.md) - เอกสารหลัก

---

**หมายเหตุ:** ถ้าคุณเปลี่ยนค่าใน `.env` ต้อง restart Backend server ใหม่เพื่อให้ค่าใหม่มีผล

