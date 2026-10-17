const db = require('./config/db');
async function setup() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS carousel_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        image_path VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert defaults if empty
    const [rows] = await db.query('SELECT COUNT(*) as count FROM carousel_slides');
    if (rows[0].count === 0) {
      await db.query(`
        INSERT INTO carousel_slides (title, subtitle, image_path) VALUES 
        ('مرحباً بكم في بدنايل', 'بلدية عريقة تخدم مجتمعها بأفضل الطرق', 'kharita.jpg'),
        ('مبنى البلدية', 'مركز الخدمات البلدية والتنمية المحلية', 'kaser.jpg'),
        ('جمال الطبيعة', 'مناظر خلابة وطبيعة ساحرة', 'day3a.jpg')
      `);
    }
    console.log('Carousel table created');
  } catch (err) {
    console.error(err);
  }
  process.exit();
}
setup();
