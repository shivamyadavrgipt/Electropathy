import React, { useState, useEffect } from 'react';

export default function DiseaseDetail({ theme, disease: d, note, onEdit, onDelete, onSaveNote }) {
  const dark = theme === 'dark';
  const [noteText, setNoteText] = useState(note);
  const [saved, setSaved] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const bg = dark ? '#1a1a18' : '#fff';
  const sectionBg = dark ? '#2a2a28' : '#f8f8f6';
  const cardBg = dark ? '#2a2a28' : '#fff';
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = dark ? '#f5f5f3' : '#1a1a18';
  const subText = dark ? '#a0a09d' : '#6b6b68';
  const accentBg = dark ? '#1a3a2a' : '#E1F5EE';
  const accentColor = dark ? '#9FE1CB' : '#0F6E56';
  const avoidBg = dark ? '#3a1a1a' : '#FAECE7';
  const avoidColor = dark ? '#FFA07A' : '#993C1D';
  const noteBg = dark ? '#2a2a1a' : '#FAEEDA';
  const noteColor = dark ? '#FFD700' : '#633806';

  useEffect(() => { setNoteText(note); }, [note]);

  const handleSave = async () => {
    await onSaveNote(noteText);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sectionLabel = (icon, text) => (
    <div style={{ fontSize: 11, fontWeight: 600, color: subText, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
      <span>{icon}</span> {text}
    </div>
  );

  return (
    <div style={{ padding: '20px 16px', maxWidth: '100%', background: bg, color: text, width: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ fontSize: window.innerWidth < 480 ? '18px' : '22px', fontWeight: 600, marginBottom: 8, color: text, wordBreak: 'break-word' }}>
            {d.name}
            <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: 20, marginLeft: 8, marginTop: 4, display: 'inline-block', background: accentBg, color: accentColor, border: `1px solid ${accentBg}` }}>{d.cat}</span>
          </h1>
          <p style={{ fontSize: '12px', color: subText }}>Electropathy reference — formula · symptoms · avoidance · dosage</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, position: 'relative' }}>
          <button onClick={() => { setShowActions(false); onEdit(); }} title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`, background: sectionBg, fontSize: 15, color: text, cursor: 'pointer' }}>✏️</button>
          <button
            type="button"
            onClick={() => setShowActions(prev => !prev)}
            title="More actions"
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderColor}`, background: sectionBg, fontSize: 18, color: text, cursor: 'pointer' }}
          >
            ⋯
          </button>
          {showActions && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, background: sectionBg, border: `1px solid ${borderColor}`, borderRadius: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.12)', minWidth: 140, zIndex: 10 }}>
              <button
                type="button"
                onClick={() => { setShowActions(false); onDelete(); }}
                style={{ width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left', color: text, cursor: 'pointer', fontSize: 13 }}
              >
                Delete disease
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formula */}
      <div style={{ marginBottom: 20 }}>
        {sectionLabel('⚗️', 'Formula / remedy')}
        {d.formula.map((f, i) => (
          <div key={i} style={{ background: cardBg, borderRadius: 8, padding: '12px 14px', border: `1px solid ${borderColor}`, marginBottom: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: text }}>
              {f.name} <span style={{ fontSize: 12, fontWeight: 400, color: subText }}>{f.potency}</span>
            </div>
            <div style={{ fontSize: 13, color: subText, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{f.detail}</div>
          </div>
        ))}
      </div>

      {/* Symptoms */}
      <div style={{ marginBottom: 20 }}>
        {sectionLabel('📈', 'Symptoms')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {d.symptoms.map((s, i) => <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: dark ? '#1a2a3a' : '#E6F1FB', color: dark ? '#9FE1CB' : '#0C447C' }}>{s}</span>)}
        </div>
      </div>

      {/* Avoid */}
      <div style={{ marginBottom: 20 }}>
        {sectionLabel('🚫', 'Things to avoid')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {d.avoid.map((a, i) => <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: avoidBg, color: avoidColor }}>{a}</span>)}
        </div>
      </div>

      {/* Dosage */}
      <div style={{ marginBottom: 20 }}>
        {sectionLabel('💊', 'Dosage schedule')}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginRight: '-16px', marginLeft: '-16px', paddingRight: '16px', paddingLeft: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'auto', minWidth: 300 }}>
          <thead>
            <tr>
              {['Phase', 'Frequency', 'Dose', 'Duration'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', padding: '5px 8px', borderBottom: `1px solid ${borderColor}`, color: subText }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.dosage.map((r, i) => (
              <tr key={i}>
                {[r.phase, r.freq, r.dose, r.duration].map((v, j) => (
                  <td key={j} style={{ padding: '8px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, verticalAlign: 'top', wordBreak: 'break-word', color: text }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Clinical note */}
      {d.note && (
        <div style={{ background: noteBg, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: noteColor, display: 'flex', gap: 8, marginBottom: 20 }}>
          <span style={{ flexShrink: 0 }}>ℹ️</span><span>{d.note}</span>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        {sectionLabel('📝', 'Notes')}
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Add your observations, patient notes, or reminders…"
          rows={4}
          style={{ width: '100%', fontSize: 13, padding: '10px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: sectionBg, color: text, resize: 'vertical', lineHeight: 1.6 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <button onClick={handleSave} style={{ fontSize: '12px', padding: '8px 16px', borderRadius: 6, background: '#0F6E56', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Save note</button>
          {saved && <span style={{ fontSize: 12, color: '#0F6E56' }}>✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}
