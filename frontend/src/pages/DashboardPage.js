import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DiseaseForm from '../components/DiseaseForm';
import DiseaseDetail from '../components/DiseaseDetail';
import Sidebar from '../components/Sidebar';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export default function DashboardPage() {
  const [diseases, setDiseases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState({});
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editDisease, setEditDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.style.background = theme === 'dark' ? '#1a1a18' : '#f5f5f3';
    document.body.style.color = theme === 'dark' ? '#f5f5f3' : '#1a1a18';
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Run immediately on mount to ensure correct initial state
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [dRes, cRes, nRes] = await Promise.all([
        api.get('/api/diseases'),
        api.get('/api/categories'),
        api.get('/api/notes'),
      ]);
      setDiseases(dRes.data);
      setCategories(cRes.data);
      const noteMap = {};
      nRes.data.forEach(n => { noteMap[n.disease] = n.content; });
      setNotes(noteMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaveDisease = async (data) => {
    if (editDisease) {
      const res = await api.put(`/api/diseases/${editDisease._id}`, data);
      setDiseases(prev => prev.map(d => d._id === editDisease._id ? res.data : d));
      setSelected(res.data);
    } else {
      const res = await api.post('/api/diseases', data);
      setDiseases(prev => [res.data, ...prev]);
      setSelected(res.data);
    }
    setShowForm(false);
    setEditDisease(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this disease?')) return;
    await api.delete(`/api/diseases/${id}`);
    setDiseases(prev => prev.filter(d => d._id !== id));
    setSelected(prev => (prev?._id === id ? null : prev));
  };

  const handleSelectDisease = (disease) => {
    setShowForm(false);
    setEditDisease(null);
    setSelected(disease);
  };

  const handleSaveNote = async (diseaseId, content) => {
    await api.post(`/api/notes/${diseaseId}`, { content });
    setNotes(prev => ({ ...prev, [diseaseId]: content }));
  };

  const handleAddCategory = async (name) => {
    const res = await api.post('/api/categories', { name });
    setCategories(prev => [...prev, res.data]);
    return res.data;
  };

  const handleRemoveCategory = async (id) => {
    await api.delete(`/api/categories/${id}`);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  const filtered = diseases.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.cat.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#a0a09d' }}>
      Loading…
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: theme === 'dark' ? '#2a2a28' : '#f8f8f6', borderBottom: '1px solid', borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', flexShrink: 0, gap: 8, height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ fontSize: 18, background: 'transparent', border: 'none', color: theme === 'dark' ? '#f5f5f3' : '#1a1a18', cursor: 'pointer', padding: 6, flexShrink: 0 }}
              title="Toggle menu"
            >
              ☰
            </button>
          )}
          <span style={{ fontWeight: 500, fontSize: isMobile ? '14px' : '30px', color: theme === 'dark' ? '#9FE1CB' : '#0F6E56', whiteSpace: 'nowrap' }}>⚕ Maa Hiravati Clinic</span>
        </div>
        <button
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          style={{
            padding: '6px 12px', borderRadius: 8, border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
            background: theme === 'dark' ? '#3a3a38' : '#fff', color: theme === 'dark' ? '#f5f5f3' : '#1a1a18',
            fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
          }}
        >
          {theme === 'dark' ? '🌙 ON' : '☀️ OFF'}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: theme === 'dark' ? '#151513' : '#f5f5f3', position: 'relative' }}>
        {!isMobile ? (
          // Desktop: sidebar always visible on the left
          <>
            <div style={{ width: 250, flexShrink: 0, backgroundColor: 'transparent' }}>
              <Sidebar
                theme={theme}
                diseases={filtered}
                selected={selected}
                filter={filter}
                onFilter={setFilter}
                onSelect={handleSelectDisease}
                onDelete={handleDelete}
                onAdd={() => { setEditDisease(null); setShowForm(true); }}
              />
            </div>
            <div style={{ flex: 1, overflow: 'auto', background: theme === 'dark' ? '#1a1a18' : '#fff', width: '100%', minWidth: 0 }}>
              {showForm ? (
                <DiseaseForm
                  theme={theme}
                  initial={editDisease}
                  categories={categories}
                  onSave={handleSaveDisease}
                  onCancel={() => { setShowForm(false); setEditDisease(null); }}
                  onAddCategory={handleAddCategory}
                  onRemoveCategory={handleRemoveCategory}
                />
              ) : selected ? (
                <DiseaseDetail
                  theme={theme}
                  disease={selected}
                  note={notes[selected._id] || ''}
                  onEdit={() => { setEditDisease(selected); setShowForm(true); }}
                  onDelete={() => handleDelete(selected._id)}
                  onSaveNote={(content) => handleSaveNote(selected._id, content)}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: theme === 'dark' ? '#a0a09d' : '#6b6b68' }}>
                  <span style={{ fontSize: 48 }}>⚕</span>
                  <span style={{ fontSize: 14 }}>Select a disease to view details</span>
                </div>
              )}
            </div>
          </>
        ) : (
          // Mobile: sidebar toggle with overlay
          <>
            {showSidebar && (
              <div style={{ position: 'fixed', left: 0, top: 56, bottom: 0, width: '80vw', maxWidth: 250, zIndex: 10, backgroundColor: 'transparent', height: 'calc(100vh - 56px)' }}>
                <Sidebar
                  theme={theme}
                  diseases={filtered}
                  selected={selected}
                  filter={filter}
                  onFilter={setFilter}
                  onSelect={(d) => { 
                    handleSelectDisease(d); 
                    setShowSidebar(false); 
                  }}
                  onDelete={handleDelete}
                  onAdd={() => { setEditDisease(null); setShowForm(true); }}
                />
              </div>
            )}
            {showSidebar && <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', left: 0, top: 56, bottom: 0, right: 0, zIndex: 5, background: 'rgba(0,0,0,0.5)' }} />}
            <div style={{ flex: 1, overflow: 'auto', background: theme === 'dark' ? '#1a1a18' : '#fff', width: '100%', minWidth: 0, zIndex: 1 }}>
              {showForm ? (
                <DiseaseForm
                  theme={theme}
                  initial={editDisease}
                  categories={categories}
                  onSave={handleSaveDisease}
                  onCancel={() => { setShowForm(false); setEditDisease(null); }}
                  onAddCategory={handleAddCategory}
                  onRemoveCategory={handleRemoveCategory}
                />
              ) : selected ? (
                <DiseaseDetail
                  theme={theme}
                  disease={selected}
                  note={notes[selected._id] || ''}
                  onEdit={() => { setEditDisease(selected); setShowForm(true); }}
                  onDelete={() => handleDelete(selected._id)}
                  onSaveNote={(content) => handleSaveNote(selected._id, content)}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: theme === 'dark' ? '#a0a09d' : '#6b6b68' }}>
                  <span style={{ fontSize: 48 }}>⚕</span>
                  <span style={{ fontSize: 14 }}>Select a disease to view details</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
