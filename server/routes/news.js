const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');

// ── File Upload ───────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/news/'),
  filename: (req, file, cb) => cb(null, 'news_' + Date.now() + path.extname(file.originalname)),
});

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('يُسمح برفع الصور فقط (JPEG, PNG, WebP, GIF)'));
  }
  cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: imageFilter });

// ── Public: GET all published news ───────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, summary, image_path, category, published_at FROM news WHERE is_published = 1 ORDER BY published_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── Public: GET single news article ──────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'معرّف غير صحيح' });
    const [rows] = await db.query(
      'SELECT * FROM news WHERE id = ? AND is_published = 1',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── Admin: GET all news (published + drafts) ──────────────────────────────────
router.get('/admin/all', adminMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── Admin: POST create news article ──────────────────────────────────────────
router.post('/', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, category, is_published } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'العنوان والمحتوى مطلوبان' });
    if (title.length > 300 || (summary && summary.length > 500) || content.length > 20000)
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });

    const image_path = req.file ? req.file.filename : null;
    const published = is_published === 'true' || is_published === true ? 1 : 0;
    const published_at = published ? new Date() : null;

    await db.query(
      'INSERT INTO news (title, summary, content, image_path, category, is_published, published_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, summary || null, content, image_path, category || 'عام', published, published_at, req.user.id]
    );
    res.json({ success: true, message: 'تم نشر الخبر بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── Admin: PUT update news article ───────────────────────────────────────────
router.put('/:id', adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'معرّف غير صحيح' });

    const { title, summary, content, category, is_published } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'العنوان والمحتوى مطلوبان' });

    const [existing] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'الخبر غير موجود' });

    const image_path = req.file ? req.file.filename : existing[0].image_path;
    const published = is_published === 'true' || is_published === true ? 1 : 0;
    const published_at = published ? (existing[0].published_at || new Date()) : null;

    await db.query(
      'UPDATE news SET title=?, summary=?, content=?, image_path=?, category=?, is_published=?, published_at=? WHERE id=?',
      [title, summary || null, content, image_path, category || 'عام', published, published_at, id]
    );
    res.json({ success: true, message: 'تم تحديث الخبر بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ── Admin: DELETE news article ────────────────────────────────────────────────
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'معرّف غير صحيح' });
    await db.query('UPDATE news SET is_published = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم حذف الخبر' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
