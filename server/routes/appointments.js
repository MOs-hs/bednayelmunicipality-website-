const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/appointments/my — Citizen: get their own appointments by phone
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const phone = req.user.phone?.replace(/[^0-9]/g, '');
    if (!phone) return res.json({ success: true, data: [] });
    const [rows] = await db.query(
      'SELECT * FROM appointments WHERE REPLACE(REPLACE(REPLACE(phone," ",""),"-",""),"/","") = ? ORDER BY created_at DESC',
      [phone]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// POST /api/appointments — Book appointment (citizens only)
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.type !== 'citizen') {
    return res.status(403).json({ success: false, message: 'هذه الخدمة متاحة للمواطنين فقط' });
  }
  try {
    const { full_name, email, phone, appointment_date, appointment_time, service_type, description } = req.body;
    if (!full_name || !email || !appointment_date || !service_type)
      return res.status(400).json({ success: false, message: 'الرجاء ملء جميع الحقول المطلوبة' });
    if (full_name.length > 200 || email.length > 200 || (description && description.length > 2000))
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });
    await db.query(
      'INSERT INTO appointments (full_name, email, appointment_date, appointment_time, service_type, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, appointment_date, appointment_time || null, service_type, description || null]
    );
    res.json({ success: true, message: 'تم حجز الموعد بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});


// GET /api/appointments — Admin: get all
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointments ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// PUT /api/appointments/:id — Admin: update status
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'تم تحديث الحالة' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// DELETE /api/appointments/:id — Admin: delete appointment
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الموعد' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
