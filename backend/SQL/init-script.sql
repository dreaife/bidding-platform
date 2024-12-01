-- 创建数据库
CREATE DATABASE IF NOT EXISTS `bide`;

-- 切换到数据库
-- \c bide;

-- 用户表
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,            -- 用户ID，主键
    username VARCHAR(50) NOT NULL UNIQUE,  -- 用户名
    email VARCHAR(100) NOT NULL UNIQUE,    -- 邮箱地址
    password_hash TEXT NOT NULL,           -- 密码哈希值（使用 Cognito 时可忽略）
    role VARCHAR(20) NOT NULL,             -- 用户角色 (e.g., 'bidder', 'client')
    created_at TIMESTAMP DEFAULT NOW(),    -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW()     -- 更新时间
);

-- 项目表
CREATE TABLE Projects (
    project_id SERIAL PRIMARY KEY,           -- 项目ID，主键
    client_id INT NOT NULL,                  -- 发布项目的用户ID（关联 Users）
    title VARCHAR(100) NOT NULL,             -- 项目标题
    description TEXT,                        -- 项目描述
    budget_min NUMERIC(10, 2) NOT NULL,      -- 最低预算
    budget_max NUMERIC(10, 2) NOT NULL,      -- 最高预算
    deadline DATE NOT NULL,                  -- 截止日期
    status VARCHAR(20) DEFAULT 'open',       -- 项目状态 (e.g., 'open', 'closed')
    created_at TIMESTAMP DEFAULT NOW(),      -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW(),      -- 更新时间
    FOREIGN KEY (client_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 投标表
CREATE TABLE Bids (
    bid_id SERIAL PRIMARY KEY,               -- 投标ID，主键
    project_id INT NOT NULL,                 -- 关联项目ID
    bidder_id INT NOT NULL,                  -- 投标人ID（关联 Users）
    amount NUMERIC(10, 2) NOT NULL,          -- 投标金额
    message TEXT,                            -- 投标留言
    status VARCHAR(20) DEFAULT 'pending',    -- 投标状态 (e.g., 'pending', 'accepted', 'rejected')
    created_at TIMESTAMP DEFAULT NOW(),      -- 创建时间
    updated_at TIMESTAMP DEFAULT NOW(),      -- 更新时间
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 插入初始数据
INSERT INTO Users (username, email, password_hash, role, created_at)
VALUES
('dreaife', 'dreaife@outlook.com', 'hashedpassword', 'client', NOW()),
('client1', 'client1@example.com', 'hashedpassword1', 'client', NOW()),
('client2', 'client2@example.com', 'hashedpassword2', 'client', NOW()),
('bidder1', 'bidder1@example.com', 'hashedpassword3', 'bidder', NOW()),
('bidder2', 'bidder2@example.com', 'hashedpassword4', 'bidder', NOW()),
('bidder3', 'bidder3@example.com', 'hashedpassword5', 'bidder', NOW());

INSERT INTO Projects (client_id, title, description, budget_min, budget_max, deadline, status, created_at)
VALUES
(1, 'Website Development', 'Develop a responsive company website.', 500.00, 1000.00, '2024-12-15', 'open', NOW()),
(2, 'Mobile App Design', 'Design a UI/UX for a new mobile application.', 2000.00, 5000.00, '2024-12-31', 'open', NOW()),
(1, 'SEO Optimization', 'Improve website SEO to increase traffic.', 300.00, 700.00, '2024-11-30', 'open', NOW());

INSERT INTO Bids (project_id, bidder_id, amount, message, status, created_at)
VALUES
(1, 3, 800.00, 'I can deliver the website in 2 weeks.', 'pending', NOW()),
(1, 4, 950.00, 'Experienced developer ready to start immediately.', 'pending', NOW()),
(2, 3, 4500.00, 'I have designed apps for similar industries.', 'pending', NOW()),
(2, 5, 4200.00, 'Offering competitive pricing for high-quality design.', 'pending', NOW()),
(3, 4, 600.00, 'Specialist in SEO optimization.', 'pending', NOW());
