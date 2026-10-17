const db = require('./config/db');
async function test() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('DB connection successful:', rows);
  } catch (err) {
    console.error('DB connection error:', err);
  }
  process.exit();
}
test();
