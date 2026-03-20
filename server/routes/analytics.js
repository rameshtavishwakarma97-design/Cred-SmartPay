// ============================================
// Analytics & KPI Tracking Routes
// ============================================

import { Router } from 'express';
import { authMiddleware } from './auth.js';
import { getDb } from '../db.js';

const router = Router();

// POST /api/analytics/log — Log a funnel event (no auth required for top of funnel)
router.post('/log', (req, res) => {
  const { session_id, user_id, event_name, metadata } = req.body;
  const db = getDb();
  
  if (!session_id || !event_name) {
    return res.status(400).json({ error: 'session_id and event_name required' });
  }

  try {
    db.prepare(`
      INSERT INTO funnel_events (session_id, user_id, event_name, metadata)
      VALUES (?, ?, ?, ?)
    `).run(session_id, user_id || null, event_name, JSON.stringify(metadata || {}));
    res.json({ success: true });
  } catch (e) {
    console.error('Analytics log error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/analytics/stats — Get basic KPIs for dashboard
router.get('/stats', authMiddleware, (req, res) => {
  const db = getDb();
  
  try {
    // 1. Recommendation metrics
    const recStats = db.prepare(`
      SELECT 
        COUNT(DISTINCT RI.id) as total,
        SUM(CASE WHEN RI.selected_card_id IS NOT NULL THEN 1 ELSE 0 END) as selections,
        SUM(CASE WHEN RI.selected_card_id = RI.recommended_card_id THEN 1 ELSE 0 END) as best_match,
        SUM(CASE WHEN RI.selected_card_id IS NOT NULL AND RI.selected_card_id != RI.recommended_card_id THEN 1 ELSE 0 END) as deviation,
        AVG(RI.latency_ms) as avg_latency,
        -- Success-filtered metrics for Uptake
        COUNT(DISTINCT CASE WHEN T.status = 'completed' THEN RI.id END) as success_total,
        COUNT(DISTINCT CASE WHEN T.status = 'completed' AND RI.selected_card_id = RI.recommended_card_id THEN RI.id END) as success_best_match
      FROM recommendation_impressions RI
      LEFT JOIN transactions T ON RI.user_id = T.user_id 
        AND RI.merchant_id = T.merchant_id 
        AND ABS(RI.amount - T.amount) < 0.01
        AND T.card_id = RI.selected_card_id
        AND T.status = 'completed'
        AND T.is_simulation = 0
        AND T.created_at >= RI.created_at
        AND T.created_at <= datetime(RI.created_at, '+15 minutes')
      WHERE RI.is_simulation = 0
    `).get();
    console.log('DEBUG: recStats:', recStats);

    // 2. Funnel metrics (unique sessions per stage)
    const funnelStages = db.prepare(`
      SELECT event_name, COUNT(DISTINCT session_id) as count
      FROM funnel_events
      GROUP BY event_name
    `).all();

    // 3. Current system state
    const currentPending = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE status = 'pending' AND is_simulation = 0").get();
    const totalTxns = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE is_simulation = 0').get();

    res.json({
      recommendations: {
        total: recStats.total,
        selectionRate: recStats.total > 0 ? (recStats.selections / recStats.total) * 100 : 0,
        bestMatchRate: recStats.success_total > 0 ? (recStats.success_best_match / recStats.success_total) * 100 : 0,
        waiverRate: recStats.selections > 0 ? (recStats.deviation / recStats.selections) * 100 : 0,
        avgLatency: Math.round(recStats.avg_latency || 0)
      },
      funnel: funnelStages.reduce((acc, stage) => {
        acc[stage.event_name] = stage.count;
        return acc;
      }, {}),
      state: {
        pendingTransactions: currentPending.count,
        totalTransactions: totalTxns.count
      }
    });
  } catch (e) {
    console.error('Analytics stats error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
