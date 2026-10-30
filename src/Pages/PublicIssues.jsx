
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
    FiPlus, FiClipboard, FiClock, FiActivity,
    FiCheckCircle, FiMapPin, FiCalendar, FiTag,
    FiEye, FiEdit2, FiTrash2, FiArrowRight,
    FiAlertCircle, FiRefreshCw, FiInbox
} from 'react-icons/fi'
import { getAllIssues, deleteIssue } from '../Redux/slice/issueSlice'

function PublicIssues() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { issues = [], loading, error } = useSelector(
        state => state.issueReducer
    )
    const { user } = useSelector(state => state.authReducer)

    useEffect(() => {
        dispatch(getAllIssues())
    }, [dispatch])

    const myIssues = issues.filter(
        issue => String(issue.userId) === String(user?.id)
    )

    const reported = myIssues.filter(issue => issue.status === 'Reported').length
    const inProgress = myIssues.filter(issue => issue.status === 'In Progress').length
    const resolved = myIssues.filter(issue => issue.status === 'Resolved').length

    const statusInfo = {
        Reported: { className: 'reported', icon: <FiClipboard /> },
        Assigned: { className: 'assigned', icon: <FiClock /> },
        'In Progress': { className: 'progress', icon: <FiActivity /> },
        'Pending Verification': { className: 'verification', icon: <FiRefreshCw /> },
        Resolved: { className: 'resolved', icon: <FiCheckCircle /> },
        Rejected: { className: 'rejected', icon: <FiAlertCircle /> }
    }

    const handleDelete = async id => {
        const result = await Swal.fire({
            title: 'Delete this report?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Keep report',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#64748b'
        })

        if (result.isConfirmed) {
            try {
                await dispatch(deleteIssue(id)).unwrap()
                await Swal.fire('Deleted!', 'Your report has been deleted.', 'success')
            } catch {
                Swal.fire('Error', 'Unable to delete this report.', 'error')
            }
        }
    }

    const styles = {
        page: {
            minHeight: '100vh',
            padding: '30px',
            background: '#f4f7fc',
            color: '#172554',
            fontFamily: 'Arial, sans-serif'
        },
        hero: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            padding: '42px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(115deg, #0b1228, #172e67 58%, #2563eb)',
            color: 'white',
            boxShadow: '0 18px 40px rgba(30,58,138,0.16)'
        },
        eyebrow: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '17px',
            padding: '8px 12px',
            border: '1px solid #ffffff30',
            borderRadius: '30px',
            background: '#ffffff12',
            color: '#dbeafe',
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1.3px'
        },
        heading: {
            margin: '0 0 14px',
            fontSize: 'clamp(27px, 4vw, 39px)',
            fontWeight: '800',
            letterSpacing: '-0.7px'
        },
        subtitle: {
            maxWidth: '520px',
            margin: '0 0 24px',
            color: '#d4e3ff',
            fontSize: '14px',
            lineHeight: '1.8'
        },
        primaryButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '13px 18px',
            border: 'none',
            borderRadius: '10px',
            background: '#ffffff',
            color: '#1d4ed8',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
        },
        heroArt: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '180px',
            height: '180px',
            border: '1px solid #ffffff20',
            borderRadius: '50%',
            background: '#ffffff08',
            color: 'white',
            fontSize: '72px'
        },
        heroFloat: {
            position: 'absolute',
            right: '0',
            bottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '47px',
            height: '47px',
            borderRadius: '14px',
            background: 'white',
            color: '#059669',
            fontSize: '22px',
            boxShadow: '0 8px 20px #0002'
        },
        stats: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '17px',
            margin: '25px 0 40px'
        },
        statCard: {
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '21px',
            border: '1px solid #e8edf5',
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 5px 18px #0f172a08'
        },
        statIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            fontSize: '23px'
        },
        statLabel: {
            margin: '0 0 5px',
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600'
        },
        statNumber: {
            margin: '0 0 4px',
            color: '#172554',
            fontSize: '27px',
            fontWeight: '800'
        },
        statHint: {
            color: '#94a3b8',
            fontSize: '10px'
        },
        sectionHeader: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '22px'
        },
        sectionEyebrow: {
            marginBottom: '7px',
            color: '#2563eb',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '1.5px'
        },
        sectionTitle: {
            margin: '0 0 7px',
            color: '#172554',
            fontSize: '24px',
            fontWeight: '800'
        },
        sectionText: {
            margin: 0,
            color: '#64748b',
            fontSize: '13px',
            lineHeight: '1.6'
        },
        countBadge: {
            padding: '9px 13px',
            border: '1px solid #dbeafe',
            borderRadius: '9px',
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '11px',
            fontWeight: '700'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '22px'
        },
        card: {
            minWidth: 0,
            overflow: 'hidden',
            border: '1px solid #e5eaf3',
            borderRadius: '18px',
            background: 'white',
            boxShadow: '0 5px 20px #0f172a08'
        },
        imageArea: {
            position: 'relative',
            height: '190px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #eaf2ff, #dbeafe)'
        },
        image: {
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        placeholder: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            height: '100%',
            color: '#3b82f6',
            fontSize: '40px'
        },
        status: {
            position: 'absolute',
            top: '13px',
            right: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 10px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '800',
            boxShadow: '0 3px 10px #0f172a10'
        },
        cardBody: { padding: '21px' },
        cardTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px'
        },
        issueId: {
            color: '#94a3b8',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '0.7px'
        },
        priority: {
            padding: '6px 9px',
            borderRadius: '7px',
            fontSize: '9px',
            fontWeight: '800'
        },
        cardTitle: {
            margin: '0 0 10px',
            color: '#172554',
            fontSize: '17px',
            fontWeight: '800',
            lineHeight: '1.5',
            overflowWrap: 'anywhere'
        },
        description: {
            display: '-webkit-box',
            minHeight: '60px',
            margin: '0 0 18px',
            overflow: 'hidden',
            color: '#64748b',
            fontSize: '12px',
            lineHeight: '1.7',
            overflowWrap: 'anywhere',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
        },
        metadata: {
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            padding: '16px 0',
            borderTop: '1px solid #edf1f7',
            borderBottom: '1px solid #edf1f7'
        },
        metaRow: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '9px',
            color: '#64748b',
            fontSize: '11px',
            lineHeight: '1.6',
            overflowWrap: 'anywhere'
        },
        metaIcon: {
            flexShrink: 0,
            marginTop: '2px',
            color: '#3b82f6',
            fontSize: '14px'
        },
        actions: {
            display: 'flex',
            gap: '8px',
            marginTop: '17px'
        },
        actionButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            minHeight: '38px',
            padding: '9px 11px',
            border: '1px solid',
            borderRadius: '9px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
        },
        message: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '50px 22px',
            border: '1px solid #e5eaf3',
            borderRadius: '18px',
            background: 'white',
            textAlign: 'center'
        },
        footer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '35px',
            padding: '20px 0 5px',
            color: '#94a3b8',
            fontSize: '11px'
        }
    }

    const statCards = [
        {
            title: 'Total Reports',
            value: myIssues.length,
            hint: 'All your submissions',
            icon: <FiClipboard />,
            color: '#2563eb',
            background: '#eff6ff'
        },
        {
            title: 'Reported',
            value: reported,
            hint: 'Awaiting action',
            icon: <FiClock />,
            color: '#d97706',
            background: '#fffbeb'
        },
        {
            title: 'In Progress',
            value: inProgress,
            hint: 'Being addressed',
            icon: <FiActivity />,
            color: '#7c3aed',
            background: '#f5f3ff'
        },
        {
            title: 'Resolved',
            value: resolved,
            hint: 'Successfully completed',
            icon: <FiCheckCircle />,
            color: '#059669',
            background: '#ecfdf5'
        }
    ]

    const getPriorityStyle = priority => {
        if (priority === 'High') {
            return { color: '#b91c1c', background: '#fef2f2' }
        }
        if (priority === 'Low') {
            return { color: '#047857', background: '#ecfdf5' }
        }
        return { color: '#b45309', background: '#fffbeb' }
    }

    const getStatusStyle = status => {
        const map = {
            Reported: { color: '#475569', background: '#f1f5f9' },
            Assigned: { color: '#1d4ed8', background: '#dbeafe' },
            'In Progress': { color: '#92400e', background: '#fef3c7' },
            'Pending Verification': { color: '#6d28d9', background: '#ede9fe' },
            Resolved: { color: '#047857', background: '#d1fae5' },
            Rejected: { color: '#b91c1c', background: '#fee2e2' }
        }
        return map[status] || map.Reported
    }

    return (
        <>
            <style>{`
                @media (max-width: 650px) {
                    .civic-public-page { padding: 16px !important; }
                    .civic-public-hero { padding: 28px 22px !important; }
                    .civic-public-art { display: none !important; }
                    .civic-public-heading { font-size: 28px !important; }
                    .civic-public-card-image { height: 175px !important; }
                }
                @media (hover: hover) {
                    .civic-public-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 15px 32px #0f172a12 !important;
                    }
                    .civic-public-action:hover { filter: brightness(0.96); }
                    .civic-public-report:hover { transform: translateY(-2px); }
                }
                .civic-public-card, .civic-public-action, .civic-public-report {
                    transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
                }
                .civic-public-page button:focus-visible {
                    outline: 3px solid #93c5fd;
                    outline-offset: 3px;
                }
                @keyframes civic-spin {
                    to { transform: rotate(360deg); }
                }
                .civic-public-spinner {
                    animation: civic-spin 1s linear infinite;
                }
            `}</style>

            <div className="civic-public-page" style={styles.page}>
                {/* Hero */}
                <section className="civic-public-hero" style={styles.hero}>
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                        <div style={styles.eyebrow}>
                            <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: '#60a5fa'
                            }} />
                            CIVICLENS / CITIZEN PORTAL
                        </div>

                        <h1 className="civic-public-heading" style={styles.heading}>
                            My Reported Issues
                        </h1>

                        <p style={styles.subtitle}>
                            Every report brings your community one step closer to change.
                            Track your submissions and follow their progress.
                        </p>

                        <button
                            className="civic-public-report"
                            style={styles.primaryButton}
                            onClick={() => navigate('/report')}
                        >
                            <FiPlus />
                            Report a New Issue
                            <FiArrowRight />
                        </button>
                    </div>

                    <div className="civic-public-art" style={styles.heroArt}>
                        <FiClipboard />
                        <div style={styles.heroFloat}><FiCheckCircle /></div>
                    </div>
                </section>

                {/* Statistics */}
                <section style={styles.stats}>
                    {statCards.map(stat => (
                        <div style={styles.statCard} key={stat.title}>
                            <div style={{
                                ...styles.statIcon,
                                color: stat.color,
                                background: stat.background
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={styles.statLabel}>{stat.title}</p>
                                <h2 style={styles.statNumber}>{stat.value}</h2>
                                <span style={styles.statHint}>{stat.hint}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Section heading */}
                <div style={styles.sectionHeader}>
                    <div>
                        <div style={styles.sectionEyebrow}>YOUR ACTIVITY</div>
                        <h2 style={styles.sectionTitle}>Your Reports</h2>
                        <p style={styles.sectionText}>
                            View details and monitor the status of each issue.
                        </p>
                    </div>
                    <span style={styles.countBadge}>
                        {myIssues.length} {myIssues.length === 1 ? 'report' : 'reports'}
                    </span>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={styles.message}>
                        <FiRefreshCw
                            className="civic-public-spinner"
                            style={{ fontSize: '30px', color: '#2563eb', marginBottom: '15px' }}
                        />
                        <h3>Loading your reports</h3>
                        <p style={styles.sectionText}>Please wait while we fetch your issues.</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div style={{
                        ...styles.message,
                        flexDirection: 'row',
                        gap: '12px',
                        color: '#b91c1c',
                        textAlign: 'left'
                    }}>
                        <FiAlertCircle style={{ fontSize: '24px', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <strong>Couldn't load your reports</strong>
                            <p style={{ overflowWrap: 'anywhere' }}>{error}</p>
                        </div>
                        <button
                            style={{
                                ...styles.actionButton,
                                borderColor: '#fecaca',
                                background: '#fef2f2',
                                color: '#b91c1c'
                            }}
                            onClick={() => dispatch(getAllIssues())}
                        >
                            <FiRefreshCw /> Retry
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && myIssues.length === 0 && (
                    <div style={styles.message}>
                        <div style={{
                            ...styles.statIcon,
                            width: '75px',
                            height: '75px',
                            marginBottom: '18px',
                            color: '#2563eb',
                            background: '#eff6ff',
                            fontSize: '34px'
                        }}>
                            <FiInbox />
                        </div>
                        <h3 style={{ color: '#172554', fontSize: '21px', margin: '0 0 10px' }}>
                            Your story starts here
                        </h3>
                        <p style={{ ...styles.sectionText, maxWidth: '420px', marginBottom: '22px' }}>
                            You haven't reported any civic issues yet.
                            Help improve your neighbourhood by submitting your first report.
                        </p>
                        <button
                            className="civic-public-report"
                            style={{
                                ...styles.primaryButton,
                                background: '#2563eb',
                                color: 'white'
                            }}
                            onClick={() => navigate('/report')}
                        >
                            <FiPlus /> Create Your First Report
                        </button>
                    </div>
                )}

                {/* Issue cards */}
                {!loading && !error && myIssues.length > 0 && (
                    <div style={styles.grid}>
                        {myIssues.map(issue => {
                            const status = statusInfo[issue.status] || statusInfo.Reported

                            return (
                                <article
                                    className="civic-public-card"
                                    style={styles.card}
                                    key={issue.id}
                                >
                                    <div
                                        className="civic-public-card-image"
                                        style={styles.imageArea}
                                    >
                                        {issue.imageUrl ? (
                                            <img
                                                src={issue.imageUrl}
                                                alt={issue.title}
                                                style={styles.image}
                                            />
                                        ) : (
                                            <div style={styles.placeholder}>
                                                <FiClipboard />
                                                <span style={{ fontSize: '11px', fontWeight: '700' }}>
                                                    CivicLens Report
                                                </span>
                                            </div>
                                        )}

                                        <span style={{
                                            ...styles.status,
                                            ...getStatusStyle(issue.status)
                                        }}>
                                            {status.icon}
                                            {issue.status || 'Reported'}
                                        </span>
                                    </div>

                                    <div style={styles.cardBody}>
                                        <div style={styles.cardTop}>
                                            <span style={styles.issueId}>
                                                REPORT #{issue.id}
                                            </span>
                                            <span style={{
                                                ...styles.priority,
                                                ...getPriorityStyle(issue.priority)
                                            }}>
                                                {issue.priority || 'Medium'} Priority
                                            </span>
                                        </div>

                                        <h3 style={styles.cardTitle}>{issue.title}</h3>

                                        <p style={styles.description}>
                                            {issue.description}
                                        </p>

                                        <div style={styles.metadata}>
                                            <div style={styles.metaRow}>
                                                <FiTag style={styles.metaIcon} />
                                                <span>{issue.category || 'Uncategorised'}</span>
                                            </div>
                                            <div style={styles.metaRow}>
                                                <FiMapPin style={styles.metaIcon} />
                                                <span>{issue.location || 'Location not provided'}</span>
                                            </div>
                                            <div style={styles.metaRow}>
                                                <FiCalendar style={styles.metaIcon} />
                                                <span>
                                                    {issue.createdAt
                                                        ? new Date(issue.createdAt).toLocaleDateString(
                                                            'en-IN',
                                                            {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }
                                                        )
                                                        : 'Date unavailable'}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={styles.actions}>
                                            <button
                                                className="civic-public-action"
                                                style={{
                                                    ...styles.actionButton,
                                                    flex: 1,
                                                    borderColor: '#bfdbfe',
                                                    background: '#eff6ff',
                                                    color: '#1d4ed8'
                                                }}
                                                onClick={() => navigate(`/issues/${issue.id}`)}
                                            >
                                                <FiEye /> View Details
                                            </button>

                                            {issue.status === 'Reported' && (
                                                <>
                                                    <button
                                                        className="civic-public-action"
                                                        title="Edit report"
                                                        aria-label="Edit report"
                                                        style={{
                                                            ...styles.actionButton,
                                                            width: '40px',
                                                            padding: '9px',
                                                            borderColor: '#a7f3d0',
                                                            background: '#ecfdf5',
                                                            color: '#047857'
                                                        }}
                                                        onClick={() => navigate(`/edit-issue/${issue.id}`)}
                                                    >
                                                        <FiEdit2 />
                                                    </button>

                                                    <button
                                                        className="civic-public-action"
                                                        title="Delete report"
                                                        aria-label="Delete report"
                                                        style={{
                                                            ...styles.actionButton,
                                                            width: '40px',
                                                            padding: '9px',
                                                            borderColor: '#fecaca',
                                                            background: '#fef2f2',
                                                            color: '#b91c1c'
                                                        }}
                                                        onClick={() => handleDelete(issue.id)}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}

               
            </div>
        </>
    )
}

export default PublicIssues
