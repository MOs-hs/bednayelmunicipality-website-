const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/complaints/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// ✅ MIME type whitelist — prevents uploading non-image files
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('يُسمح برفع الصور فقط (JPEG, PNG, WebP, GIF)'));
  }
  cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });

// POST /api/complaints — Citizens only
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  if (req.user.type !== 'citizen') {
    return res.status(403).json({ success: false, message: 'هذه الخدمة متاحة للمواطنين فقط' });
  }
  try {
    const { description, location } = req.body;
    if (!description) return res.status(400).json({ success: false, message: 'وصف المشكلة مطلوب' });
    if (description.length > 3000 || (location && location.length > 500))
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });
    const photo_path = req.file ? req.file.filename : null;
    await db.query(
      'INSERT INTO complaints (description, location, photo_path) VALUES (?, ?, ?)',
      [description, location || null, photo_path]
    );
    res.json({ success: true, message: 'تم إرسال الشكوى بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// GET /api/complaints — Admin
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM complaints ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// PUT /api/complaints/:id
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { status, resolution_notes } = req.body;
    await db.query(
      'UPDATE complaints SET status = ?, resolution_notes = ? WHERE id = ?',
      [status, resolution_notes || null, req.params.id]
    );
    res.json({ success: true, message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// DELETE /api/complaints/:id — Admin: delete complaint
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM complaints WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الشكوى' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
