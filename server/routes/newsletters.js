const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM newsletters WHERE is_published = 1 ORDER BY published_at DESC LIMIT 10');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.get('/all', adminMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM newsletters ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, content, language, is_published } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'العنوان والمحتوى مطلوبان' });
    const published_at = is_published ? new Date() : null;
    await db.query('INSERT INTO newsletters (title, content, language, is_published, published_at, created_by) VALUES (?, ?, ?, ?, ?, ?)', [title, content, language || 'ar', is_published ? 1 : 0, published_at, req.user.id]);
    res.json({ success: true, message: 'تم إنشاء النشرة' });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM newsletters WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف النشرة' });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;
