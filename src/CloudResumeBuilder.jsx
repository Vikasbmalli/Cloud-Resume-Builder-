import { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a0f;
  --bg2: #111118;
  --bg3: #16161f;
  --bg4: #1e1e2a;
  --card: #1a1a25;
  --border: rgba(255,255,255,0.08);
  --border2: rgba(255,255,255,0.14);
  --text: #f0f0f5;
  --text2: #9898b0;
  --text3: #5a5a70;
  --accent: #6c63ff;
  --accent2: #a78bfa;
  --accent3: #38bdf8;
  --green: #34d399;
  --amber: #fbbf24;
  --red: #f87171;
  --pink: #f472b6;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --glow: 0 0 30px rgba(108,99,255,0.15);
}

[data-theme="light"] {
  --bg: #f5f5fb;
  --bg2: #ededf7;
  --bg3: #e6e6f2;
  --bg4: #dcdcee;
  --card: #ffffff;
  --border: rgba(0,0,0,0.08);
  --border2: rgba(0,0,0,0.14);
  --text: #111120;
  --text2: #4a4a6a;
  --text3: #9090b0;
  --shadow: 0 4px 24px rgba(0,0,0,0.08);
  --glow: 0 0 30px rgba(108,99,255,0.08);
}

body { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 3px; }

/* ── NAVBAR ── */
.navbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(10,10,15,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  display: flex; align-items: center; gap: 1rem;
  height: 60px;
}
[data-theme="light"] .navbar { background: rgba(245,245,251,0.85); }
.navbar-brand { font-size: 1.2rem; font-weight: 700; background: linear-gradient(135deg, var(--accent2), var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: auto; }
.navbar-actions { display: flex; align-items: center; gap: 0.5rem; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius-sm);
  font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #7b73ff; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(108,99,255,0.4); }
.btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--bg4); color: var(--text); border-color: var(--border2); }
.btn-danger { background: rgba(248,113,113,0.15); color: var(--red); border: 1px solid rgba(248,113,113,0.3); }
.btn-danger:hover { background: rgba(248,113,113,0.25); }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.btn-success { background: rgba(52,211,153,0.15); color: var(--green); border: 1px solid rgba(52,211,153,0.3); }
.btn-success:hover { background: rgba(52,211,153,0.25); }
.btn-amber { background: rgba(251,191,36,0.15); color: var(--amber); border: 1px solid rgba(251,191,36,0.3); }
.btn-amber:hover { background: rgba(251,191,36,0.25); }
.btn-icon { padding: 8px; border-radius: var(--radius-sm); }

/* ── CARDS ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}
.card-sm { padding: 1rem; }

/* ── FORMS ── */
.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
.form-control {
  width: 100%; padding: 9px 12px;
  background: var(--bg3); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text);
  font-family: 'Sora', sans-serif; font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.form-control:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
.form-control::placeholder { color: var(--text3); }
textarea.form-control { resize: vertical; min-height: 80px; }
select.form-control { cursor: pointer; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

/* ── BADGE ── */
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.badge-accent { background: rgba(108,99,255,0.2); color: var(--accent2); }
.badge-green { background: rgba(52,211,153,0.15); color: var(--green); }
.badge-amber { background: rgba(251,191,36,0.15); color: var(--amber); }
.badge-red { background: rgba(248,113,113,0.15); color: var(--red); }

/* ── TABS ── */
.tabs { display: flex; gap: 4px; background: var(--bg3); padding: 4px; border-radius: var(--radius-sm); }
.tab { padding: 7px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text2); transition: all 0.2s; border: none; background: transparent; font-family: 'Sora', sans-serif; }
.tab.active { background: var(--card); color: var(--text); box-shadow: var(--shadow); }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 1rem;
  animation: fadeIn 0.2s;
}
.modal { background: var(--card); border: 1px solid var(--border2); border-radius: var(--radius); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.25s; }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.modal-body { padding: 1.5rem; }
.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; justify-content: flex-end; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

/* ── TOAST ── */
.toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 300; display: flex; flex-direction: column; gap: 0.5rem; }
.toast { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; animation: slideIn 0.3s; min-width: 240px; display: flex; align-items: center; gap: 8px; border: 1px solid; }
.toast-success { background: rgba(52,211,153,0.15); color: var(--green); border-color: rgba(52,211,153,0.3); }
.toast-error { background: rgba(248,113,113,0.15); color: var(--red); border-color: rgba(248,113,113,0.3); }
.toast-info { background: rgba(108,99,255,0.15); color: var(--accent2); border-color: rgba(108,99,255,0.3); }

/* ── PAGES ── */
.page { flex: 1; }

/* ── LANDING ── */
.landing { min-height: calc(100vh - 60px); }
.hero {
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 20%, rgba(108,99,255,0.12), transparent);
  pointer-events: none;
}
.hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; }
.hero-gradient { background: linear-gradient(135deg, var(--accent2), var(--accent3), var(--pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { font-size: 1.1rem; color: var(--text2); max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.7; }
.hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }

.features { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
.feature-card { padding: 1.5rem; border-radius: var(--radius); border: 1px solid var(--border); background: var(--card); transition: transform 0.2s, border-color 0.2s; }
.feature-card:hover { transform: translateY(-3px); border-color: var(--border2); }
.feature-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(108,99,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 1rem; }
.feature-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.feature-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }

/* ── AUTH ── */
.auth-page { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 60px); padding: 2rem; }
.auth-card { width: 100%; max-width: 420px; }
.auth-divider { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; color: var(--text3); font-size: 12px; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.btn-google { width: 100%; justify-content: center; gap: 10px; padding: 10px; background: var(--bg3); border: 1px solid var(--border); color: var(--text); font-size: 14px; }
.btn-google:hover { background: var(--bg4); border-color: var(--border2); }
.auth-footer { margin-top: 1.25rem; text-align: center; font-size: 13px; color: var(--text2); }
.link { color: var(--accent2); cursor: pointer; text-decoration: none; }
.link:hover { text-decoration: underline; }

/* ── DASHBOARD ── */
.dashboard { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.dashboard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
.stat-num { font-size: 2rem; font-weight: 700; font-family: 'DM Mono', monospace; }
.stat-label { font-size: 12px; color: var(--text2); margin-top: 4px; }
.resumes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.resume-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all 0.2s; cursor: pointer; }
.resume-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--glow); }
.resume-card-preview { height: 160px; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; overflow: hidden; }
.resume-card-preview::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, var(--card)); }
.resume-card-body { padding: 1rem; }
.resume-card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.resume-card-meta { font-size: 12px; color: var(--text2); }
.resume-card-actions { display: flex; gap: 6px; padding: 0.75rem 1rem; border-top: 1px solid var(--border); }
.new-resume-card { border: 2px dashed var(--border); background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; min-height: 280px; cursor: pointer; transition: all 0.2s; }
.new-resume-card:hover { border-color: var(--accent); background: rgba(108,99,255,0.05); }
.new-resume-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(108,99,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 28px; }

