import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateJobPhases, updateJobStatus, type TechnicianJob, type JobPhase } from '../../services/operationsService';
import matchingService from '../../services/matchingService';
import './MissionCompletion.css';

const MissionCompletion: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<TechnicianJob | null>(null);
    const [phases, setPhases] = useState<JobPhase[]>([]);
    const [completionNotes, setCompletionNotes] = useState('');
    const [newPhaseTitle, setNewPhaseTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            // Get mission data to find job
            const missionData = await matchingService.getActiveMission();
            if (missionData.data?.job) {
                setJob(missionData.data.job);
                setPhases(missionData.data.job.phases || []);
                setCompletionNotes(missionData.data.job.completion_notes || '');
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    const addPhase = () => {
        if (!newPhaseTitle.trim()) return;
        setPhases([...phases, { title: newPhaseTitle.trim(), status: 'pending' }]);
        setNewPhaseTitle('');
    };

    const removePhase = (index: number) => {
        setPhases(phases.filter((_, i) => i !== index));
    };

    const togglePhaseStatus = (index: number) => {
        const updated = [...phases];
        const statusCycle: JobPhase['status'][] = ['pending', 'in_progress', 'completed'];
        const currentIdx = statusCycle.indexOf(updated[index].status);
        updated[index].status = statusCycle[(currentIdx + 1) % statusCycle.length];
        setPhases(updated);
    };

    const handleSavePhases = async () => {
        if (!job) return;
        setSaving(true);
        try {
            const updated = await updateJobPhases(job.id, phases);
            setJob(updated);
        } catch {
            // silent
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        if (!job) return;
        if (!window.confirm('Confirmer la fin de l\'intervention ? Le client sera notifie.')) return;
        setSaving(true);
        try {
            // Save phases first
            await updateJobPhases(job.id, phases);
            // Mark as completed
            const updated = await updateJobStatus(job.id, {
                status: 'completed',
                completion_notes: completionNotes,
            });
            setJob(updated);
            navigate('/technicien/dashboard');
        } catch {
            // silent
        } finally {
            setSaving(false);
        }
    };

    const phaseStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return 'check_circle';
            case 'in_progress': return 'pending';
            default: return 'radio_button_unchecked';
        }
    };

    const phaseStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#16a34a';
            case 'in_progress': return '#f59e0b';
            default: return '#cbd5e1';
        }
    };

    if (loading) {
        return <div className="mc-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>Chargement...</div>;
    }

    if (!job) {
        return (
            <div className="mc-page">
                <div className="mc-empty">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>construction</span>
                    <p>Aucune intervention active trouvee.</p>
                    <button className="mc-btn-back" onClick={() => navigate(-1)}>Retour</button>
                </div>
            </div>
        );
    }

    const completedCount = phases.filter(p => p.status === 'completed').length;
    const progressPercent = phases.length > 0 ? Math.round((completedCount / phases.length) * 100) : 0;

    return (
        <div className="mc-page">
            <div className="mc-header">
                <button className="mc-back-btn" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="mc-title">Suivi des travaux</h1>
                    <p className="mc-subtitle">Definissez et suivez les phases de votre intervention</p>
                </div>
            </div>

            {/* Progress bar */}
            {phases.length > 0 && (
                <div className="mc-progress-section">
                    <div className="mc-progress-header">
                        <span>Progression</span>
                        <span className="mc-progress-percent">{progressPercent}%</span>
                    </div>
                    <div className="mc-progress-bar">
                        <div className="mc-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="mc-progress-detail">{completedCount} / {phases.length} phases terminees</span>
                </div>
            )}

            {/* Phases list */}
            <div className="mc-card">
                <h3 className="mc-card-title">
                    <span className="material-symbols-outlined">checklist</span>
                    Phases de realisation
                </h3>

                <div className="mc-phases-list">
                    {phases.map((phase, index) => (
                        <div key={index} className={`mc-phase-row mc-phase-${phase.status}`}>
                            <button className="mc-phase-toggle" onClick={() => togglePhaseStatus(index)}>
                                <span className="material-symbols-outlined" style={{ color: phaseStatusColor(phase.status) }}>
                                    {phaseStatusIcon(phase.status)}
                                </span>
                            </button>
                            <span className="mc-phase-title">{phase.title}</span>
                            <span className="mc-phase-status-label">{phase.status === 'completed' ? 'Termine' : phase.status === 'in_progress' ? 'En cours' : 'A faire'}</span>
                            <button className="mc-phase-remove" onClick={() => removePhase(index)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add phase */}
                <div className="mc-add-phase">
                    <input
                        type="text"
                        className="mc-input"
                        placeholder="Nouvelle phase (ex: Diagnostic, Remplacement piece...)"
                        value={newPhaseTitle}
                        onChange={(e) => setNewPhaseTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPhase()}
                    />
                    <button className="mc-add-btn" onClick={addPhase} disabled={!newPhaseTitle.trim()}>
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                <button className="mc-btn-save" onClick={handleSavePhases} disabled={saving}>
                    <span className="material-symbols-outlined">save</span>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder les phases'}
                </button>
            </div>

            {/* Completion notes */}
            <div className="mc-card">
                <h3 className="mc-card-title">
                    <span className="material-symbols-outlined">edit_note</span>
                    Notes de completion
                </h3>
                <textarea
                    className="mc-textarea"
                    rows={4}
                    placeholder="Notes finales, observations, recommandations au client..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                ></textarea>
            </div>

            {/* Complete button */}
            {job.status !== 'completed' && (
                <button className="mc-btn-complete" onClick={handleComplete} disabled={saving}>
                    <span className="material-symbols-outlined">check_circle</span>
                    {saving ? 'Finalisation...' : 'Terminer l\'intervention'}
                </button>
            )}

            {job.status === 'completed' && (
                <div className="mc-completed-banner">
                    <span className="material-symbols-outlined">verified</span>
                    <div>
                        <h4>Intervention terminee</h4>
                        <p>Terminee le {job.completed_at ? new Date(job.completed_at).toLocaleDateString('fr-FR') : '-'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionCompletion;
