const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'locations');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/locations/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('يُسمح برفع الصور فقط (JPEG, PNG, WebP, GIF)'));
  }
  cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: imageFilter });

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM locations WHERE is_active = 1';
    const params = [];
    if (category && category !== 'all') { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY name ASC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, address, phone, email, website, latitude, longitude, category } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'الاسم مطلوب' });
    const image_path = req.file ? req.file.filename : (req.body.image_path || null);
    await db.query(
      'INSERT INTO locations (name, description, address, phone, email, website, image_path, latitude, longitude, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || null, address || null, phone || null, email || null, website || null, image_path, latitude || null, longitude || null, category || 'other']
    );
    res.json({ success: true, message: 'تم إضافة الموقع بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE locations SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الموقع' });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;

