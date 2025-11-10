-- Work Management System Database Schema
-- SQL Server

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WorkManagementDB')
BEGIN
    CREATE DATABASE WorkManagementDB;
END
GO

USE WorkManagementDB;
GO

-- ===================================
-- Table: Users (สำหรับระบบผู้ใช้งาน)
-- ===================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        FullName NVARCHAR(200) NOT NULL,
        Email NVARCHAR(200) NOT NULL UNIQUE,
        Department NVARCHAR(100),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        IsActive BIT DEFAULT 1
    );
END
GO

-- ===================================
-- Table: Departments (แผนก)
-- ===================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Departments')
BEGIN
    CREATE TABLE Departments (
        DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
        DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
        DepartmentCode NVARCHAR(20) NOT NULL UNIQUE,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        IsActive BIT DEFAULT 1
    );
END
GO

-- ===================================
-- Table: Tasks (งาน/Work Tracking)
-- ===================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tasks')
BEGIN
    CREATE TABLE Tasks (
        TaskId INT IDENTITY(1,1) PRIMARY KEY,
        TaskGuid UNIQUEIDENTIFIER DEFAULT NEWID() UNIQUE,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        Status NVARCHAR(20) NOT NULL CHECK (Status IN ('todo', 'in-progress', 'done')),
        Priority NVARCHAR(20) NOT NULL CHECK (Priority IN ('low', 'medium', 'high')),
        Assignee NVARCHAR(200),
        AssigneeUserId INT,
        DueDate DATETIME2,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        IsDeleted BIT DEFAULT 0,
        FOREIGN KEY (AssigneeUserId) REFERENCES Users(UserId)
    );
END
GO

-- ===================================
-- Table: PurchaseRequests (PR)
-- ===================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseRequests')
BEGIN
    CREATE TABLE PurchaseRequests (
        PRId INT IDENTITY(1,1) PRIMARY KEY,
        PRGuid UNIQUEIDENTIFIER DEFAULT NEWID() UNIQUE,
        RequestNumber NVARCHAR(50) NOT NULL UNIQUE,
        Requestor NVARCHAR(200) NOT NULL,
        RequestorUserId INT,
        Department NVARCHAR(100) NOT NULL,
        DepartmentId INT,
        RequestDate DATETIME2 NOT NULL DEFAULT GETDATE(),
        TotalAmount DECIMAL(18, 2) DEFAULT 0,
        Status NVARCHAR(20) NOT NULL CHECK (Status IN ('draft', 'pending', 'approved', 'rejected')),
        Notes NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        ApprovedBy INT,
        ApprovedAt DATETIME2,
        IsDeleted BIT DEFAULT 0,
        FOREIGN KEY (RequestorUserId) REFERENCES Users(UserId),
        FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
        FOREIGN KEY (ApprovedBy) REFERENCES Users(UserId)
    );
END
GO

-- ===================================
-- Table: PurchaseRequestItems (รายการสินค้าใน PR)
-- ===================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseRequestItems')
BEGIN
    CREATE TABLE PurchaseRequestItems (
        ItemId INT IDENTITY(1,1) PRIMARY KEY,
        ItemGuid UNIQUEIDENTIFIER DEFAULT NEWID() UNIQUE,
        PRId INT NOT NULL,
        ItemName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        Quantity INT NOT NULL CHECK (Quantity > 0),
        UnitPrice DECIMAL(18, 2) NOT NULL CHECK (UnitPrice >= 0),
        TotalPrice DECIMAL(18, 2) NOT NULL CHECK (TotalPrice >= 0),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (PRId) REFERENCES PurchaseRequests(PRId) ON DELETE CASCADE
    );
END
GO

-- ===================================
-- Indexes for Performance
-- ===================================

-- Tasks Indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_Status')
    CREATE INDEX IX_Tasks_Status ON Tasks(Status) WHERE IsDeleted = 0;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_Priority')
    CREATE INDEX IX_Tasks_Priority ON Tasks(Priority) WHERE IsDeleted = 0;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_DueDate')
    CREATE INDEX IX_Tasks_DueDate ON Tasks(DueDate) WHERE IsDeleted = 0;

-- PurchaseRequests Indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PR_Status')
    CREATE INDEX IX_PR_Status ON PurchaseRequests(Status) WHERE IsDeleted = 0;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PR_RequestDate')
    CREATE INDEX IX_PR_RequestDate ON PurchaseRequests(RequestDate) WHERE IsDeleted = 0;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PR_RequestNumber')
    CREATE INDEX IX_PR_RequestNumber ON PurchaseRequests(RequestNumber);

-- PurchaseRequestItems Indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PRItems_PRId')
    CREATE INDEX IX_PRItems_PRId ON PurchaseRequestItems(PRId);

GO

-- ===================================
-- Insert Sample Data
-- ===================================

-- Sample Departments
IF NOT EXISTS (SELECT * FROM Departments WHERE DepartmentCode = 'IT')
BEGIN
    INSERT INTO Departments (DepartmentName, DepartmentCode) VALUES
    (N'Information Technology', 'IT'),
    (N'Human Resources', 'HR'),
    (N'Finance', 'FIN'),
    (N'Marketing', 'MKT'),
    (N'Operations', 'OPS'),
    (N'Sales', 'SAL');
END
GO

-- Sample Users
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, FullName, Email, Department) VALUES
    ('admin', N'ผู้ดูแลระบบ', 'admin@company.com', 'IT'),
    ('user1', N'สมชาย ใจดี', 'somchai@company.com', 'IT'),
    ('user2', N'สมหญิง รักงาน', 'somying@company.com', 'HR'),
    ('user3', N'วิชัย ทำดี', 'wichai@company.com', 'Finance');
END
GO

PRINT 'Database schema created successfully!';
GO

