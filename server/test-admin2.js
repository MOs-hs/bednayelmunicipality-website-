const db = require('./config/db');
async function check() {
  try {
    const [rows] = await db.query('SELECT username, password_hash FROM users WHERE role="admin"');
    console.log('Admins:', rows);
  } catch(e) { console.error(e); }
  process.exit();
}
check();