/* ── BUILDER ── */
.builder { display: grid; grid-template-columns: 340px 1fr; height: calc(100vh - 60px); overflow: hidden; }
.builder-sidebar { background: var(--bg2); border-right: 1px solid var(--border); overflow-y: auto; }
.builder-main { background: var(--bg); overflow-y: auto; }
.builder-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem; position: sticky; top: 0; background: inherit; z-index: 10; }
.builder-title { font-size: 14px; font-weight: 600; flex: 1; }
.section-nav { padding: 1rem; }
.section-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; color: var(--text2); font-size: 13px; font-weight: 500; transition: all 0.15s; margin-bottom: 4px; }
.section-item:hover { background: var(--bg3); color: var(--text); }
.section-item.active { background: rgba(108,99,255,0.15); color: var(--accent2); }
.section-icon { font-size: 16px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: var(--bg3); flex-shrink: 0; }
.section-item.active .section-icon { background: rgba(108,99,255,0.2); }

.form-section { padding: 1.5rem; animation: slideIn 0.2s; }
.section-header { margin-bottom: 1.5rem; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.section-sub { font-size: 12px; color: var(--text2); }

.array-item { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1rem; position: relative; }
.array-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.array-item-title { font-size: 13px; font-weight: 600; }

.skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.skill-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.25); font-size: 12px; color: var(--accent2); }
.skill-tag-remove { cursor: pointer; opacity: 0.6; font-size: 14px; line-height: 1; }
.skill-tag-remove:hover { opacity: 1; }

.add-skill-row { display: flex; gap: 8px; }

/* ── PREVIEW ── */
.preview-wrapper { padding: 2rem; display: flex; justify-content: center; }
.preview-frame { background: #fff; color: #111; width: 100%; max-width: 780px; min-height: 900px; border-radius: var(--radius); box-shadow: 0 8px 40px rgba(0,0,0,0.3); overflow: hidden; }
.preview-toolbar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background: var(--bg2); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 5; flex-wrap: wrap; }
.template-selector { display: flex; gap: 6px; background: var(--bg3); padding: 4px; border-radius: var(--radius-sm); }
.template-btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; border: none; background: transparent; color: var(--text2); font-family: 'Sora', sans-serif; font-weight: 500; transition: all 0.15s; }
.template-btn.active { background: var(--card); color: var(--text); }

