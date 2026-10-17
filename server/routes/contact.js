const express = require('express');
const router = express.Router();
const db = require('../config/db');
const rateLimit = require('express-rate-limit');

// ✅ Rate limit: max 5 contact messages per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'لقد أرسلت رسائل كثيرة. يرجى المحاولة لاحقاً.' },
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { full_name, email, message } = req.body;
    if (!full_name || !email || !message)
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    // ✅ Input length limits
    if (full_name.length > 200 || email.length > 200 || message.length > 3000)
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });
    await db.query(
      'INSERT INTO contact_messages (full_name, email, message) VALUES (?, ?, ?)',
      [full_name, email, message]
    );
    res.json({ success: true, message: 'تم إرسال رسالتك بنجاح' });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

router.get('/', require('../middleware/auth').adminMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;
