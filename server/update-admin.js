const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function updateAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await db.query('UPDATE users SET password_hash = ? WHERE username = "admin"', [hash]);
    console.log('Password updated to admin123');
  } catch(e) { console.error(e); }
  process.exit();
}
updateAdmin();
