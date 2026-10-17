const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [[cit]] = await db.query('SELECT COUNT(*) as count FROM citizens WHERE is_active = 1');
    const [[apt]] = await db.query('SELECT COUNT(*) as count FROM appointments');
    const [[cmp]] = await db.query('SELECT COUNT(*) as count FROM complaints');
    const [[loc]] = await db.query('SELECT COUNT(*) as count FROM locations WHERE is_active = 1');
    const [news] = await db.query('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 3');
    res.json({ success: true, stats: { citizens: cit.count, appointments: apt.count, complaints: cmp.count, locations: loc.count }, news });
  } catch (err) { res.status(500).json({ success: false, message: 'خطأ في الخادم' }); }
});

module.exports = router;
