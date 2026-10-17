const express = require('express');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const db = require('../config/db');
require('dotenv').config();

// ─── SMS Helper ───────────────────────────────────────────────────────────────
// If Twilio env vars are set → sends a real SMS.
// Otherwise (localhost dev) → returns the code/link in the API response instead.
async function sendSMS(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && sid.startsWith('AC') && token && from) {
    // Production: send real SMS via Twilio
    const twilio = require('twilio')(sid, token);
    await twilio.messages.create({ body, from, to: `+961${to.replace(/^0/, '')}` });
    return { sent: true };
  } else {
    // Development: no SMS provider configured, return data for display
    return { sent: false };
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// ✅ Rate limiter: max 10 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'لقد تجاوزت الحد المسموح من المحاولات. يرجى المحاولة بعد 15 دقيقة.' },
});

// ✅ Rate limiter: max 5 password-reset requests per hour per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.' },
});

function validateLebanesePhone(phone) {
  phone = phone.replace(/[^0-9]/g, '');
  const patterns = [ /^03[0-9]{7}$/, /^7[016789][0-9]{6}$/, /^81[0-9]{6}$/, /^0[1-9][0-9]{6}$/ ];
  return patterns.some(p => p.test(phone));
}

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, message: 'رقم الهاتف وكلمة المرور مطلوبان' });
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!validateLebanesePhone(cleanPhone)) return res.status(400).json({ success: false, message: 'رقم الهاتف غير صحيح' });
    
    const [rows] = await db.query('SELECT * FROM citizens WHERE phone_number = ? AND is_active = 1', [cleanPhone]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
    
    const citizen = rows[0];
    const valid = await bcrypt.compare(password, citizen.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
    
    // ╔════════════════════════════════════════════════════════════════════╗
    // ║  VERIFICATION CHECK — COMMENTED OUT FOR DEVELOPMENT              ║
    // ║  Uncomment the block below when Twilio SMS is activated          ║
    // ╚════════════════════════════════════════════════════════════════════╝
    // if (!citizen.is_verified) {
    //   return res.status(403).json({ success: false, message: 'الحساب غير مفعل. يرجى تفعيل حسابك أولاً', not_verified: true, phone: cleanPhone });
    // }
    
    await db.query('UPDATE citizens SET last_login = NOW() WHERE id = ?', [citizen.id]);
    const token = jwt.sign(
      { id: citizen.id, type: 'citizen', name: citizen.full_name, phone: citizen.phone_number },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ success: true, token, user: { id: citizen.id, type: 'citizen', name: citizen.full_name, phone: citizen.phone_number } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.post('/admin-login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' });
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND is_active = 1', [username]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    const token = jwt.sign(
      { id: user.id, type: 'admin', name: user.full_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ success: true, token, user: { id: user.id, type: 'admin', name: user.full_name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { phone, password, full_name, email, address } = req.body;
    if (!phone || !password || !full_name) return res.status(400).json({ success: false, message: 'جميع الحقول المطلوبة يجب ملؤها' });
    if (full_name.length > 200 || (email && email.length > 200))
      return res.status(400).json({ success: false, message: 'البيانات المدخلة طويلة جداً' });
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!validateLebanesePhone(cleanPhone)) return res.status(400).json({ success: false, message: 'رقم الهاتف غير صحيح' });
    const [existing] = await db.query('SELECT id FROM citizens WHERE phone_number = ?', [cleanPhone]);
    if (existing.length > 0) return res.status(409).json({ success: false, message: 'رقم الهاتف مسجل مسبقاً' });
    
    const password_hash = await bcrypt.hash(password, 10);

    // ╔════════════════════════════════════════════════════════════════════╗
    // ║  SMS VERIFICATION — COMMENTED OUT FOR DEVELOPMENT                ║
    // ║  Uncomment the block below and remove the auto-verify INSERT     ║
    // ║  when Twilio SMS is activated and paid for.                      ║
    // ╚════════════════════════════════════════════════════════════════════╝

    // --- START: Uncomment this block for production (Twilio SMS) ---
    // const verification_code = Math.floor(100000 + Math.random() * 900000).toString();
    // await db.query(
    //   'INSERT INTO citizens (phone_number, full_name, email, address, password_hash, verification_code, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)',
    //   [cleanPhone, full_name, email || null, address || null, password_hash, verification_code]
    // );
    // const smsResult = await sendSMS(cleanPhone, `رمز التحقق الخاص بك في بلدية بدنايل هو: ${verification_code}`);
    // if (smsResult.sent) {
    //   res.json({ success: true, message: 'تم إنشاء الحساب بنجاح. تم إرسال رمز التحقق إلى هاتفك.', phone: cleanPhone });
    // } else {
    //   res.json({ success: true, message: 'تم إنشاء الحساب بنجاح', verification_code, phone: cleanPhone });
    // }
    // --- END: Uncomment this block for production ---

    // --- START: Auto-verify for development (remove this block for production) ---
    await db.query(
      'INSERT INTO citizens (phone_number, full_name, email, address, password_hash, verification_code, is_verified) VALUES (?, ?, ?, ?, ?, NULL, 1)',
      [cleanPhone, full_name, email || null, address || null, password_hash]
    );
    res.json({ success: true, message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.', phone: cleanPhone, auto_verified: true });
    // --- END: Auto-verify for development ---
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║  VERIFY ROUTE — COMMENTED OUT FOR DEVELOPMENT                    ║
// ║  Uncomment when Twilio SMS is activated and paid for.            ║
// ╚════════════════════════════════════════════════════════════════════╝
// router.post('/verify', async (req, res) => {
//   try {
//     const { phone, code } = req.body;
//     const cleanPhone = phone.replace(/[^0-9]/g, '');
//     const [rows] = await db.query(
//       'SELECT * FROM citizens WHERE phone_number = ? AND verification_code = ?',
//       [cleanPhone, code]
//     );
//     if (rows.length === 0) return res.status(400).json({ success: false, message: 'رمز التحقق غير صحيح' });
//     await db.query('UPDATE citizens SET is_verified = 1, verification_code = NULL WHERE id = ?', [rows[0].id]);
//     res.json({ success: true, message: 'تم تفعيل حسابك بنجاح!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'خطأ في الخادم' });
//   }
// });

// Stub route so the client doesn't break
router.post('/verify', (req, res) => {
  res.json({ success: true, message: 'Account auto-verified (dev mode)' });
});

router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'رقم الهاتف مطلوب' });
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const [rows] = await db.query(
      'SELECT id FROM citizens WHERE phone_number = ? AND is_active = 1 AND is_verified = 1',
      [cleanPhone]
    );

    // Always return the same message whether the phone exists or not (prevents user enumeration)
    if (rows.length === 0) {
      return res.json({ success: true, message: 'إذا كان الرقم مسجلاً، سيتم إرسال رابط إعادة التعيين.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.query(
      'UPDATE citizens SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, expires, rows[0].id]
    );

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}&phone=${cleanPhone}`;

    const smsResult = await sendSMS(cleanPhone, `رابط إعادة تعيين كلمة المرور: ${resetLink} (صالح لمدة 15 دقيقة)`);

    if (smsResult.sent) {
      // Production: SMS sent, don't expose the link in the response
      res.json({ success: true, message: 'إذا كان الرقم مسجلاً، سيتم إرسال رابط إعادة التعيين.' });
    } else {
      // Development: no SMS provider, show the link on screen
      res.json({
        success: true,
        message: 'تم إنشاء رابط إعادة تعيين كلمة المرور.',
        reset_link: resetLink,
        token,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, token, password } = req.body;
    if (!phone || !token || !password) return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    if (password.length > 128) return res.status(400).json({ success: false, message: 'كلمة المرور طويلة جداً' });

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const [rows] = await db.query(
      'SELECT id, reset_token, reset_token_expires FROM citizens WHERE phone_number = ? AND reset_token = ?',
      [cleanPhone, token]
    );

    if (rows.length === 0) return res.status(400).json({ success: false, message: 'الرابط غير صحيح أو منتهي الصلاحية' });

    // ✅ Timing-safe token comparison (prevents timing attacks)
    const storedToken = Buffer.from(rows[0].reset_token, 'hex');
    const providedToken = Buffer.from(token, 'hex');
    if (storedToken.length !== providedToken.length || !crypto.timingSafeEqual(storedToken, providedToken)) {
      return res.status(400).json({ success: false, message: 'الرابط غير صحيح' });
    }

    if (new Date() > new Date(rows[0].reset_token_expires)) {
      return res.status(400).json({ success: false, message: 'انتهت صلاحية الرابط. يرجى طلب رابط جديد.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'UPDATE citizens SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [password_hash, rows[0].id]
    );

    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

module.exports = router;
