const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/gallery/'),
  filename: (req, file, cb) => cb(null, 'carousel_' + Date.now() + path.extname(file.originalname)),
});

// ✅ MIME type whitelist
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('يُسمح برفع الصور فقط (JPEG, PNG, WebP, GIF)'));
  }
  cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: imageFilter });

// Public GET
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM carousel_slides WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

// Admin POST
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    if (!title || !req.file) return res.status(400).json({ success: false, message: 'العنوان والصورة مطلوبان' });
    if (title.length > 300 || (subtitle && subtitle.length > 500))
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });
    const image_path = req.file.filename;
    await db.query(
      'INSERT INTO carousel_slides (title, subtitle, image_path) VALUES (?, ?, ?)',
      [title, subtitle || null, image_path]
    );
    res.json({ success: true, message: 'تم إضافة الشريحة بنجاح' });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

// Admin DELETE
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE carousel_slides SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الشريحة' });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;
