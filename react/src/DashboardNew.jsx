import { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "./axios-client.js";
import { useStateContext } from "./context/ContextProvider.jsx";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user, setNotification } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    recentUsers: [],
    userStats: {
      todayJoined: 0,
      thisWeekJoined: 0,
      thisMonthJoined: 0,
    }
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  // Calculate date ranges for stats
  const dateRanges = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return { today, weekAgo, monthAgo };
  }, []);

  // Calculate user statistics
  const calculateStats = useCallback((users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return {
        todayJoined: 0,
        thisWeekJoined: 0,
        thisMonthJoined: 0,
      };
    }

    const { today, weekAgo, monthAgo } = dateRanges;

    const todayJoined = users.filter(u => {
      try {
        const createdDate = new Date(u.created_at);
        return createdDate >= today;
      } catch {
        return false;
      }
    }).length;

    const thisWeekJoined = users.filter(u => {
      try {
        const createdDate = new Date(u.created_at);
        return createdDate >= weekAgo;
      } catch {
        return false;
      }
    }).length;

    const thisMonthJoined = users.filter(u => {
      try {
        const createdDate = new Date(u.created_at);
        return createdDate >= monthAgo;
      } catch {
        return false;
      }
    }).length;

    return {
      todayJoined,
      thisWeekJoined,
      thisMonthJoined,
    };
  }, [dateRanges]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosClient.get('/users');

      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      const users = Array.isArray(data.data) ? data.data : [];
      const total = data.meta?.total || users.length;

      // Get recent users (last 5) with validation
      const recent = users.slice(0, 5).filter(u =>
        u && u.id && u.name && u.email && u.created_at
      );

      // Calculate stats with error handling
      const userStats = calculateStats(users);

      setDashboardData({
        totalUsers: Math.max(0, total),
        recentUsers: recent,
        userStats,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to load dashboard data';

      setError(errorMessage);
      setNotification(errorMessage);

      // Set default data on error
      setDashboardData({
        totalUsers: 0,
        recentUsers: [],
        userStats: {
          todayJoined: 0,
          thisWeekJoined: 0,
          thisMonthJoined: 0,
        }
      });
    } finally {
      setLoading(false);
    }
  }, [calculateStats, setNotification]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = useCallback((dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  const formatTime = useCallback(() => {
    try {
      return lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A';
    } catch (error) {
      return 'N/A';
    }
  }, [lastUpdated]);

  // Handle refresh with debouncing
  const handleRefresh = useCallback(() => {
    if (loading) return;
    fetchDashboardData();
  }, [loading, fetchDashboardData]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'User'}! 👋</p>
      </div>

      {error && (
        <div className="error-banner" role="alert" aria-live="polite">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Error:</strong> {error}
              <button onClick={handleRefresh} className="btn-retry">
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <h3>{dashboardData.totalUsers.toLocaleString()}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card stat-card-success">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <h3>{dashboardData.userStats.todayJoined.toLocaleString()}</h3>
                <p>Joined Today</p>
              </div>
            </div>

            <div className="stat-card stat-card-info">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>{dashboardData.userStats.thisWeekJoined.toLocaleString()}</h3>
                <p>This Week</p>
              </div>
            </div>

            <div className="stat-card stat-card-warning">
              <div className="stat-icon">📈</div>
              <div className="stat-details">
                <h3>{dashboardData.userStats.thisMonthJoined.toLocaleString()}</h3>
                <p>This Month</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/users/new" className="action-card" aria-label="Add new user">
                <div className="action-icon">➕</div>
                <div className="action-text">
                  <h3>Add New User</h3>
                  <p>Create a new user account</p>
                </div>
              </Link>

              <Link to="/users" className="action-card" aria-label="View all users">
                <div className="action-icon">📋</div>
                <div className="action-text">
                  <h3>View All Users</h3>
                  <p>Manage user accounts</p>
                </div>
              </Link>

              <a
                href="http://localhost:8000/api/health"
                target="_blank"
                className="action-card"
                rel="noopener noreferrer"
                aria-label="Check system health"
              >
                <div className="action-icon">🏥</div>
                <div className="action-text">
                  <h3>System Health</h3>
                  <p>Check API status</p>
                </div>
              </a>

              <button
                className="action-card"
                onClick={handleRefresh}
                disabled={loading}
                aria-label="Refresh dashboard data"
              >
                <div className="action-icon">{loading ? '⏳' : '🔄'}</div>
                <div className="action-text">
                  <h3>{loading ? 'Refreshing...' : 'Refresh Data'}</h3>
                  <p>Update dashboard stats</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Users */}
          <div className="dashboard-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Recent Users</h2>
              <Link to="/users" className="btn-link" aria-label="View all users">View All →</Link>
            </div>
            <div className="card">
              {dashboardData.recentUsers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📁</div>
                  <p>No users found</p>
                  <Link to="/users/new" className="btn-add">Create First User</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table role="table" aria-label="Recent users table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Joined</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentUsers.map(u => (
                        <tr key={u.id}>
                          <td data-label="ID">{u.id}</td>
                          <td data-label="Name">{u.name || 'N/A'}</td>
                          <td data-label="Email">{u.email || 'N/A'}</td>
                          <td data-label="Joined">{formatDate(u.created_at)}</td>
                          <td data-label="Actions">
                            <Link
                              to={'/users/' + u.id}
                              className="btn-edit"
                              aria-label={`View details for ${u.name}`}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="dashboard-section">
            <h2>System Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <h4>🚀 Application Status</h4>
                <p className="status-badge status-active">Active</p>
              </div>
              <div className="info-card">
                <h4>📦 Version</h4>
                <p>v1.0.0</p>
              </div>
              <div className="info-card">
                <h4>🔐 Your Role</h4>
                <p>Administrator</p>
              </div>
              <div className="info-card">
                <h4>⏰ Last Updated</h4>
                <p>{formatTime()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
