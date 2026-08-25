import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AgentFormModal from '../components/AgentFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAgent, setDeletingAgent] = useState(null);

  async function fetchAgents() {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/agents');
      setAgents(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load agents.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.phone.toLowerCase().includes(term)
    );
  }, [agents, searchTerm]);

  function openAddModal() {
    setEditingAgent(null);
    setShowFormModal(true);
  }

  function openEditModal(agent) {
    setEditingAgent(agent);
    setShowFormModal(true);
  }

  async function handleSaveAgent(formData) {
    try {
      if (editingAgent) {
        await axiosInstance.put(`/agents/${editingAgent.id}`, formData);
      } else {
        await axiosInstance.post('/agents', formData);
      }
      setShowFormModal(false);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save agent.');
      setShowFormModal(false);
    }
  }

  function openDeleteModal(agent) {
    setDeletingAgent(agent);
    setShowDeleteModal(true);
  }

  async function handleConfirmDelete() {
    try {
      await axiosInstance.delete(`/agents/${deletingAgent.id}`);
      setShowDeleteModal(false);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete agent.');
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="page-content">
          <div className="page-header-row">
            <h3>Agents</h3>
            <button className="btn btn-add-agent" onClick={openAddModal}>
              + Add Agent
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="agent-table-card">
            {loading ? (
              <div className="p-4 text-center text-muted">Loading agents...</div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-4 text-center text-muted">
                {agents.length === 0 ? 'No agents yet. Click "Add Agent" to create one.' : 'No agents match your search.'}
              </div>
            ) : (
              <table className="table agent-table mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Agent Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id}>
                      <td className="ps-4">{agent.name}</td>
                      <td>{agent.email}</td>
                      <td>{agent.phone}</td>
                      <td>
                        <span className={agent.status === 'Active' ? 'status-pill status-pill-active' : 'status-pill status-pill-inactive'}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="row-action-btn"
                          title="Edit"
                          onClick={() => openEditModal(agent)}
                        >
                          ✎
                        </button>
                        <button
                          className="row-action-btn danger"
                          title="Delete"
                          onClick={() => openDeleteModal(agent)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AgentFormModal
        show={showFormModal}
        agent={editingAgent}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveAgent}
      />

      <ConfirmDeleteModal
        show={showDeleteModal}
        agentName={deletingAgent?.name}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
