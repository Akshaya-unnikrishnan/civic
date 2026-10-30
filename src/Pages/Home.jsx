
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiClipboard,
  FiClock,
  FiTool,
  FiCheckCircle,
  FiUsers,
  FiAlertCircle,
  FiArrowRight,
  FiPlusCircle,
  FiBarChart2,
  FiActivity,
  FiMapPin,
  FiTrendingUp
} from "react-icons/fi";

function Home() {
  const navigate = useNavigate();

  // Get logged-in user from Redux
  const { user } = useSelector((state) => state.authReducer || {});

  const role = user?.role?.toLowerCase() || "public";
  const userName = user?.name || user?.username || "User";

  // Dashboard details based on role
  const dashboardInfo = {
    admin: {
      title: "Admin Dashboard",
      subtitle: "Monitor public issues and manage your departments.",
      icon: <FiBarChart2 />,
      color: "#6366f1"
    },
    staff: {
      title: "Staff Dashboard",
      subtitle: "Manage assigned issues and keep citizens updated.",
      icon: <FiTool />,
      color: "#0ea5e9"
    },
    public: {
      title: "Citizen Dashboard",
      subtitle: "Report public issues and track their progress.",
      icon: <FiMapPin />,
      color: "#3b82f6"
    }
  };

  const currentDashboard = dashboardInfo[role] || dashboardInfo.public;

  // Dashboard statistics
  const stats = [
    {
      title: "Total Issues",
      value: "0",
      icon: <FiClipboard />,
      color: "#3b82f6"
    },
    {
      title: "Pending Issues",
      value: "0",
      icon: <FiClock />,
      color: "#f59e0b"
    },
    {
      title: "In Progress",
      value: "0",
      icon: <FiActivity />,
      color: "#8b5cf6"
    },
    {
      title: "Resolved Issues",
      value: "0",
      icon: <FiCheckCircle />,
      color: "#10b981"
    }
  ];

  // Quick actions based on role
  const quickActions = {
    public: [
      {
        title: "Report an Issue",
        description: "Report a road, water, sanitation, or electricity issue.",
        icon: <FiPlusCircle />,
        buttonText: "Create Report",
        path: "/report"
      },
      {
        title: "My Reports",
        description: "View and track the issues you have reported.",
        icon: <FiClipboard />,
        buttonText: "View Reports",
        path: "/issues"
      }
    ],
    admin: [
      {
        title: "Manage Issues",
        description: "Review reports and assign them to the appropriate staff.",
        icon: <FiClipboard />,
        buttonText: "View Issues",
        path: "/admin/issues"
      },
      {
        title: "Manage Staff",
        description: "View and manage department staff members.",
        icon: <FiUsers />,
        buttonText: "View Staff",
        path: "/admin/staff"
      }
    ],
    staff: [
      {
        title: "Assigned Issues",
        description: "View issues assigned to your department.",
        icon: <FiTool />,
        buttonText: "View Tasks",
        path: "/staff/issues"
      },
      {
        title: "Update Progress",
        description: "Update the status of issues you are handling.",
        icon: <FiTrendingUp />,
        buttonText: "Update Status",
        path: "/staff/issues"
      }
    ]
  };

  const actions = quickActions[role] || quickActions.public;

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.welcomeBadge}>
            <FiActivity />
            <span>PUBLIC ISSUE INTELLIGENCE PLATFORM</span>
          </div>

          <h1 style={styles.heroTitle}>
            Welcome back, {userName}!
          </h1>

          <p style={styles.heroText}>
            {currentDashboard.subtitle}
          </p>

          <div style={styles.heroButtons}>
            {role === "public" && (
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/report")}
              >
                <FiPlusCircle />
                Report an Issue
                <FiArrowRight />
              </button>
            )}

            {role === "admin" && (
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/admin/issues")}
              >
                <FiClipboard />
                Manage Issues
                <FiArrowRight />
              </button>
            )}

            {role === "staff" && (
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/staff/issues")}
              >
                <FiTool />
                View Assigned Issues
                <FiArrowRight />
              </button>
            )}
          </div>
        </div>

        <div style={styles.heroIcon}>
          {currentDashboard.icon}
        </div>

        <div style={styles.heroCircle}></div>
      </div>

      {/* Statistics */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Overview</h2>
          <p style={styles.sectionSubtitle}>
            A quick look at public issue management
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((item, index) => (
          <div style={styles.statCard} key={index}>
            <div
              style={{
                ...styles.statIcon,
                color: item.color,
                backgroundColor: `${item.color}18`
              }}
            >
              {item.icon}
            </div>

            <div>
              <p style={styles.statTitle}>{item.title}</p>
              <h2 style={styles.statValue}>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <p style={styles.sectionSubtitle}>
            Access your frequently used features
          </p>
        </div>
      </div>

      <div style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <div style={styles.actionCard} key={index}>
            <div style={styles.actionIcon}>
              {action.icon}
            </div>

            <h3 style={styles.actionTitle}>{action.title}</h3>

            <p style={styles.actionDescription}>
              {action.description}
            </p>

            <button
              style={styles.actionButton}
              onClick={() => navigate(action.path)}
            >
              {action.buttonText}
              <FiArrowRight />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div style={styles.infoBanner}>
        <FiAlertCircle style={styles.infoIcon} />

        <div>
          <h4 style={styles.infoTitle}>Building better communities</h4>
          <p style={styles.infoText}>
            CivicLens helps citizens report public issues and enables
            departments to manage and resolve them efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "35px",
    background: "#f4f7fc",
    fontFamily: "Arial, sans-serif",
    color: "#172554"
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "250px",
    padding: "40px",
    borderRadius: "24px",
    background: "linear-gradient(120deg, #0f172a, #1e3a8a, #2563eb)",
    color: "#ffffff",
    boxShadow: "0 15px 35px rgba(30, 58, 138, 0.18)",
    marginBottom: "35px"
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "650px"
  },

  welcomeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 13px",
    borderRadius: "30px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "11px",
    letterSpacing: "1px",
    marginBottom: "18px"
  },

  heroTitle: {
    fontSize: "clamp(26px, 4vw, 38px)",
    fontWeight: "700",
    margin: "0 0 12px"
  },

  heroText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#dbeafe",
    margin: "0 0 22px"
  },

  heroButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "13px 19px",
    border: "none",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },

  heroIcon: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "110px",
    height: "110px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "55px",
    color: "#bfdbfe",
    marginLeft: "20px"
  },

  heroCircle: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    border: "45px solid rgba(255,255,255,0.05)",
    right: "-90px",
    bottom: "-180px"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  sectionTitle: {
    fontSize: "23px",
    fontWeight: "700",
    color: "#172554",
    margin: "0 0 7px"
  },

  sectionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
    marginBottom: "38px"
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    padding: "23px",
    borderRadius: "17px",
    background: "#ffffff",
    border: "1px solid #e8eef7",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)"
  },

  statIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "54px",
    height: "54px",
    borderRadius: "15px",
    fontSize: "26px",
    flexShrink: 0
  },

  statTitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 8px"
  },

  statValue: {
    fontSize: "27px",
    fontWeight: "700",
    color: "#172554",
    margin: 0
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px",
    marginBottom: "30px"
  },

  actionCard: {
    padding: "27px",
    background: "#ffffff",
    border: "1px solid #e8eef7",
    borderRadius: "18px",
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)"
  },

  actionIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "26px",
    marginBottom: "20px"
  },

  actionTitle: {
    fontSize: "19px",
    fontWeight: "700",
    color: "#172554",
    margin: "0 0 12px"
  },

  actionDescription: {
    minHeight: "48px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#64748b",
    margin: "0 0 22px"
  },

  actionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 15px",
    border: "none",
    borderRadius: "9px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },

  infoBanner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "22px",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    background: "#eff6ff"
  },

  infoIcon: {
    color: "#2563eb",
    fontSize: "24px",
    flexShrink: 0,
    marginTop: "2px"
  },

  infoTitle: {
    color: "#1e3a8a",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 7px"
  },

  infoText: {
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.7",
    margin: 0
  }
};

export default Home;
