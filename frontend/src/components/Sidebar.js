import React, { useState } from 'react';

const COLORS = ['#185FA5','#0F6E56','#993C1D','#993556','#5F5E5A','#3B6D11','#854F0B','#A32D2D','#534AB7','#1D9E75'];

export default function Sidebar({ theme, diseases, selected, filter, onFilter, onSelect, onDelete, onAdd, insertionOrder }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const dark = theme === 'dark';
  const bg = dark ? '#2a2a28' : '#fafaf8';
  const panel = dark ? '#3a3a38' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = dark ? '#f5f5f3' : '#1a1a18';
  const hint = dark ? '#a0a09d' : '#6b6b68';
  const inputBg = dark ? '#3a3a38' : '#fff';
  const inputBorder = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const buttonBg = dark ? '#1a3a2a' : '#E1F5EE';
  const buttonColor = dark ? '#9FE1CB' : '#0F6E56';
  const buttonBorder = dark ? '#4a6a5a' : '#9FE1CB';

  return (
    <div style={{ width: '100%', height: '100%', flexShrink: 0, borderRight: `1px solid ${border}`, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: 12, borderBottom: `1px solid ${border}` }}>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: hint, fontSize: 13 }}>🔍</span>
          <input
            type="text"
            placeholder="Search diseases…"
            value={filter}
            onChange={e => onFilter(e.target.value)}
            style={{ width: '100%', fontSize: 13, padding: '7px 10px 7px 30px', borderRadius: 8, border: `1px solid ${inputBorder}`, background: inputBg, color: text }}
          />
        </div>
        <button
          onClick={onAdd}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 7, fontSize: 13, borderRadius: 8, background: buttonBg, color: buttonColor, border: `1px solid ${buttonBorder}`, fontWeight: 500 }}
        >
          + Add disease
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {diseases.length === 0 && (
          <div style={{ padding: 16, fontSize: 12, color: hint, textAlign: 'center' }}>No diseases found</div>
        )}
        {diseases.map((d, i) => (
          <div
            key={d._id}
            onClick={() => { setActiveMenuId(null); onSelect(d); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px',
              borderRadius: 8, cursor: 'pointer', marginBottom: 2,
              background: selected?._id === d._id ? panel : 'transparent',
              border: selected?._id === d._id ? `1px solid ${inputBorder}` : '1px solid transparent',
              position: 'relative',
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'transparent', color: hint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0, fontSize: 12 }}>
              {insertionOrder?.[d._id] || (i + 1)}
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: text }}>{d.name}</div>
              <div style={{ fontSize: 11, color: hint }}>{d.cat}</div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === d._id ? null : d._id); }}
              style={{
                border: 'none', background: 'transparent', color: hint, cursor: 'pointer',
                fontSize: 18, padding: 6, borderRadius: 6,
              }}
              title="More actions"
            >
              ⋯
            </button>
            {activeMenuId === d._id && (
              <div
                style={{
                  position: 'absolute', right: 8, top: 'calc(100% + 6px)',
                  background: panel, border: `1px solid ${border}`, borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  zIndex: 10,
                  minWidth: 120,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); onDelete(d._id); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none',
                    background: 'transparent', color: text, cursor: 'pointer', fontSize: 13,
                  }}
                >
                  Delete disease
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
