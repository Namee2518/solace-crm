import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import AgentFormModal from '../components/AgentFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h3>Agents</h3>
          <button className="btn btn-crm-primary" onClick={openAddModal}>
            + Add Agent
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="agent-table-card">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading agents...</div>
          ) : agents.length === 0 ? (
            <div className="p-4 text-center text-muted">No agents yet. Click "Add Agent" to create one.</div>
          ) : (
            <table className="table agent-table mb-0">
              <thead>
                <tr>
                  <th className="ps-3">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="ps-3">{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone}</td>
                    <td>
                      <span className={agent.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => openEditModal(agent)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openDeleteModal(agent)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