/* ── RESUME TEMPLATES ── */
/* Template 1: Modern */
.t1-resume { font-family: 'Georgia', serif; padding: 2.5rem; }
.t1-header { display: flex; gap: 2rem; margin-bottom: 2rem; border-bottom: 3px solid #6c63ff; padding-bottom: 1.5rem; align-items: flex-start; }
.t1-photo { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #6c63ff; flex-shrink: 0; background: #e0e0ff; display: flex; align-items: center; justify-content: center; font-size: 32px; }
.t1-name { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; font-family: 'Sora', sans-serif; }
.t1-role { font-size: 15px; color: #6c63ff; font-weight: 600; margin-bottom: 8px; font-family: 'Sora', sans-serif; }
.t1-contact { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: #666; }
.t1-contact span { display: flex; align-items: center; gap: 4px; }
.t1-section { margin-bottom: 1.5rem; }
.t1-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6c63ff; border-bottom: 1px solid #e0e0ff; padding-bottom: 4px; margin-bottom: 0.75rem; font-family: 'Sora', sans-serif; }
.t1-entry { margin-bottom: 0.75rem; }
.t1-entry-header { display: flex; justify-content: space-between; align-items: baseline; }
.t1-entry-title { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.t1-entry-sub { font-size: 13px; color: #555; }
.t1-entry-date { font-size: 12px; color: #888; font-family: 'DM Mono', monospace; }
.t1-entry-desc { font-size: 13px; color: #444; margin-top: 4px; line-height: 1.6; }
.t1-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.t1-skill { padding: 3px 10px; border-radius: 20px; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.2); font-size: 12px; color: #6c63ff; }
.t1-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

/* Template 2: Minimal */
.t2-resume { font-family: 'Helvetica Neue', sans-serif; padding: 2.5rem; }
.t2-header { margin-bottom: 2rem; }
.t2-name { font-size: 32px; font-weight: 700; color: #0a0a0f; letter-spacing: -0.5px; }
.t2-role { font-size: 15px; color: #555; margin-top: 4px; }
.t2-contact { display: flex; gap: 20px; margin-top: 10px; font-size: 12px; color: #777; flex-wrap: wrap; }
.t2-divider { height: 2px; background: #0a0a0f; margin: 1.5rem 0; }
.t2-section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #333; margin-bottom: 0.75rem; }
.t2-entry { display: grid; grid-template-columns: 130px 1fr; gap: 1rem; margin-bottom: 0.75rem; font-size: 13px; }
.t2-entry-date { color: #888; font-size: 12px; padding-top: 1px; }
.t2-entry-title { font-weight: 600; color: #111; }
.t2-entry-sub { color: #555; margin-top: 2px; }
.t2-entry-desc { color: #444; margin-top: 4px; line-height: 1.6; font-size: 12px; }
.t2-skills { display: flex; flex-wrap: wrap; gap: 8px; }
.t2-skill { font-size: 12px; color: #333; border-bottom: 1.5px solid #333; padding-bottom: 1px; }
.t2-section { margin-bottom: 1.5rem; }

/* Template 3: Bold */
.t3-resume { font-family: 'Sora', sans-serif; }
.t3-header { background: linear-gradient(135deg, #6c63ff, #38bdf8); padding: 2.5rem; color: white; }
.t3-name { font-size: 30px; font-weight: 700; margin-bottom: 4px; }
.t3-role { font-size: 15px; opacity: 0.85; margin-bottom: 12px; }
.t3-contact { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; opacity: 0.85; }
.t3-body { display: grid; grid-template-columns: 200px 1fr; }
.t3-sidebar { background: #1a1a2e; padding: 1.5rem; }
.t3-main { padding: 1.5rem 2rem; }
.t3-sidebar-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6c63ff; margin-bottom: 0.6rem; margin-top: 1.2rem; }
.t3-sidebar-title:first-child { margin-top: 0; }
.t3-skill-bar { background: #2a2a3e; border-radius: 4px; height: 5px; overflow: hidden; margin-bottom: 4px; }
.t3-skill-fill { height: 100%; background: linear-gradient(90deg, #6c63ff, #38bdf8); border-radius: 4px; }
.t3-skill-name { font-size: 11px; color: #aaa; margin-bottom: 4px; }
.t3-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6c63ff; border-left: 3px solid #6c63ff; padding-left: 10px; margin-bottom: 0.75rem; }
.t3-entry { margin-bottom: 1rem; }
.t3-entry-title { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.t3-entry-sub { font-size: 12px; color: #555; }
.t3-entry-date { font-size: 11px; color: #38bdf8; font-family: 'DM Mono', monospace; margin-top: 2px; }
.t3-entry-desc { font-size: 12px; color: #444; margin-top: 4px; line-height: 1.6; }
.t3-section { margin-bottom: 1.5rem; }

/* ── ADMIN ── */
.admin { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th { padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text2); border-bottom: 1px solid var(--border); font-weight: 600; }
.admin-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.admin-table tr:hover td { background: var(--bg3); }
.avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }

/* ── PROGRESS ── */
.progress-bar { height: 6px; background: var(--bg4); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent3)); border-radius: 3px; transition: width 0.4s; }

/* ── SECTION DRAG HINT ── */
.drag-handle { cursor: grab; color: var(--text3); font-size: 16px; padding: 4px; }
.drag-handle:active { cursor: grabbing; }

/* ── EMPTY STATE ── */
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text2); }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-title { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.empty-desc { font-size: 13px; }

/* ── PROFILE PHOTO ── */
.photo-upload-area { width: 80px; height: 80px; border-radius: 50%; border: 2px dashed var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; position: relative; transition: border-color 0.2s; }
.photo-upload-area:hover { border-color: var(--accent); }
.photo-upload-area img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { font-size: 28px; color: var(--text3); }

/* ── STEP INDICATOR ── */
.step-list { padding: 1rem; }
.step-divider { height: 1px; background: var(--border); margin: 0.5rem 0; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .builder { grid-template-columns: 1fr; }
  .builder-sidebar { height: auto; max-height: 60px; overflow: hidden; }
  .builder-sidebar.open { max-height: none; }
}
@media (max-width: 700px) {
  .form-row, .form-row-3 { grid-template-columns: 1fr; }
  .t1-two-col, .t3-body { grid-template-columns: 1fr; }
  .builder { height: auto; }
  .resumes-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .dashboard-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .navbar { padding: 0 1rem; }
  .dashboard, .admin { padding: 1rem; }
  .hero { padding: 3rem 1rem 2rem; }
  .preview-wrapper { padding: 1rem; }
}
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_RESUME = {
  id: null,
  title: "My Resume",
  template: "modern",
  personal: { name: "", role: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "", photo: "" },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  socialLinks: [],
};

const MOCK_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", resumes: 4, joined: "2024-01-15", status: "active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", resumes: 2, joined: "2024-02-20", status: "active" },
  { id: 3, name: "Carol White", email: "carol@example.com", resumes: 7, joined: "2024-03-05", status: "active" },
  { id: 4, name: "David Lee", email: "david@example.com", resumes: 1, joined: "2024-04-12", status: "inactive" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }
function dateStr(d = new Date()) { return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
function getInitials(name) { return name ? name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() : "?"; }
function avatarColor(name) { const colors = ["#6c63ff","#38bdf8","#34d399","#f472b6","#fbbf24"]; return colors[name.charCodeAt(0) % colors.length]; }

function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  const set = useCallback(v => { const nv = typeof v === "function" ? v(val) : v; setVal(nv); try { localStorage.setItem(key, JSON.stringify(nv)); } catch {} }, [val]);
  return [val, set];
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return <div className="toast-container">{toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}><span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>{t.msg}</div>)}</div>;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, setUser, theme, setTheme, addToast }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>⚡ ResumeCloud</div>
      <div className="navbar-actions">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} title="Toggle theme">{theme === "dark" ? "☀️" : "🌙"}</button>
        {user ? (
          <>
            {user.isAdmin && <button className="btn btn-ghost btn-sm" onClick={() => setPage("admin")}>Admin</button>}
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("dashboard")}>Dashboard</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => { setUser(null); setPage("home"); addToast("Logged out", "info"); }}>
              <div className="avatar" style={{ background: avatarColor(user.name), fontSize: 13, color: "#fff" }}>{getInitials(user.name)}</div>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Logout</span>
            </div>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage("login")}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("signup")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const features = [
    { icon: "🎨", title: "Multiple Templates", desc: "Choose from Modern, Minimal, and Bold templates. More coming soon." },
    { icon: "☁️", title: "Cloud Storage", desc: "All resumes auto-saved and accessible from any device, anywhere." },
    { icon: "📄", title: "PDF Export", desc: "Download your resume as a pixel-perfect PDF with one click." },
    { icon: "⚡", title: "Real-time Preview", desc: "See your resume update live as you type — no refresh needed." },
    { icon: "🔒", title: "Secure Auth", desc: "JWT authentication with Google OAuth support for seamless login." },
    { icon: "📊", title: "Analytics", desc: "Track when resumes were last updated and manage all versions." },
  ];
  return (
    <div className="landing">
      <div className="hero">
        <h1 className="hero-title">Build Your Career<br /><span className="hero-gradient">in the Cloud</span></h1>
        <p className="hero-desc">Create stunning resumes with real-time preview, cloud storage, and PDF export — all in one modern platform.</p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Get Started Free →</button>
          <button className="btn btn-ghost btn-lg" onClick={() => setPage("login")}>Sign In</button>
        </div>
      </div>
      <div className="features">
        <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 24, fontWeight: 700 }}>Everything you need</h2>
        <p style={{ textAlign: "center", color: "var(--text2)", fontSize: 14 }}>Professional resume building, simplified.</p>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ mode, setPage, setUser, addToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handle = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = { id: uid(), name: form.name || form.email.split("@")[0], email: form.email, isAdmin: form.email.includes("admin") };
      setUser(user);
      addToast(mode === "login" ? "Welcome back! 👋" : "Account created! 🎉", "success");
      setPage("dashboard");
      setLoading(false);
    }, 800);
  };
  const googleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = { id: uid(), name: "Google User", email: "user@gmail.com", isAdmin: false };
      setUser(user);
      addToast("Signed in with Google! 🚀", "success");
      setPage("dashboard");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 1.5 + "rem" }}>{mode === "login" ? "Log in to access your resumes" : "Start building your resume for free"}</p>
        <button className="btn btn-google" onClick={googleLogin}>
          <span>🔵</span> Continue with Google
        </button>
        <div className="auth-divider">or</div>
        <form onSubmit={handle}>
          {mode === "signup" && <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={form.name} onChange={upd("name")} placeholder="Jane Doe" required /></div>}
          <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={upd("email")} placeholder="you@example.com" required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={form.password} onChange={upd("password")} placeholder="••••••••" required /></div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px" }} type="submit" disabled={loading}>{loading ? "⏳ Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</button>
        </form>
        <div className="auth-footer">
          {mode === "login" ? <>Don't have an account? <span className="link" onClick={() => setPage("signup")}>Sign up</span></> : <>Already have an account? <span className="link" onClick={() => setPage("login")}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ user, resumes, setResumes, setPage, setCurrentResume, addToast }) {
  const [deleteId, setDeleteId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const userResumes = resumes.filter(r => r.userId === user.id);

  const createNew = () => {
    const r = { ...JSON.parse(JSON.stringify(INITIAL_RESUME)), id: uid(), userId: user.id, title: "Untitled Resume", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setResumes(rs => [...rs, r]);
    setCurrentResume(r);
    setPage("builder");
    addToast("New resume created!", "success");
  };
  const edit = r => { setCurrentResume(r); setPage("builder"); };
  const del = id => { setResumes(rs => rs.filter(r => r.id !== id)); setDeleteId(null); addToast("Resume deleted", "info"); };
  const duplicate = r => { const n = { ...JSON.parse(JSON.stringify(r)), id: uid(), title: r.title + " (copy)", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; setResumes(rs => [...rs, n]); addToast("Resume duplicated!", "success"); };
  const rename = () => { setResumes(rs => rs.map(r => r.id === renameId ? { ...r, title: renameVal } : r)); setRenameId(null); addToast("Renamed!", "success"); };

  const TEMPLATE_EMOJI = { modern: "🟣", minimal: "⬜", bold: "🔷" };

  return (
    <div className="page">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back, {user.name.split(" ")[0]} 👋</h1>
            <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{dateStr()}</p>
          </div>
          <button className="btn btn-primary" onClick={createNew}>+ New Resume</button>
        </div>
        <div className="stats-grid">
          {[
            { num: userResumes.length, label: "Total Resumes", col: "var(--accent2)" },
            { num: userResumes.filter(r => { const d = new Date(r.updatedAt); return (Date.now() - d) < 7 * 86400000; }).length, label: "Updated This Week", col: "var(--green)" },
            { num: new Set(userResumes.map(r => r.template)).size, label: "Templates Used", col: "var(--amber)" },
            { num: userResumes.reduce((a, r) => a + ((r.experience?.length || 0) + (r.education?.length || 0)), 0), label: "Sections Added", col: "var(--accent3)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-num" style={{ color: s.col }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="resumes-grid">
          <div className="resume-card new-resume-card" onClick={createNew}>
            <div className="new-resume-icon">+</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Create New Resume</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Start from scratch</div>
          </div>
          {userResumes.map(r => (
            <div key={r.id} className="resume-card">
              <div className="resume-card-preview" onClick={() => edit(r)}><span>{TEMPLATE_EMOJI[r.template] || "📄"}</span><div style={{ position: "absolute", bottom: 8, right: 8 }}><span className="badge badge-accent">{r.template}</span></div></div>
              <div className="resume-card-body">
                <div className="resume-card-title">{r.title}</div>
                <div className="resume-card-meta">Updated {dateStr(new Date(r.updatedAt))}</div>
              </div>
              <div className="resume-card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => edit(r)}>Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => duplicate(r)}>Copy</button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setRenameId(r.id); setRenameVal(r.title); }}>Rename</button>
                <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }} onClick={() => setDeleteId(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {deleteId && <div className="modal-overlay"><div className="modal"><div className="modal-header"><span style={{ fontWeight: 600 }}>Delete Resume?</span><button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteId(null)}>✕</button></div><div className="modal-body"><p style={{ fontSize: 14, color: "var(--text2)" }}>This action cannot be undone.</p></div><div className="modal-footer"><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={() => del(deleteId)}>Delete</button></div></div></div>}
      {renameId && <div className="modal-overlay"><div className="modal"><div className="modal-header"><span style={{ fontWeight: 600 }}>Rename Resume</span><button className="btn btn-ghost btn-icon btn-sm" onClick={() => setRenameId(null)}>✕</button></div><div className="modal-body"><input className="form-control" value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && rename()} /></div><div className="modal-footer"><button className="btn btn-ghost" onClick={() => setRenameId(null)}>Cancel</button><button className="btn btn-primary" onClick={rename}>Save</button></div></div></div>}
    </div>
  );
}

// ─── RESUME PREVIEW ───────────────────────────────────────────────────────────
function ResumePreview({ data }) {
  const { personal, education, experience, skills, projects, certifications, languages, template } = data;
  const p = personal;

  if (template === "minimal") return (
    <div className="t2-resume">
      <div className="t2-header">
        <div className="t2-name">{p.name || "Your Name"}</div>
        <div className="t2-role">{p.role}</div>
        <div className="t2-contact">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>
      <div className="t2-divider" />
      {p.summary && <div className="t2-section"><div className="t2-section-title">Summary</div><p style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{p.summary}</p></div>}
      {experience?.length > 0 && <div className="t2-section"><div className="t2-section-title">Experience</div>{experience.map(e => <div key={e.id} className="t2-entry"><div className="t2-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — Present" : ""}</div><div><div className="t2-entry-title">{e.title}</div><div className="t2-entry-sub">{e.company}{e.location ? `, ${e.location}` : ""}</div><div className="t2-entry-desc">{e.description}</div></div></div>)}</div>}
      {education?.length > 0 && <div className="t2-section"><div className="t2-section-title">Education</div>{education.map(e => <div key={e.id} className="t2-entry"><div className="t2-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}</div><div><div className="t2-entry-title">{e.degree} in {e.field}</div><div className="t2-entry-sub">{e.school}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div></div></div>)}</div>}
      {skills?.length > 0 && <div className="t2-section"><div className="t2-section-title">Skills</div><div className="t2-skills">{skills.map(s => <span key={s} className="t2-skill">{s}</span>)}</div></div>}
      {projects?.length > 0 && <div className="t2-section"><div className="t2-section-title">Projects</div>{projects.map(pr => <div key={pr.id} className="t2-entry"><div className="t2-entry-date">{pr.year}</div><div><div className="t2-entry-title">{pr.name}</div><div className="t2-entry-sub">{pr.tech}</div><div className="t2-entry-desc">{pr.description}</div></div></div>)}</div>}
    </div>
  );

  if (template === "bold") return (
    <div className="t3-resume">
      <div className="t3-header">
        <div className="t3-name">{p.name || "Your Name"}</div>
        <div className="t3-role">{p.role}</div>
        <div className="t3-contact">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
        </div>
      </div>
      <div className="t3-body">
        <div className="t3-sidebar">
          {skills?.length > 0 && <><div className="t3-sidebar-title">Skills</div>{skills.map(s => <div key={s}><div className="t3-skill-name">{s}</div><div className="t3-skill-bar"><div className="t3-skill-fill" style={{ width: `${60 + Math.random() * 40}%` }} /></div></div>)}</>}
          {languages?.length > 0 && <><div className="t3-sidebar-title">Languages</div>{languages.map(l => <div key={l.id} style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{l.name} <span style={{ color: "#6c63ff" }}>{l.level}</span></div>)}</>}
          {certifications?.length > 0 && <><div className="t3-sidebar-title">Certifications</div>{certifications.map(c => <div key={c.id} style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}><div style={{ color: "#ddd", fontWeight: 600 }}>{c.name}</div><div>{c.issuer} · {c.year}</div></div>)}</>}
          {p.linkedin && <><div className="t3-sidebar-title">Links</div><div style={{ fontSize: 11, color: "#aaa" }}>in/{p.linkedin}</div></>}
        </div>
        <div className="t3-main">
          {p.summary && <div className="t3-section"><div className="t3-section-title">Profile</div><p style={{ fontSize: 13, color: "#333", lineHeight: 1.7 }}>{p.summary}</p></div>}
          {experience?.length > 0 && <div className="t3-section"><div className="t3-section-title">Experience</div>{experience.map(e => <div key={e.id} className="t3-entry"><div className="t3-entry-title">{e.title}</div><div className="t3-entry-sub">{e.company}{e.location ? ` · ${e.location}` : ""}</div><div className="t3-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — Present" : ""}</div><div className="t3-entry-desc">{e.description}</div></div>)}</div>}
          {education?.length > 0 && <div className="t3-section"><div className="t3-section-title">Education</div>{education.map(e => <div key={e.id} className="t3-entry"><div className="t3-entry-title">{e.degree} in {e.field}</div><div className="t3-entry-sub">{e.school}</div><div className="t3-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}</div></div>)}</div>}
          {projects?.length > 0 && <div className="t3-section"><div className="t3-section-title">Projects</div>{projects.map(pr => <div key={pr.id} className="t3-entry"><div className="t3-entry-title">{pr.name} {pr.link && <span style={{ fontSize: 11, color: "#38bdf8" }}>↗ {pr.link}</span>}</div><div className="t3-entry-sub">{pr.tech}</div><div className="t3-entry-desc">{pr.description}</div></div>)}</div>}
        </div>
      </div>
    </div>
  );

  // Default: Modern
  return (
    <div className="t1-resume">
      <div className="t1-header">
        {p.photo ? <img className="t1-photo" src={p.photo} alt="Profile" /> : <div className="t1-photo" style={{ background: "#e0e0ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#6c63ff" }}>{getInitials(p.name) || "?"}</div>}
        <div style={{ flex: 1 }}>
          <div className="t1-name">{p.name || "Your Name"}</div>
          <div className="t1-role">{p.role}</div>
          <div className="t1-contact">
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>📞 {p.phone}</span>}
            {p.location && <span>📍 {p.location}</span>}
            {p.website && <span>🌐 {p.website}</span>}
            {p.linkedin && <span>in {p.linkedin}</span>}
            {p.github && <span>⚡ {p.github}</span>}
          </div>
        </div>
      </div>
      {p.summary && <div className="t1-section"><div className="t1-section-title">Summary</div><p style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{p.summary}</p></div>}
      <div className="t1-two-col">
        <div>
          {experience?.length > 0 && <div className="t1-section"><div className="t1-section-title">Experience</div>{experience.map(e => <div key={e.id} className="t1-entry"><div className="t1-entry-header"><div><div className="t1-entry-title">{e.title}</div><div className="t1-entry-sub">{e.company}{e.location ? ` · ${e.location}` : ""}</div></div><div className="t1-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — Present" : ""}</div></div><div className="t1-entry-desc">{e.description}</div></div>)}</div>}
          {projects?.length > 0 && <div className="t1-section"><div className="t1-section-title">Projects</div>{projects.map(pr => <div key={pr.id} className="t1-entry"><div className="t1-entry-header"><div className="t1-entry-title">{pr.name}</div><div className="t1-entry-date">{pr.year}</div></div><div className="t1-entry-sub">{pr.tech}</div><div className="t1-entry-desc">{pr.description}</div></div>)}</div>}
        </div>
        <div>
          {education?.length > 0 && <div className="t1-section"><div className="t1-section-title">Education</div>{education.map(e => <div key={e.id} className="t1-entry"><div className="t1-entry-title">{e.degree} in {e.field}</div><div className="t1-entry-sub">{e.school}</div><div className="t1-entry-date">{e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}</div></div>)}</div>}
          {skills?.length > 0 && <div className="t1-section"><div className="t1-section-title">Skills</div><div className="t1-skills">{skills.map(s => <span key={s} className="t1-skill">{s}</span>)}</div></div>}
          {certifications?.length > 0 && <div className="t1-section"><div className="t1-section-title">Certifications</div>{certifications.map(c => <div key={c.id} className="t1-entry"><div className="t1-entry-title">{c.name}</div><div className="t1-entry-sub">{c.issuer}</div><div className="t1-entry-date">{c.year}</div></div>)}</div>}
          {languages?.length > 0 && <div className="t1-section"><div className="t1-section-title">Languages</div>{languages.map(l => <div key={l.id} className="t1-entry"><div className="t1-entry-header"><div className="t1-entry-title">{l.name}</div><span className="t1-skill">{l.level}</span></div></div>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── BUILDER ─────────────────────────────────────────────────────────────────
function Builder({ resume, setResumes, resumes, setPage, addToast }) {
  const [data, setData] = useState(resume);
  const [activeSection, setActiveSection] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const autoSaveTimer = useRef(null);

  const upd = (path, value) => {
    setData(d => {
      const nd = JSON.parse(JSON.stringify(d));
      const keys = path.split(".");
      let obj = nd;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return nd;
    });
  };

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      save(true);
    }, 2000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [data]);

  const save = (silent = false) => {
    setSaving(true);
    setTimeout(() => {
      const updated = { ...data, updatedAt: new Date().toISOString() };
      setResumes(rs => rs.map(r => r.id === updated.id ? updated : r));
      setSaving(false);
      if (!silent) addToast("Resume saved! ☁️", "success");
    }, 400);
  };

  const addArrayItem = (field, template) => {
    upd(field, [...(data[field] || []), { ...template, id: uid() }]);
  };
  const removeArrayItem = (field, id) => {
    upd(field, data[field].filter(i => i.id !== id));
  };
  const updArrayItem = (field, id, key, val) => {
    upd(field, data[field].map(i => i.id === id ? { ...i, [key]: val } : i));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const s = skillInput.trim();
    if (!data.skills.includes(s)) upd("skills", [...data.skills, s]);
    setSkillInput("");
  };

  const downloadPDF = () => {
    addToast("Preparing PDF download... 📄", "info");
    setTimeout(() => { window.print(); }, 300);
  };

  const SECTIONS = [
    { id: "personal", icon: "👤", label: "Personal Details" },
    { id: "experience", icon: "💼", label: "Experience" },
    { id: "education", icon: "🎓", label: "Education" },
    { id: "skills", icon: "⚡", label: "Skills" },
    { id: "projects", icon: "🚀", label: "Projects" },
    { id: "certifications", icon: "🏆", label: "Certifications" },
    { id: "languages", icon: "🌍", label: "Languages" },
    { id: "social", icon: "🔗", label: "Social Links" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "personal": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Personal Details</div><div className="section-sub">Your core contact information</div></div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginBottom: "1rem" }}>
            <label className="photo-upload-area" title="Click to upload photo">
              {data.personal.photo ? <img src={data.personal.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="photo-placeholder">👤</span>}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => upd("personal.photo", ev.target.result); r.readAsDataURL(f); } }} />
            </label>
            <div style={{ flex: 1 }}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={data.personal.name} onChange={e => upd("personal.name", e.target.value)} placeholder="Jane Doe" /></div>
              <div className="form-group"><label className="form-label">Professional Title</label><input className="form-control" value={data.personal.role} onChange={e => upd("personal.role", e.target.value)} placeholder="Software Engineer" /></div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={data.personal.email} onChange={e => upd("personal.email", e.target.value)} placeholder="jane@example.com" /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={data.personal.phone} onChange={e => upd("personal.phone", e.target.value)} placeholder="+1 234 567 8900" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Location</label><input className="form-control" value={data.personal.location} onChange={e => upd("personal.location", e.target.value)} placeholder="New York, NY" /></div>
            <div className="form-group"><label className="form-label">Website</label><input className="form-control" value={data.personal.website} onChange={e => upd("personal.website", e.target.value)} placeholder="https://janedoe.dev" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">LinkedIn</label><input className="form-control" value={data.personal.linkedin} onChange={e => upd("personal.linkedin", e.target.value)} placeholder="linkedin.com/in/janedoe" /></div>
            <div className="form-group"><label className="form-label">GitHub</label><input className="form-control" value={data.personal.github} onChange={e => upd("personal.github", e.target.value)} placeholder="github.com/janedoe" /></div>
          </div>
          <div className="form-group"><label className="form-label">Professional Summary</label><textarea className="form-control" value={data.personal.summary} onChange={e => upd("personal.summary", e.target.value)} placeholder="Brief 2-3 sentence summary of your professional background and goals..." style={{ minHeight: 100 }} /></div>
        </div>
      );
      case "experience": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Work Experience</div></div>
          {data.experience.map((e, i) => (
            <div key={e.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{e.title || `Experience ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("experience", e.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Job Title</label><input className="form-control" value={e.title} onChange={ev => updArrayItem("experience", e.id, "title", ev.target.value)} placeholder="Software Engineer" /></div>
                <div className="form-group"><label className="form-label">Company</label><input className="form-control" value={e.company} onChange={ev => updArrayItem("experience", e.id, "company", ev.target.value)} placeholder="Acme Corp" /></div>
              </div>
              <div className="form-row-3">
                <div className="form-group"><label className="form-label">Start Date</label><input className="form-control" value={e.startDate} onChange={ev => updArrayItem("experience", e.id, "startDate", ev.target.value)} placeholder="Jan 2022" /></div>
                <div className="form-group"><label className="form-label">End Date</label><input className="form-control" value={e.endDate} onChange={ev => updArrayItem("experience", e.id, "endDate", ev.target.value)} placeholder="Present" disabled={e.current} /></div>
                <div className="form-group" style={{ display: "flex", alignItems: "flex-end", paddingBottom: 0 }}><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)", cursor: "pointer" }}><input type="checkbox" checked={e.current} onChange={ev => updArrayItem("experience", e.id, "current", ev.target.checked)} /> Current</label></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Location</label><input className="form-control" value={e.location} onChange={ev => updArrayItem("experience", e.id, "location", ev.target.value)} placeholder="Remote / NY" /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={e.description} onChange={ev => updArrayItem("experience", e.id, "description", ev.target.value)} placeholder="Describe your role, responsibilities, and achievements..." /></div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("experience", { title: "", company: "", startDate: "", endDate: "", current: false, location: "", description: "" })}>+ Add Experience</button>
        </div>
      );
      case "education": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Education</div></div>
          {data.education.map((e, i) => (
            <div key={e.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{e.school || `Education ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("education", e.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">School / University</label><input className="form-control" value={e.school} onChange={ev => updArrayItem("education", e.id, "school", ev.target.value)} placeholder="MIT" /></div>
                <div className="form-group"><label className="form-label">Degree</label><input className="form-control" value={e.degree} onChange={ev => updArrayItem("education", e.id, "degree", ev.target.value)} placeholder="Bachelor of Science" /></div>
              </div>
              <div className="form-row-3">
                <div className="form-group"><label className="form-label">Field of Study</label><input className="form-control" value={e.field} onChange={ev => updArrayItem("education", e.id, "field", ev.target.value)} placeholder="Computer Science" /></div>
                <div className="form-group"><label className="form-label">Start Year</label><input className="form-control" value={e.startDate} onChange={ev => updArrayItem("education", e.id, "startDate", ev.target.value)} placeholder="2018" /></div>
                <div className="form-group"><label className="form-label">End Year</label><input className="form-control" value={e.endDate} onChange={ev => updArrayItem("education", e.id, "endDate", ev.target.value)} placeholder="2022" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">GPA (optional)</label><input className="form-control" value={e.gpa} onChange={ev => updArrayItem("education", e.id, "gpa", ev.target.value)} placeholder="3.8 / 4.0" /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("education", { school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" })}>+ Add Education</button>
        </div>
      );
      case "skills": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Skills</div><div className="section-sub">Add skills and press Enter or click Add</div></div>
          <div className="add-skill-row">
            <input className="form-control" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} placeholder="e.g. React, Python, Figma..." style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={addSkill}>Add</button>
          </div>
          <div className="skill-tags" style={{ marginTop: "1rem" }}>
            {data.skills.map(s => <span key={s} className="skill-tag">{s}<span className="skill-tag-remove" onClick={() => upd("skills", data.skills.filter(x => x !== s))}>×</span></span>)}
          </div>
          {data.skills.length === 0 && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: "0.75rem" }}>No skills added yet.</p>}
        </div>
      );
      case "projects": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Projects</div></div>
          {data.projects.map((pr, i) => (
            <div key={pr.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{pr.name || `Project ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("projects", pr.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Project Name</label><input className="form-control" value={pr.name} onChange={ev => updArrayItem("projects", pr.id, "name", ev.target.value)} placeholder="My Awesome App" /></div>
                <div className="form-group"><label className="form-label">Year</label><input className="form-control" value={pr.year} onChange={ev => updArrayItem("projects", pr.id, "year", ev.target.value)} placeholder="2024" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Technologies</label><input className="form-control" value={pr.tech} onChange={ev => updArrayItem("projects", pr.id, "tech", ev.target.value)} placeholder="React, Node.js, MongoDB" /></div>
                <div className="form-group"><label className="form-label">Link (optional)</label><input className="form-control" value={pr.link} onChange={ev => updArrayItem("projects", pr.id, "link", ev.target.value)} placeholder="https://github.com/..." /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={pr.description} onChange={ev => updArrayItem("projects", pr.id, "description", ev.target.value)} placeholder="What you built and what impact it had..." /></div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("projects", { name: "", year: "", tech: "", link: "", description: "" })}>+ Add Project</button>
        </div>
      );
      case "certifications": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Certifications</div></div>
          {data.certifications.map((c, i) => (
            <div key={c.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{c.name || `Certification ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("certifications", c.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Certificate Name</label><input className="form-control" value={c.name} onChange={ev => updArrayItem("certifications", c.id, "name", ev.target.value)} placeholder="AWS Solutions Architect" /></div>
                <div className="form-group"><label className="form-label">Issuing Organization</label><input className="form-control" value={c.issuer} onChange={ev => updArrayItem("certifications", c.id, "issuer", ev.target.value)} placeholder="Amazon" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Year</label><input className="form-control" value={c.year} onChange={ev => updArrayItem("certifications", c.id, "year", ev.target.value)} placeholder="2024" /></div>
                <div className="form-group"><label className="form-label">Credential ID</label><input className="form-control" value={c.credentialId} onChange={ev => updArrayItem("certifications", c.id, "credentialId", ev.target.value)} placeholder="ABC-123" /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("certifications", { name: "", issuer: "", year: "", credentialId: "" })}>+ Add Certification</button>
        </div>
      );
      case "languages": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Languages</div></div>
          {data.languages.map((l, i) => (
            <div key={l.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{l.name || `Language ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("languages", l.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Language</label><input className="form-control" value={l.name} onChange={ev => updArrayItem("languages", l.id, "name", ev.target.value)} placeholder="English" /></div>
                <div className="form-group"><label className="form-label">Proficiency</label>
                  <select className="form-control" value={l.level} onChange={ev => updArrayItem("languages", l.id, "level", ev.target.value)}>
                    <option value="">Select level</option>
                    {["Native", "Fluent", "Advanced", "Intermediate", "Basic"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("languages", { name: "", level: "" })}>+ Add Language</button>
        </div>
      );
      case "social": return (
        <div className="form-section">
          <div className="section-header"><div className="section-title">Social Links</div></div>
          {data.socialLinks.map((s, i) => (
            <div key={s.id} className="array-item">
              <div className="array-item-header"><div className="array-item-title">{s.platform || `Link ${i + 1}`}</div><button className="btn btn-danger btn-sm" onClick={() => removeArrayItem("socialLinks", s.id)}>Remove</button></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Platform</label>
                  <select className="form-control" value={s.platform} onChange={ev => updArrayItem("socialLinks", s.id, "platform", ev.target.value)}>
                    <option value="">Select platform</option>
                    {["LinkedIn","GitHub","Twitter","Portfolio","Behance","Dribbble","Medium","Other"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">URL</label><input className="form-control" value={s.url} onChange={ev => updArrayItem("socialLinks", s.id, "url", ev.target.value)} placeholder="https://..." /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => addArrayItem("socialLinks", { platform: "", url: "" })}>+ Add Social Link</button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      <div style={{ padding: "10px 1.5rem", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage("dashboard")}>← Dashboard</button>
        <div style={{ flex: 1, minWidth: 120, fontSize: 14, fontWeight: 600 }}>{data.title}</div>
        <div className="template-selector">
          {["modern","minimal","bold"].map(t => <button key={t} className={`template-btn${data.template === t ? " active" : ""}`} onClick={() => upd("template", t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
        </div>
        <div className="tabs" style={{ fontSize: 12 }}>
          <button className={`tab${!showPreview ? " active" : ""}`} onClick={() => setShowPreview(false)}>Edit</button>
          <button className={`tab${showPreview ? " active" : ""}`} onClick={() => setShowPreview(true)}>Preview</button>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => save()}>{saving ? "⏳" : "💾"} {saving ? "Saving..." : "Save"}</button>
        <button className="btn btn-primary btn-sm" onClick={downloadPDF}>⬇ PDF</button>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: showPreview ? "1fr" : "260px 1fr", overflow: "hidden" }}>
        {!showPreview && (
          <div style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)", overflowY: "auto" }}>
            <div className="section-nav">
              {[{ id: "personal", icon: "👤", label: "Personal Details" },{ id: "experience", icon: "💼", label: "Experience" },{ id: "education", icon: "🎓", label: "Education" },{ id: "skills", icon: "⚡", label: "Skills" },{ id: "projects", icon: "🚀", label: "Projects" },{ id: "certifications", icon: "🏆", label: "Certifications" },{ id: "languages", icon: "🌍", label: "Languages" },{ id: "social", icon: "🔗", label: "Social Links" }].map(s => (
                <div key={s.id} className={`section-item${activeSection === s.id ? " active" : ""}`} onClick={() => setActiveSection(s.id)}>
                  <span className="section-icon">{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: showPreview ? "1fr" : "1fr 1fr", overflow: "hidden" }}>
          {!showPreview && <div style={{ overflowY: "auto", background: "var(--bg)" }}>{renderSection()}</div>}
          <div style={{ overflowY: "auto", background: showPreview ? "var(--bg)" : "var(--bg3)", borderLeft: showPreview ? "none" : "1px solid var(--border)" }}>
            <div className="preview-wrapper">
              <div className="preview-frame"><ResumePreview data={data} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminPanel({ resumes }) {
  const [tab, setTab] = useState("users");
  const totalStorage = resumes.reduce((a, r) => a + JSON.stringify(r).length, 0);

  return (
    <div className="page">
      <div className="admin">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div><h1 style={{ fontSize: 22, fontWeight: 700 }}>Admin Panel</h1><p style={{ fontSize: 13, color: "var(--text2)" }}>Manage users and monitor platform</p></div>
        </div>
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[{ num: MOCK_USERS.length, label: "Total Users", col: "var(--accent2)" },{ num: resumes.length, label: "Total Resumes", col: "var(--green)" },{ num: MOCK_USERS.filter(u => u.status === "active").length, label: "Active Users", col: "var(--amber)" },{ num: `${(totalStorage / 1024).toFixed(1)} KB`, label: "Storage Used", col: "var(--accent3)" }].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-num" style={{ color: s.col, fontSize: "1.75rem" }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="tabs" style={{ marginBottom: "1.5rem", width: "fit-content" }}>
          <button className={`tab${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>Users</button>
          <button className={`tab${tab === "resumes" ? " active" : ""}`} onClick={() => setTab("resumes")}>Resumes</button>
          <button className={`tab${tab === "storage" ? " active" : ""}`} onClick={() => setTab("storage")}>Storage</button>
        </div>
        {tab === "users" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table">
              <thead><tr><th>User</th><th>Email</th><th>Resumes</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>{MOCK_USERS.map(u => (
                <tr key={u.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="avatar" style={{ background: avatarColor(u.name), color: "#fff" }}>{getInitials(u.name)}</div><span style={{ fontWeight: 500 }}>{u.name}</span></div></td>
                  <td style={{ color: "var(--text2)" }}>{u.email}</td>
                  <td><span className="badge badge-accent">{u.resumes}</span></td>
                  <td style={{ color: "var(--text2)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{u.joined}</td>
                  <td><span className={`badge ${u.status === "active" ? "badge-green" : "badge-red"}`}>{u.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {tab === "resumes" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Template</th><th>User ID</th><th>Updated</th><th>Size</th></tr></thead>
              <tbody>{resumes.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text3)", padding: "2rem" }}>No resumes created yet</td></tr> : resumes.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.title}</td>
                  <td><span className="badge badge-accent">{r.template}</span></td>
                  <td style={{ color: "var(--text2)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{r.userId?.slice(0, 8)}...</td>
                  <td style={{ color: "var(--text2)", fontSize: 12 }}>{dateStr(new Date(r.updatedAt))}</td>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{(JSON.stringify(r).length / 1024).toFixed(2)} KB</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {tab === "storage" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {[{ label: "Database", used: (totalStorage / 1024).toFixed(1), max: 1024, unit: "KB" },{ label: "Media Files", used: 0, max: 500, unit: "MB" },{ label: "PDF Exports", used: resumes.length * 0.3, max: 100, unit: "MB" }].map(s => (
              <div key={s.label} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "'DM Mono', monospace" }}>{s.used}/{s.max} {s.unit}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, (s.used / s.max) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useLocalStorage("rcb_theme", "dark");
  const [user, setUser] = useLocalStorage("rcb_user", null);
  const [resumes, setResumes] = useLocalStorage("rcb_resumes", []);
  const [page, setPage] = useState(user ? "dashboard" : "home");
  const [currentResume, setCurrentResume] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = "info") => {
    const id = uid();
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  const navigate = p => {
    if ((p === "dashboard" || p === "builder") && !user) { setPage("login"); return; }
    if (p === "builder" && !currentResume) { setPage("dashboard"); return; }
    setPage(p);
  };

  return (
    <div className="app">
      <style>{CSS}</style>
      <Navbar page={page} setPage={navigate} user={user} setUser={setUser} theme={theme} setTheme={setTheme} addToast={addToast} />
      {page === "home" && <Landing setPage={navigate} />}
      {page === "login" && <AuthPage mode="login" setPage={navigate} setUser={setUser} addToast={addToast} />}
      {page === "signup" && <AuthPage mode="signup" setPage={navigate} setUser={setUser} addToast={addToast} />}
      {page === "dashboard" && user && <Dashboard user={user} resumes={resumes} setResumes={setResumes} setPage={navigate} setCurrentResume={r => { setCurrentResume(r); navigate("builder"); }} addToast={addToast} />}
      {page === "builder" && user && currentResume && <Builder resume={currentResume} resumes={resumes} setResumes={setResumes} setPage={navigate} addToast={addToast} />}
      {page === "admin" && user?.isAdmin && <AdminPanel resumes={resumes} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
