const db = require('./config/db');
db.query(`
  CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    summary VARCHAR(500),
    content LONGTEXT NOT NULL,
    image_path VARCHAR(255),
    category VARCHAR(100) DEFAULT 'عام',
    is_published TINYINT(1) DEFAULT 0,
    published_at DATETIME,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
`).then(() => {
  console.log('✅ news table created/verified');
  process.exit(0);
}).catch(e => {
  console.error('❌', e.message);
  process.exit(1);
});
