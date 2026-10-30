import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllIssues } from '../Redux/slice/issueSlice'

function Landing() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { issues, loading, error } = useSelector(state => state.issueReducer)
    const { user } = useSelector(state => state.authReducer)

    useEffect(() => {
        dispatch(getAllIssues())
    }, [dispatch])

    const handleReportClick = () => {
        if (!user) {
            navigate('/login', { state: { from: '/report' } })
        } else if (user.role === 'admin') {
            navigate('/admin')
        } else if (user.role === 'staff') {
            navigate('/staff')
        } else {
            navigate('/report')
        }
    }

    const handleDashboardClick = () => {
        if (user?.role === 'admin') navigate('/admin')
        else if (user?.role === 'staff') navigate('/staff')
        else navigate('/home')
    }

    const statusColors = {
        Reported: 'primary',
        Assigned: 'info',
        'In Progress': 'warning',
        'Pending Verification': 'warning',
        Resolved: 'success',
        Rejected: 'danger'
    }

    const totalIssues = issues?.length || 0

    const inProgress = issues?.filter(issue =>
        issue.status === 'In Progress'
    ).length || 0

    const resolved = issues?.filter(issue =>
        issue.status === 'Resolved'
    ).length || 0

    const awaitingAction = issues?.filter(issue =>
        ['Reported', 'Assigned', 'Pending Verification'].includes(issue.status)
    ).length || 0

    const recentIssues = [...(issues || [])]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 6)

    const styles = {
        page: {
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#102544',
            background: '#f4f7fc'
        },

        navbar: {
            background: '#071a36',
            borderBottom: '1px solid rgba(125, 180, 255, 0.15)'
        },

        brand: {
            color: '#ffffff',
            fontSize: '29px',
            fontWeight: '800',
            letterSpacing: '-1px',
            textDecoration: 'none'
        },

        navLink: {
            color: '#d5e5ff',
            fontWeight: '600',
            textDecoration: 'none'
        },

        outlineButton: {
            border: '1px solid #5daeff',
            color: '#8bc5ff',
            borderRadius: '10px',
            fontWeight: '650',
            padding: '10px 20px',
            background: 'transparent'
        },

        primaryButton: {
            background: 'linear-gradient(100deg, #269cff, #0759dc)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            padding: '11px 23px',
            boxShadow: '0 6px 18px rgba(0, 95, 220, 0.18)'
        },

        hero: {
            background: 'linear-gradient(120deg, #06152f 0%, #0a2854 60%, #10427b 100%)',
            minHeight: '500px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        },

        heroBadge: {
            display: 'inline-block',
            background: 'rgba(73, 161, 255, 0.16)',
            color: '#8ecaff',
            border: '1px solid rgba(111, 185, 255, 0.3)',
            borderRadius: '30px',
            padding: '9px 17px',
            fontSize: '12px',
            letterSpacing: '1.5px',
            fontWeight: '700'
        },

        heroHeading: {
            color: '#ffffff',
            fontWeight: '800',
            lineHeight: '1.17',
            letterSpacing: '-1.5px'
        },

        heroText: {
            color: '#c2d9f7',
            lineHeight: '1.9',
            maxWidth: '620px'
        },

        heroPanel: {
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(150, 197, 255, 0.22)',
            borderRadius: '24px',
            padding: '45px 35px',
            color: '#ffffff',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 55px rgba(0,0,0,0.16)'
        },

        statCard: {
            background: '#ffffff',
            border: '1px solid #e5ebf5',
            borderRadius: '18px',
            boxShadow: '0 7px 25px rgba(18, 47, 88, 0.05)',
            transition: 'transform 0.2s ease'
        },

        statIcon: {
            width: '51px',
            height: '51px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eaf3ff',
            borderRadius: '14px',
            fontSize: '25px',
            marginBottom: '17px'
        },

        sectionTitle: {
            color: '#0a2348',
            fontWeight: '800',
            letterSpacing: '-0.5px'
        },

        sectionText: {
            color: '#718198'
        },

        sectionBackground: {
            background: '#edf3fb'
        },

        issueCard: {
            border: '1px solid #e5ebf5',
            borderRadius: '17px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 8px 25px rgba(18, 47, 88, 0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        },

        aboutPanel: {
            background: 'linear-gradient(145deg, #0a2145, #10447b)',
            borderRadius: '22px',
            color: '#ffffff',
            padding: '45px 35px',
            boxShadow: '0 15px 40px rgba(10, 35, 72, 0.15)'
        },

        infoCard: {
            background: '#f0f5fd',
            border: '1px solid #e1eafa',
            borderRadius: '13px',
            padding: '19px',
            height: '100%'
        },

        cta: {
            background: 'linear-gradient(110deg, #071a36, #0d3670)',
            color: '#ffffff'
        },

        footer: {
            background: '#041126',
            color: '#b5c7e2'
        }
    }

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav
                className="navbar navbar-expand-lg sticky-top"
                style={styles.navbar}
            >
                <div className="container py-2">

                    <Link to="/" style={styles.brand}>
                        CivicLens
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#landingNavbar"
                        aria-controls="landingNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{
                            border: '1px solid #496a97',
                            background: '#10294c'
                        }}
                    >
                        <span
                            className="navbar-toggler-icon"
                            style={{
                                filter: 'invert(1)'
                            }}
                        ></span>
                    </button>

                    <div className="collapse navbar-collapse" id="landingNavbar">

                        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

                            <a href="#issues" className="nav-link"
                                style={styles.navLink}>
                                Explore Issues
                            </a>

                            <a href="#about" className="nav-link"
                                style={styles.navLink}>
                                About
                            </a>

                            {!user ? (
                                <Link
                                    to="/login"
                                    className="btn"
                                    style={styles.outlineButton}
                                >
                                    Login
                                </Link>
                            ) : (
                                <button
                                    onClick={handleDashboardClick}
                                    className="btn"
                                    style={styles.outlineButton}
                                >
                                    My Dashboard
                                </button>
                            )}

                            <button
                                onClick={handleReportClick}
                                className="btn"
                                style={styles.primaryButton}
                            >
                                Report an Issue
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>

                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={styles.hero}>
                <div className="container py-5">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-7">

                            <span style={styles.heroBadge}>
                                YOUR COMMUNITY, YOUR VOICE
                            </span>

                            <h1
                                className="display-3 mt-4 mb-4"
                                style={styles.heroHeading}
                            >
                                Building Better Communities{' '}
                                <span style={{ color: '#72baff' }}>
                                    Together
                                </span>
                            </h1>

                            <p
                                className="fs-5 mb-4"
                                style={styles.heroText}
                            >
                                Report civic issues, track their progress,
                                and help make your neighbourhood a better
                                place to live. Every report is a step
                                towards positive change.
                            </p>

                            <div className="d-flex flex-wrap gap-3">

                                <button
                                    onClick={handleReportClick}
                                    className="btn btn-lg"
                                    style={styles.primaryButton}
                                >
                                    Report an Issue
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>

                                <a
                                    href="#issues"
                                    className="btn btn-lg"
                                    style={{
                                        border: '1px solid #7daeea',
                                        color: '#d9eaff',
                                        borderRadius: '10px',
                                        padding: '11px 23px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Explore Reported Issues
                                </a>

                            </div>
                        </div>

                        <div className="col-lg-5">

                            <div style={styles.heroPanel}>

                                <div
                                    className="text-center"
                                    style={{
                                        fontSize: '76px',
                                        marginBottom: '20px'
                                    }}
                                >
                                    🏙️
                                </div>

                                <h3 className="fw-bold text-center mb-3">
                                    Make Your Voice Count
                                </h3>

                                <p
                                    className="text-center mb-0"
                                    style={{
                                        color: '#c2d9f7',
                                        lineHeight: '1.9'
                                    }}
                                >
                                    Connect citizens, administrators,
                                    and department staff to resolve
                                    community problems efficiently.
                                </p>

                                <div
                                    className="d-flex justify-content-center gap-4 mt-4 pt-4"
                                    style={{
                                        borderTop: '1px solid rgba(255,255,255,0.15)'
                                    }}
                                >
                                    <div className="text-center">
                                        <i className="bi bi-people fs-3"
                                            style={{ color: '#75bcff' }}></i>
                                        <p className="small mt-2 mb-0">
                                            Citizens
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <i className="bi bi-building fs-3"
                                            style={{ color: '#75bcff' }}></i>
                                        <p className="small mt-2 mb-0">
                                            Departments
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <i className="bi bi-check-circle fs-3"
                                            style={{ color: '#75bcff' }}></i>
                                        <p className="small mt-2 mb-0">
                                            Solutions
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* STATISTICS */}
            <section className="container py-5">

                <div className="text-center mb-4">
                    <span
                        className="fw-bold small"
                        style={{ color: '#267ed9', letterSpacing: '2px' }}
                    >
                        COMMUNITY OVERVIEW
                    </span>

                    <h2 className="mt-2" style={styles.sectionTitle}>
                        CivicLens at a Glance
                    </h2>
                </div>

                <div className="row g-4">

                    {[
                        {
                            title: 'Total Reports',
                            value: totalIssues,
                            icon: '📋'
                        },
                        {
                            title: 'In Progress',
                            value: inProgress,
                            icon: '🔧'
                        },
                        {
                            title: 'Resolved',
                            value: resolved,
                            icon: '✅'
                        },
                        {
                            title: 'Awaiting Action',
                            value: awaitingAction,
                            icon: '⏳'
                        }
                    ].map((item, index) => (
                        <div className="col-6 col-lg-3" key={index}>

                            <div
                                className="card border-0 h-100"
                                style={styles.statCard}
                            >
                                <div className="card-body p-4">

                                    <div style={styles.statIcon}>
                                        {item.icon}
                                    </div>

                                    <h2
                                        className="fw-bold mb-2"
                                        style={{
                                            color: '#0a2854',
                                            fontSize: '34px'
                                        }}
                                    >
                                        {item.value}
                                    </h2>

                                    <p
                                        className="mb-0 fw-semibold"
                                        style={{ color: '#72839b' }}
                                    >
                                        {item.title}
                                    </p>

                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </section>

            {/* RECENT ISSUES */}
            <section
                id="issues"
                className="py-5"
                style={{
                    ...styles.sectionBackground,
                    scrollMarginTop: '85px'
                }}
            >
                <div className="container">

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                        <div>
                            <span
                                className="fw-bold small"
                                style={{
                                    color: '#267ed9',
                                    letterSpacing: '2px'
                                }}
                            >
                                COMMUNITY UPDATES
                            </span>

                            <h2
                                className="mt-2 mb-2"
                                style={styles.sectionTitle}
                            >
                                Recent Reported Issues
                            </h2>

                            <p className="mb-0" style={styles.sectionText}>
                                See what is happening in our community.
                            </p>
                        </div>

                        <button
                            onClick={handleReportClick}
                            className="btn"
                            style={styles.primaryButton}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Report an Issue
                        </button>

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-5 bg-white rounded-4">

                            <div
                                className="spinner-border"
                                style={{ color: '#1679e8' }}
                            ></div>

                            <p className="mt-3 mb-0" style={styles.sectionText}>
                                Loading reported issues...
                            </p>

                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="alert alert-danger rounded-4">
                            Could not load reported issues. Please make sure
                            your JSON Server is running on port 4000.
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && recentIssues.length === 0 && (
                        <div
                            className="text-center bg-white rounded-4 p-5"
                            style={{
                                border: '1px solid #e3eaf5',
                                boxShadow: '0 8px 25px rgba(18,47,88,0.04)'
                            }}
                        >
                            <div className="fs-1 mb-3">📭</div>

                            <h4 className="fw-bold"
                                style={{ color: '#0a2854' }}>
                                No issues reported yet
                            </h4>

                            <p style={styles.sectionText}>
                                Be the first to report an issue
                                in your community.
                            </p>

                            <button
                                onClick={handleReportClick}
                                className="btn"
                                style={styles.primaryButton}
                            >
                                Report the First Issue
                            </button>
                        </div>
                    )}

                    {/* Issue cards */}
                    {!loading && !error && recentIssues.length > 0 && (
                        <div className="row g-4">

                            {recentIssues.map(issue => (
                                <div className="col-md-6 col-lg-4" key={issue.id}>

                                    <div
                                        className="card h-100"
                                        style={styles.issueCard}
                                    >

                                        {issue.imageUrl ? (
                                            <img
                                                src={issue.imageUrl}
                                                alt={issue.title || 'Reported civic issue'}
                                                className="card-img-top"
                                                style={{
                                                    height: '200px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    height: '150px',
                                                    background: 'linear-gradient(135deg, #e5efff, #d6e7ff)',
                                                    fontSize: '48px'
                                                }}
                                            >
                                                🏘️
                                            </div>
                                        )}

                                        <div className="card-body p-4">

                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">

                                                <span
                                                    className="badge rounded-pill"
                                                    style={{
                                                        background: '#eaf2ff',
                                                        color: '#1a4d8f',
                                                        padding: '8px 12px'
                                                    }}
                                                >
                                                    {issue.category || 'General'}
                                                </span>

                                                <span
                                                    className={`badge text-bg-${statusColors[issue.status] || 'secondary'}`}
                                                >
                                                    {issue.status || 'Reported'}
                                                </span>

                                            </div>

                                            <h5
                                                className="fw-bold mb-3"
                                                style={{ color: '#102b50' }}
                                            >
                                                {issue.title || 'Untitled Issue'}
                                            </h5>

                                            <p
                                                className="mb-3"
                                                style={{
                                                    color: '#728198',
                                                    minHeight: '48px',
                                                    lineHeight: '1.7'
                                                }}
                                            >
                                                {(issue.description || 'No description provided.')
                                                    .slice(0, 100)}

                                                {(issue.description || '').length > 100
                                                    ? '...'
                                                    : ''}
                                            </p>

                                            <div
                                                className="pt-3"
                                                style={{
                                                    borderTop: '1px solid #edf1f7'
                                                }}
                                            >
                                                <p className="small mb-2"
                                                    style={{ color: '#627792' }}>
                                                    <i className="bi bi-geo-alt-fill me-2"
                                                        style={{ color: '#267ed9' }}></i>
                                                    {issue.location || 'Location not specified'}
                                                </p>

                                                <p className="small mb-0"
                                                    style={{ color: '#627792' }}>
                                                    <i className="bi bi-calendar3 me-2"
                                                        style={{ color: '#267ed9' }}></i>
                                                    {issue.createdAt
                                                        ? new Date(issue.createdAt).toLocaleDateString()
                                                        : 'Date unavailable'}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </section>

            {/* ABOUT */}
            <section
                id="about"
                className="py-5"
                style={{ scrollMarginTop: '85px' }}
            >
                <div className="container py-3">

                    <div className="row align-items-center g-5">

                        <div className="col-lg-5">

                            <div style={styles.aboutPanel}>

                                <div
                                    className="text-center"
                                    style={{ fontSize: '70px' }}
                                >
                                
                                </div>

                                <h3 className="fw-bold text-center mt-3">
                                    Stronger Communities
                                </h3>

                                <p
                                    className="text-center mb-0"
                                    style={{
                                        color: '#c5dcfa',
                                        lineHeight: '1.9'
                                    }}
                                >
                                    Better communication leads to better
                                    civic services.
                                </p>

                            </div>

                        </div>

                        <div className="col-lg-7">

                            <span
                                className="fw-bold small"
                                style={{
                                    color: '#267ed9',
                                    letterSpacing: '2px'
                                }}
                            >
                                ABOUT CIVICLENS
                            </span>

                            <h2
                                className="fw-bold display-6 mt-2 mb-4"
                                style={styles.sectionTitle}
                            >
                                A Smarter Way to Address Civic Issues
                            </h2>

                            <p
                                style={{
                                    color: '#667a94',
                                    lineHeight: '1.9'
                                }}
                            >
                                CivicLens is a public issue reporting and
                                resolution platform designed to connect
                                citizens with the teams responsible for
                                maintaining their communities.
                            </p>

                            <p
                                style={{
                                    color: '#667a94',
                                    lineHeight: '1.9'
                                }}
                            >
                                Citizens can report problems such as damaged
                                roads, sanitation concerns, water supply
                                issues, and electricity problems.
                                Administrators can assign reports to the
                                appropriate department, while department
                                staff update progress and submit evidence
                                of completed work.
                            </p>

                            <div className="row g-3 mt-3">

                                <div className="col-sm-6">
                                    <div style={styles.infoCard}>
                                        <h6 className="fw-bold"
                                            style={{ color: '#123563' }}>
                                            📢 Report Issues
                                        </h6>

                                        <p className="small mb-0"
                                            style={{ color: '#718198' }}>
                                            Submit a problem with its
                                            details and location.
                                        </p>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div style={styles.infoCard}>
                                        <h6 className="fw-bold"
                                            style={{ color: '#123563' }}>
                                            🔍 Track Progress
                                        </h6>

                                        <p className="small mb-0"
                                            style={{ color: '#718198' }}>
                                            Follow the status of
                                            reported issues.
                                        </p>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div style={styles.infoCard}>
                                        <h6 className="fw-bold"
                                            style={{ color: '#123563' }}>
                                            👷 Department Coordination
                                        </h6>

                                        <p className="small mb-0"
                                            style={{ color: '#718198' }}>
                                            Help staff manage and resolve
                                            assigned tasks.
                                        </p>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div style={styles.infoCard}>
                                        <h6 className="fw-bold"
                                            style={{ color: '#123563' }}>
                                            ⭐ Citizen Feedback
                                        </h6>

                                        <p className="small mb-0"
                                            style={{ color: '#718198' }}>
                                            Share feedback after an
                                            issue is resolved.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* CALL TO ACTION */}
            <section
                className="py-5 text-center"
                style={styles.cta}
            >
                <div className="container py-4">

                    <span
                        className="fw-bold small"
                        style={{
                            color: '#83c5ff',
                            letterSpacing: '2px'
                        }}
                    >
                        YOUR VOICE MATTERS
                    </span>

                    <h2 className="fw-bold mt-3 mb-3">
                        See a Problem in Your Community?
                    </h2>

                    <p
                        className="mb-4"
                        style={{
                            color: '#c5d9f4',
                            lineHeight: '1.8'
                        }}
                    >
                        Speak up, report it, and help make a difference.
                    </p>

                    <button
                        onClick={handleReportClick}
                        className="btn btn-lg"
                        style={styles.primaryButton}
                    >
                        Report an Issue
                        <i className="bi bi-arrow-right ms-2"></i>
                    </button>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-4" style={styles.footer}>
                <div className="container">

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

                        <div>
                            <h5
                                className="fw-bold mb-1"
                                style={{ color: '#ffffff' }}
                            >
                                CivicLens
                            </h5>

                            <small>
                                Building better communities together.
                            </small>
                        </div>

                        <small>
                            © {new Date().getFullYear()} CivicLens.
                            All rights reserved.
                        </small>

                    </div>

                </div>
            </footer>

        </div>
    )
}

export default Landing