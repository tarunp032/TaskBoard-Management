import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import DeleteConfirm from "../components/DeleteConfirm";

const TaskListView = () => {
  const { type, filter } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [type, filter]);

  const fetchTasks = async () => {
    setLoading(true);
    let apiUrl =
      type === "assigned-to-me"
        ? "/task/assigned-to-me"
        : "/task/assigned-by-me";
    let params = {};
    if (filter !== "all") params.status = filter;
    if (filter === "overdue") params.status = "pending";
    try {
      const response = await api.get(apiUrl, { params });
      let data = response.data.data;
      if (filter === "overdue") {
        const now = new Date();
        data = data.filter((task) => new Date(task.deadline) < now);
      }
      setTasks(data);
    } catch (err) {
      alert("Failed to fetch tasks: " + err.message);
    }
    setLoading(false);
  };

  // Show EditTaskModal
  const handleTaskEdit = (taskId) => setEditTaskId(taskId);

  // Show DeleteConfirm
  const handleTaskDelete = (taskId) => setDeleteTaskId(taskId);

  // Callback when edit modal finishes or cancelled
  const closeEditModal = () => setEditTaskId(null);

  // Callback when delete modal cancelled
  const closeDeleteModal = () => setDeleteTaskId(null);

  // Actually delete
  const confirmDeleteTask = async () => {
    try {
      await api.delete(`/task/${deleteTaskId}`);
      fetchTasks();
      setDeleteTaskId(null);
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleTaskStatusToggle = async (taskId, status) => {
    const newStatus = status === "pending" ? "completed" : "pending";
    try {
      await api.patch(`/task/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  const typeDisplay =
    type === "assigned-by-me"
      ? "BY Me"
      : type === "assigned-to-me"
      ? "TO Me"
      : "";

  const filterDisplay = {
    all: "All",
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
  }[filter] || filter;

  return (
    <div className="task-listview-bg">
      <div className="task-listview-container">
        <div className="task-listview-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h2 className="task-listview-title">
            Tasks <span className="list-type">{typeDisplay}</span>{" "}
            <span className={`list-filter list-filter-${filter}`}>{filterDisplay}</span>
          </h2>
        </div>
        <div className="task-listview-content">
          {loading ? (
            <div className="listview-loading">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="listview-empty">
              <span className="listview-empty-icon">📭</span>
              <div>No tasks found in this category.</div>
            </div>
          ) : (
            <div className="listview-taskcards">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isInbox={type === "assigned-to-me"}
                  from={task.createdBy?.name || "Unknown"}
                  onEdit={handleTaskEdit}
                  onDelete={handleTaskDelete}
                  onStatusToggle={handleTaskStatusToggle}
                  onParentRefresh={fetchTasks}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {editTaskId && (
        <EditTaskModal
          taskId={editTaskId}
          onClose={closeEditModal}
          onSuccess={fetchTasks}
        />
      )}
      {deleteTaskId && (
        <DeleteConfirm
          onConfirm={confirmDeleteTask}
          onCancel={closeDeleteModal}
        />
      )}
      <style>{`
      .task-listview-bg {
        min-height: 100vh;
        background: linear-gradient(110deg, #fff 80%, #f3e8ff 100%);
        padding: 0;
      }
      .task-listview-container {
        max-width: 900px;
        margin: 48px auto 0 auto;
        background: #fff;
        border-radius: 32px;
        box-shadow: 0 18px 56px rgba(123, 47, 247, 0.11);
        padding: 54px 38px 42px 38px;
        position: relative;
      }
      .task-listview-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 34px;
      }
      .back-btn {
        background: linear-gradient(135deg, #ede9fe, #fff);
        color: #7b2ff7;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        padding: 12px 22px;
        font-size: 17px;
        box-shadow: 0 2px 10px #a78bfa3c;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .back-btn:hover {
        background: linear-gradient(135deg, #ede9fe 60%, #f3e8ff 100%);
        color: #1e1e1e;
      }
      .task-listview-title {
        font-size: 30px;
        font-weight: 900;
        color: #222;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .task-listview-title .list-type {
        background: linear-gradient(135deg, #7b2ff7 70%, #f107a3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900;
        margin-left: 8px;
      }
      .task-listview-title .list-filter {
        font-size: 22px;
        font-weight: 700;
        margin-left: 6px;
        background: #ede9fe;
        color: #7b2ff7;
        border-radius: 10px;
        padding: 4px 18px;
        letter-spacing: 1px;
      }
      .list-filter-pending { color: #fbbf24; background: #fef9c3; }
      .list-filter-completed { color: #22c55e; background: #bbf7d0; }
      .list-filter-overdue { color: #f87171; background: #ffe4e6; }
      .list-filter-all { color: #6366f1; background: #e0e7ff; }
      .task-listview-content {
        min-height: 200px;
      }
      .listview-loading {
        color: #7b2ff7;
        font-size: 20px;
        text-align: center;
        font-weight: 600;
        padding: 46px 0;
      }
      .listview-empty {
        text-align: center;
        color: #7c3aed;
        font-size: 19px;
        font-weight: 700;
        padding: 80px 0 40px 0;
        opacity: 0.8;
      }
      .listview-empty-icon {
        font-size: 54px;
        color: #a78bfa;
        display: block;
        margin-bottom: 14px;
      }
      .listview-taskcards {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      @media (max-width: 900px) {
        .task-listview-container { max-width: 99vw; padding: 14px; }
        .task-listview-title { font-size: 22px; }
        .task-listview-header { flex-direction: column; gap: 8px; }
      }
      `}</style>
    </div>
  );
};

export default TaskListView;
