const db = require('./config/db');
async function test() {
  try {
    const [rows] = await db.query('SHOW DATABASES');
    console.log('Databases:', rows);
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit();
}
test();
