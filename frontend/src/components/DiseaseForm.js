import React, { useState } from 'react';

const emptyFormula = () => ({ name: '', potency: '', detail: '' });
const emptyDosage = () => ({ phase: '', freq: '', dose: '', duration: '' });

export default function DiseaseForm({ theme, initial, categories, onSave, onCancel, onAddCategory, onRemoveCategory }) {
  const dark = theme === 'dark';
  const [name, setName] = useState(initial?.name || '');
  const [cat, setCat] = useState(initial?.cat || categories[0]?.name || '');
  const [formulas, setFormulas] = useState(initial?.formula?.length ? initial.formula.map(f => ({ ...f })) : [emptyFormula()]);
  const [symptoms, setSymptoms] = useState(initial?.symptoms?.join(', ') || '');
  const [avoid, setAvoid] = useState(initial?.avoid?.join(', ') || '');
  const [dosage, setDosage] = useState(initial?.dosage?.[0] ? { ...initial.dosage[0] } : emptyDosage());
  const [note, setNote] = useState(initial?.note || '');
  const [newCat, setNewCat] = useState('');
  const [catError, setCatError] = useState('');

  const updateFormula = (i, key, val) => setFormulas(prev => prev.map((f, fi) => fi === i ? { ...f, [key]: val } : f));
  const addFormula = () => setFormulas(prev => [...prev, emptyFormula()]);
  const removeFormula = (i) => setFormulas(prev => prev.filter((_, fi) => fi !== i));

  const handleAddCat = async () => {
    const v = newCat.trim();
    if (!v) return;
    if (categories.find(c => c.name === v)) { setCatError('Already exists'); return; }
    try {
      const added = await onAddCategory(v);
      setCat(added.name);
      setNewCat('');
      setCatError('');
    } catch {
      setCatError('Could not add category');
    }
  };

  const handleRemoveCat = async (c) => {
    if (categories.length <= 1) return alert('At least one category is required.');
    if (window.confirm(`Remove category "${c.name}"?`)) {
      await onRemoveCategory(c._id);
      if (cat === c.name) setCat(categories.filter(x => x._id !== c._id)[0]?.name || '');
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert('Disease name is required.');
    onSave({
      name: name.trim(),
      cat,
      formula: formulas.map(f => ({ name: f.name || '—', potency: f.potency || '—', detail: f.detail || '—' })),
      symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
      avoid: avoid.split(',').map(s => s.trim()).filter(Boolean),
      dosage: [{ phase: dosage.phase || '—', freq: dosage.freq || '—', dose: dosage.dose || '—', duration: dosage.duration || '—' }],
      note,
    });
  };

  const containerBg = dark ? '#1d1d1b' : '#fff';
  const sectionBg = dark ? '#2a2a28' : '#f8f8f6';
  const cardBg = dark ? '#2a2a28' : '#fff';
  const borderColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const text = dark ? '#f5f5f3' : '#1a1a18';
  const labelColor = dark ? '#a0a09d' : '#6b6b68';
  const sectionText = dark ? '#a0a09d' : '#6b6b68';
  const sectionBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = dark ? '#2a2a28' : '#fff';

  const inp = { fontSize: 13, padding: '8px 10px', borderRadius: 8, border: `1px solid ${borderColor}`, background: inputBg, width: '100%', color: text };
  const ta = { ...inp, resize: 'vertical', lineHeight: 1.6 };
  const lbl = { display: 'block', fontSize: 12, fontWeight: 500, color: labelColor, marginBottom: 4 };
  const sectHead = (icon, text) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: sectionText, borderBottom: `1px solid ${sectionBorder}`, paddingBottom: 6, marginBottom: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span>{text}
    </div>
  );

  return (
    <div style={{ padding: '20px 16px', maxWidth: '100%', overflowY: 'auto', background: containerBg, color: text, width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${sectionBorder}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: text }}>{initial ? 'Edit disease' : 'Add new disease'}</h2>
        <button onClick={onCancel} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 6, border: `1px solid ${borderColor}`, background: sectionBg, color: text }}>Cancel</button>
      </div>

      {/* Name + Category */}
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={lbl}>Disease name</label><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Migraine" /></div>
        <div>
          <label style={lbl}>Category</label>
          <select style={inp} value={cat} onChange={e => setCat(e.target.value)}>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Category Manager */}
      <div style={{ background: sectionBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: sectionText, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Manage categories</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {categories.map(c => (
            <span key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '3px 8px', borderRadius: 20, background: sectionBg, border: `1px solid ${borderColor}`, color: text }}>{c.name}
              <span onClick={() => handleRemoveCat(c)} style={{ cursor: 'pointer', color: labelColor, marginLeft: 2, fontSize: 15, lineHeight: 1 }} title="Remove">×</span>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            style={{ ...inp, flex: 1 }}
            value={newCat}
            onChange={e => { setNewCat(e.target.value); setCatError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAddCat()}
            placeholder="New category name…"
          />
          <button onClick={handleAddCat} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 6, background: dark ? '#1a3a2a' : '#E1F5EE', color: dark ? '#9FE1CB' : '#0F6E56', border: `1px solid ${dark ? '#4a6a5a' : '#9FE1CB'}`, whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
        {catError && <div style={{ fontSize: 12, color: '#A32D2D', marginTop: 4 }}>{catError}</div>}
      </div>

      {/* Formulas */}
      {sectHead('⚗️', 'Formula / remedy')}
      {formulas.map((f, i) => (
        <div key={i} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: sectionText }}>Formula {i + 1}</span>
            {i > 0 && <span onClick={() => removeFormula(i)} style={{ cursor: 'pointer', fontSize: 20, color: '#a0a09d', lineHeight: 1, padding: '0 4px' }}>×</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div><label style={lbl}>Medicine name</label><input style={inp} value={f.name} onChange={e => updateFormula(i, 'name', e.target.value)} placeholder="e.g. Belladonna" /></div>
            <div><label style={lbl}>Potency</label><input style={inp} value={f.potency} onChange={e => updateFormula(i, 'potency', e.target.value)} placeholder="e.g. 30C" /></div>
          </div>
          <div>
            <label style={lbl}>
              Formula(Medicine)
              <span style={{ fontWeight: 400, color: '#a0a09d', marginLeft: 4 }}>(each indication on a new line)</span>
            </label>
            <textarea
              style={{ ...ta, minHeight: 100 }}
              rows={4}
              value={f.detail}
              onChange={e => updateFormula(i, 'detail', e.target.value)}
              placeholder={"Formulae"}
            />
          </div>
        </div>
      ))}
      <button onClick={addFormula} style={{ fontSize: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: `1px solid ${borderColor}`, background: sectionBg, color: text }}>
        + Add another formula
      </button>

      {/* Symptoms & Avoid */}
      {sectHead('📈', 'Symptoms & avoidance')}
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Symptoms <span style={{ fontWeight: 400, color: '#a0a09d' }}>(comma separated)</span></label>
        <textarea style={{ ...ta, minHeight: 70 }} rows={3} value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g. Headache, Fever, Nausea, Chills" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Things to avoid <span style={{ fontWeight: 400, color: '#a0a09d' }}>(comma separated)</span></label>
        <textarea style={{ ...ta, minHeight: 70 }} rows={3} value={avoid} onChange={e => setAvoid(e.target.value)} placeholder="e.g. Cold water, Spicy food, Stress" />
      </div>

      {/* Dosage */}
      {sectHead('💊', 'Dosage')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        {[['Phase','phase','Acute'], ['Frequency','freq','3× daily'], ['Dose','dose','4 pills'], ['Duration','duration','2 weeks']].map(([l, k, ph]) => (
          <div key={k}>
            <label style={lbl}>{l}</label>
            <input style={inp} value={dosage[k]} onChange={e => setDosage(prev => ({ ...prev, [k]: e.target.value }))} placeholder={ph} />
          </div>
        ))}
      </div>

      {/* Clinical note */}
      <div style={{ marginBottom: 24 }}>
        <label style={lbl}>Clinical note <span style={{ fontWeight: 400, color: '#a0a09d' }}>(optional)</span></label>
        <input style={inp} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Monitor blood pressure weekly" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onCancel} style={{ fontSize: 13, padding: '8px 18px', borderRadius: 8, border: `1px solid ${borderColor}`, background: sectionBg, color: text }}>Cancel</button>
        <button onClick={handleSubmit} style={{ fontSize: 13, padding: '8px 20px', borderRadius: 8, background: '#0F6E56', color: '#fff', border: 'none', fontWeight: 500 }}>
          {initial ? 'Save changes' : 'Add disease'}
        </button>
      </div>
    </div>
  );
}
