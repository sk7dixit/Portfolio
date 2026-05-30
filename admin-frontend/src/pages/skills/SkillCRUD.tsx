import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../api';
import { Plus, Trash2, Award } from 'lucide-react';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function SkillCRUD() {
  const skills = useStore((state) => state.skills);
  const fetchEverything = useStore((state) => state.fetchEverything);
  const setSuccess = useStore((state) => state.setSuccess);
  const setError = useStore((state) => state.setError);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(7);
  const [category, setCategory] = useState('Frontend');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/skills', {
        skillName,
        skillLevel,
        category,
      });
      setSuccess('Technical proficiency appended!');
      setSkillName('');
      setSkillLevel(7);
      setIsFormOpen(false);
      await fetchEverything();
    } catch (err: any) {
      console.error('Skill CRUD Error:', err);
      setError(err.response?.data?.message || 'Failed to append skill');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedSkillId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSkillId) return;
    setLoading(true);
    try {
      await api.delete(`/skills/${selectedSkillId}`);
      setSuccess('Skill removed from tech grid!');
      setIsConfirmOpen(false);
      setSelectedSkillId(null);
      await fetchEverything();
    } catch (err: any) {
      console.error('Delete Skill Error:', err);
      setError(err.response?.data?.message || 'Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category for nice visual presentation
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Panel with Create Action */}
      <div className="flex justify-between items-center border-b border-border/60 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Technical Grid</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage and organize your technical expertise categories.</p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TECHNICAL SKILL</span>
        </button>
      </div>

      {/* Structured Category Grids */}
      {skills.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-md">
          <p className="text-muted-foreground text-xs py-8">Technical grid is currently empty. Define your first capability!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedSkills).map(([cat, list]: any) => (
            <div key={cat} className="bg-card border border-border rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>{cat} Spec</span>
              </h4>

              <div className="space-y-3">
                {list.map((skill: any) => (
                  <div key={skill.id} className="p-3 bg-background border border-border hover:border-primary/25 rounded-xl flex items-center justify-between group shadow-sm transition-all">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-foreground font-semibold">{skill.skillName}</span>
                        <span className="font-mono text-muted-foreground text-[10px]">{skill.skillLevel}/10</span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-1.5 border border-border/20">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(skill.skillLevel / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => confirmDelete(skill.id)}
                      className="p-1.5 rounded bg-red-950/20 hover:bg-red-900/20 text-red-400 hover:text-red-300 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer opacity-40 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. Form Modal (sm size) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Technical Skill"
        description="Append a core technology stack item to your visual portfolio layout grids."
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Technology Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Node.js or PostgreSQL"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-sm text-foreground transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Stack Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border focus:border-primary focus:outline-none px-4 py-2.5 rounded-lg text-sm text-foreground transition-all cursor-pointer font-semibold"
            >
              <option value="Frontend">Frontend Core</option>
              <option value="Backend">Backend Frameworks</option>
              <option value="DevOps">Cloud & DevOps</option>
              <option value="Database">Database Management</option>
              <option value="Other">Other Technologies</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proficiency Level</label>
              <span className="text-xs font-bold text-primary font-mono">{skillLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={skillLevel}
              onChange={(e) => setSkillLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary border border-border/20"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="w-1/2 py-2.5 rounded-lg bg-background border border-border hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>SAVE SKILL</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Technology Spec"
        message="Are you absolutely sure you want to remove this skill capability? This operation cannot be undone."
        confirmText="REMOVE SKILL"
        loading={loading}
      />
    </div>
  );
}
