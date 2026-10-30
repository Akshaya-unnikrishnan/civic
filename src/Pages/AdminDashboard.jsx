
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Card, Table, Button, Form, Row, Col,
    Spinner, Alert, Badge, Modal
} from 'react-bootstrap'
import Swal from 'sweetalert2'
import {
    FaSearch, FaSyncAlt, FaClipboardList, FaCheckCircle,
    FaUserTie, FaClock, FaEye, FaMapMarkerAlt,
    FaTimes, FaFilter, FaUsers, FaExclamationTriangle,
    FaCheck, FaImage, FaChartBar, FaArrowRight
} from 'react-icons/fa'
import { getAllIssues, updateIssue } from '../Redux/slice/issueSlice'
import { getUsersAPI } from '../Services/allAPI'

const adminStyles = `
.admin-dashboard {
    color: #1e293b;
    padding-bottom: 25px;
}
.admin-header {
    background: linear-gradient(135deg, #101d3a, #1d4ed8);
    border-radius: 18px;
    padding: 28px;
    color: white;
    margin-bottom: 25px;
    position: relative;
    overflow: hidden;
}
.admin-header::after {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border: 30px solid rgba(255,255,255,0.07);
    border-radius: 50%;
    right: -35px;
    top: -65px;
    pointer-events: none;
}
.admin-header h2 {
    font-weight: 800;
    letter-spacing: -0.5px;
}
.admin-header p {
    color: #dbeafe;
    margin-bottom: 0;
}
.admin-header-icon {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.13);
    font-size: 27px;
    flex-shrink: 0;
}
.admin-stat-card {
    border: 1px solid #e8edf5 !important;
    border-radius: 15px !important;
    transition: transform .2s ease, box-shadow .2s ease;
    overflow: hidden;
}
.admin-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, .08) !important;
}
.admin-stat-label {
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}
.admin-stat-count {
    font-size: 27px;
    line-height: 1.2;
    font-weight: 800;
    color: #172554;
}
.admin-stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.admin-panel {
    border: 1px solid #e7edf5 !important;
    border-radius: 17px !important;
    overflow: hidden;
}
.admin-panel-header {
    padding: 21px 23px;
    border-bottom: 1px solid #edf1f7;
    background: #fff;
}
.admin-panel-header h5 {
    color: #172554;
    font-weight: 800;
}
.admin-filter-box {
    background: #f8fafc;
    border: 1px solid #e9eef6;
    border-radius: 13px;
    padding: 15px;
}
.admin-dashboard .form-control,
.admin-dashboard .form-select {
    border-color: #dbe3ef;
    border-radius: 9px;
    min-height: 41px;
    font-size: 13px;
}
.admin-dashboard .form-control:focus,
.admin-dashboard .form-select:focus {
    border-color: #6088ef;
    box-shadow: 0 0 0 3px rgba(37,99,235,.10);
}
.admin-search-wrap {
    position: relative;
}
.admin-search-icon {
    position: absolute;
    top: 13px;
    left: 13px;
    color: #94a3b8;
    z-index: 2;
}
.admin-search-input {
    padding-left: 37px !important;
}
.admin-table-wrap {
    overflow-x: auto;
}
.admin-table {
    margin-bottom: 0;
    min-width: 1050px;
}
.admin-table thead th {
    background: #f1f5f9;
    color: #475569;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .55px;
    font-weight: 800;
    padding: 15px 13px;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
}
.admin-table tbody td {
    padding: 16px 13px;
    border-color: #edf1f7;
    font-size: 13px;
    vertical-align: middle;
}
.admin-table tbody tr {
    transition: background .15s ease;
}
.admin-table tbody tr:hover td {
    background: #f8faff;
}
.admin-issue-title {
    color: #172554;
    font-weight: 750;
    max-width: 200px;
    overflow-wrap: anywhere;
}
.admin-issue-meta {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
}
.admin-reporter {
    font-size: 12px;
    color: #64748b;
    margin-top: 5px;
}
.admin-department {
    display: inline-block;
    padding: 5px 9px;
    border-radius: 7px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 700;
}
.admin-location {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    color: #475569;
    max-width: 160px;
    overflow-wrap: anywhere;
}
.admin-location svg {
    margin-top: 3px;
    flex-shrink: 0;
    color: #64748b;
}
.admin-priority,
.admin-status {
    display: inline-block;
    padding: 6px 9px;
    border-radius: 7px;
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
}
.admin-staff-name {
    font-weight: 700;
    color: #334155;
}
.admin-staff-dept {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 3px;
}
.admin-not-assigned {
    color: #94a3b8;
    font-size: 12px;
    font-style: italic;
}
.admin-action-stack {
    min-width: 180px;
}
.admin-action-stack .btn {
    font-size: 11px;
    font-weight: 650;
    border-radius: 7px;
}
.admin-action-stack .form-select {
    font-size: 11px;
    min-height: 35px;
    margin-top: 7px;
}
.admin-photo-btn {
    font-size: 11px !important;
    border-radius: 7px !important;
}
.admin-feedback {
    font-size: 10px;
    line-height: 1.5;
    overflow-wrap: anywhere;
    max-width: 180px;
}
.admin-empty-state {
    padding: 55px 20px;
    text-align: center;
}
.admin-empty-icon {
    width: 65px;
    height: 65px;
    border-radius: 18px;
    background: #eff6ff;
    color: #2563eb;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
}
.admin-empty-state h6 {
    color: #172554;
    font-weight: 800;
}
.admin-empty-state p {
    color: #94a3b8;
    font-size: 13px;
}
.admin-dashboard .btn-primary {
    background: #1d4ed8;
    border-color: #1d4ed8;
}
.admin-dashboard .btn-primary:hover {
    background: #1e40af;
}
.admin-dashboard .btn {
    border-radius: 9px;
    font-weight: 650;
}
.admin-modal .modal-content {
    border: 0;
    border-radius: 17px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(15,23,42,.2);
}
.admin-modal .modal-header {
    background: #101d3a;
    color: white;
    padding: 18px 23px;
    border: 0;
}
.admin-modal .modal-title {
    font-weight: 800;
    font-size: 17px;
}
.admin-modal .btn-close {
    filter: invert(1);
}
.admin-modal .modal-body {
    padding: 23px;
}
.admin-photo-card {
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    overflow: hidden;
    height: 100%;
    background: #fff;
}
.admin-photo-heading {
    padding: 12px 14px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-size: 12px;
    font-weight: 800;
    color: #334155;
}
.admin-photo-content {
    padding: 12px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
}
.admin-photo-content img {
    width: 100%;
    max-height: 330px;
    object-fit: contain;
    border-radius: 7px;
}
.admin-photo-empty {
    text-align: center;
    color: #94a3b8;
    font-size: 12px;
}
.admin-photo-empty svg {
    display: block;
    font-size: 25px;
    margin: 0 auto 10px;
}
.admin-evidence-note {
    background: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 10px;
    padding: 12px;
    color: #1e40af;
    font-size: 12px;
}
@media (max-width: 767px) {
    .admin-header {
        padding: 21px;
        border-radius: 14px;
    }
    .admin-header h2 {
        font-size: 22px;
    }
    .admin-header-icon {
        width: 45px;
        height: 45px;
        font-size: 21px;
    }
    .admin-stat-count {
        font-size: 24px;
    }
    .admin-panel-header {
        padding: 17px;
    }
    .admin-modal .modal-body {
        padding: 15px;
    }
}
`

function AdminDashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { issues, loading, error } = useSelector(state => state.issueReducer)

    const [staff, setStaff] = useState([])
    const [staffLoading, setStaffLoading] = useState(false)
    const [busyIssueId, setBusyIssueId] = useState(null)
    const [search, setSearch] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedIssue, setSelectedIssue] = useState(null)

    useEffect(() => {
        dispatch(getAllIssues())
        fetchStaff()
    }, [dispatch])

    const fetchStaff = async () => {
        try {
            setStaffLoading(true)
            const response = await getUsersAPI()
            setStaff(response.data.filter(user => user.role === 'staff'))
        } catch (err) {
            console.error('Failed to load staff:', err)
            Swal.fire('Error', 'Failed to load staff members.', 'error')
        } finally {
            setStaffLoading(false)
        }
    }

    const handleRefresh = () => {
        dispatch(getAllIssues())
        fetchStaff()
    }

    const filteredIssues = issues.filter(issue => {
        const term = search.trim().toLowerCase()

        const matchesSearch =
            (issue.title || '').toLowerCase().includes(term) ||
            (issue.location || '').toLowerCase().includes(term) ||
            (issue.userName || '').toLowerCase().includes(term) ||
            String(issue.id).toLowerCase().includes(term)

        const matchesDepartment =
            departmentFilter === 'All' ||
            (issue.category || 'Other') === departmentFilter

        const matchesStatus =
            statusFilter === 'All' ||
            (issue.status || 'Reported') === statusFilter

        return matchesSearch && matchesDepartment && matchesStatus
    })

    const handleAssign = async (issue) => {
        const matchingStaff = staff.filter(
            member => member.department === (issue.category || 'Other')
        )

        if (matchingStaff.length === 0) {
            Swal.fire(
                'No Staff Available',
                `No staff member is registered for ${issue.category || 'Other'}.`,
                'warning'
            )
            return
        }

        const result = await Swal.fire({
            title: 'Assign Issue',
            text: `Choose a staff member for "${issue.title}".`,
            input: 'select',
            inputOptions: Object.fromEntries(
                matchingStaff.map(member => [
                    String(member.id),
                    `${member.name} (${member.department})`
                ])
            ),
            inputPlaceholder: 'Select staff member',
            inputValidator: value => !value
                ? 'Please select a staff member.'
                : undefined,
            showCancelButton: true,
            confirmButtonText: 'Assign',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1d4ed8'
        })

        if (!result.isConfirmed) return

        const selectedStaff = matchingStaff.find(
            member => String(member.id) === String(result.value)
        )

        if (!selectedStaff) return

        try {
            setBusyIssueId(issue.id)

            await dispatch(updateIssue({
                id: issue.id,
                issueData: {
                    ...issue,
                    assignedStaffId: selectedStaff.id,
                    assignedStaffName: selectedStaff.name,
                    assignedDepartment: selectedStaff.department,
                    status: 'Assigned',
                    rejectionReason: ''
                }
            })).unwrap()

            Swal.fire({
                icon: 'success',
                title: 'Issue Assigned',
                text: `Assigned to ${selectedStaff.name}.`,
                timer: 1500,
                showConfirmButton: false
            })
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Failed to assign the issue.', 'error')
        } finally {
            setBusyIssueId(null)
        }
    }

    const handleStatusChange = async (issue, newStatus) => {
        if (newStatus === issue.status) return

        if (newStatus === 'Resolved') {
            Swal.fire(
                'Verification Required',
                'To resolve an issue, review the staff evidence.',
                'info'
            )
            return
        }

        if (['Assigned', 'In Progress'].includes(newStatus) && !issue.assignedStaffId) {
            Swal.fire(
                'Assign Staff First',
                'Assign this issue to a staff member first.',
                'warning'
            )
            return
        }

        if (newStatus === 'Pending Verification') {
            Swal.fire(
                'Not Allowed',
                'Staff must submit evidence before verification can begin.',
                'warning'
            )
            return
        }

        const confirmation = await Swal.fire({
            title: newStatus === 'Rejected'
                ? 'Reject this issue?'
                : `Change status to ${newStatus}?`,
            text: `Issue: ${issue.title}`,
            icon: newStatus === 'Rejected' ? 'warning' : 'question',
            input: newStatus === 'Rejected' ? 'textarea' : undefined,
            inputLabel: newStatus === 'Rejected' ? 'Reason for rejection' : undefined,
            inputPlaceholder: newStatus === 'Rejected' ? 'Enter a reason...' : undefined,
            inputValidator: newStatus === 'Rejected'
                ? value => !value?.trim() ? 'Please provide a reason.' : undefined
                : undefined,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#1d4ed8'
        })

        if (!confirmation.isConfirmed) return

        try {
            setBusyIssueId(issue.id)

            await dispatch(updateIssue({
                id: issue.id,
                issueData: {
                    ...issue,
                    status: newStatus,
                    ...(newStatus === 'Rejected'
                        ? { rejectionReason: confirmation.value.trim() }
                        : {})
                }
            })).unwrap()

            Swal.fire(
                'Status Updated',
                `Issue status changed to ${newStatus}.`,
                'success'
            )
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Failed to update issue status.', 'error')
        } finally {
            setBusyIssueId(null)
        }
    }

    const handleVerification = async (issue, approved) => {
        if (issue.status !== 'Pending Verification' || !issue.afterImageUrl) {
            Swal.fire(
                'Evidence Missing',
                'This issue must have staff-uploaded evidence and be pending verification.',
                'warning'
            )
            return
        }

        let rejectionReason = ''

        if (approved) {
            const result = await Swal.fire({
                title: 'Verify and Resolve?',
                text: 'Have you checked the after-work photo and confirmed that the issue is resolved?',
                imageUrl: issue.afterImageUrl,
                imageAlt: 'Staff after-work evidence',
                imageWidth: 300,
                showCancelButton: true,
                confirmButtonText: 'Verify & Resolve',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#198754'
            })

            if (!result.isConfirmed) return
        } else {
            const result = await Swal.fire({
                title: 'Reject Evidence',
                text: 'The issue will return to In Progress so the staff member can do further work.',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Explain what needs to be corrected...',
                inputValidator: value => !value?.trim()
                    ? 'Please provide a reason.'
                    : undefined,
                showCancelButton: true,
                confirmButtonText: 'Reject Evidence',
                confirmButtonColor: '#dc3545'
            })

            if (!result.isConfirmed) return
            rejectionReason = result.value.trim()
        }

        try {
            setBusyIssueId(issue.id)

            const updatedIssue = {
                ...issue,
                status: approved ? 'Resolved' : 'In Progress',
                ...(approved
                    ? {
                        verifiedAt: new Date().toISOString(),
                        verificationRejectionReason: ''
                    }
                    : {
                        verificationRejectionReason: rejectionReason,
                        afterImageUrl: ''
                    })
            }

            await dispatch(updateIssue({
                id: issue.id,
                issueData: updatedIssue
            })).unwrap()

            setSelectedIssue(null)

            Swal.fire({
                icon: 'success',
                title: approved ? 'Issue Resolved!' : 'Evidence Rejected',
                text: approved
                    ? 'The evidence has been approved and the issue is now resolved.'
                    : 'The issue has returned to In Progress. The staff member can upload new evidence.',
                timer: 1800,
                showConfirmButton: false
            })
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Failed to update the verification status.', 'error')
        } finally {
            setBusyIssueId(null)
        }
    }

    const getStatusColor = (status) => {
        switch (status || 'Reported') {
            case 'Reported': return 'secondary'
            case 'Assigned': return 'primary'
            case 'In Progress': return 'warning'
            case 'Pending Verification': return 'info'
            case 'Resolved': return 'success'
            case 'Rejected': return 'danger'
            default: return 'secondary'
        }
    }

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'High':
                return { background: '#fee2e2', color: '#b91c1c' }
            case 'Medium':
                return { background: '#fef3c7', color: '#92400e' }
            default:
                return { background: '#dcfce7', color: '#166534' }
        }
    }

    const statCards = [
        {
            title: 'Total Issues',
            count: issues.length,
            icon: <FaClipboardList />,
            color: '#4f46e5',
            background: '#eef2ff'
        },
        {
            title: 'Reported',
            count: issues.filter(i => (i.status || 'Reported') === 'Reported').length,
            icon: <FaClock />,
            color: '#d97706',
            background: '#fffbeb'
        },
        {
            title: 'Assigned',
            count: issues.filter(i => i.status === 'Assigned').length,
            icon: <FaUserTie />,
            color: '#2563eb',
            background: '#eff6ff'
        },
        {
            title: 'In Progress',
            count: issues.filter(i => i.status === 'In Progress').length,
            icon: <FaSyncAlt />,
            color: '#9333ea',
            background: '#f5f3ff'
        },
        {
            title: 'Pending Verification',
            count: issues.filter(i => i.status === 'Pending Verification').length,
            icon: <FaEye />,
            color: '#0891b2',
            background: '#ecfeff'
        },
        {
            title: 'Resolved',
            count: issues.filter(i => i.status === 'Resolved').length,
            icon: <FaCheckCircle />,
            color: '#16a34a',
            background: '#f0fdf4'
        },
        {
            title: 'Rejected',
            count: issues.filter(i => i.status === 'Rejected').length,
            icon: <FaExclamationTriangle />,
            color: '#dc2626',
            background: '#fef2f2'
        }
    ]

    return (
        <div className="admin-dashboard">
            <style>{adminStyles}</style>

            <div className="admin-header">
                <Row className="align-items-center g-3">
                    <Col>
                        <div className="d-flex align-items-center gap-3">
                            <div className="admin-header-icon">
                                <FaChartBar />
                            </div>
                            <div>
                                <h2 className="mb-1">Admin Dashboard</h2>
                                <p>Manage civic issues, staff assignments, and resolution verification.</p>
                            </div>
                        </div>
                    </Col>
                    <Col xs="auto">
                        <Button
                            variant="light"
                            onClick={handleRefresh}
                            disabled={loading || staffLoading}
                            className="d-flex align-items-center gap-2"
                        >
                            <FaSyncAlt />
                            {loading || staffLoading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </Col>
                </Row>
            </div>

            <Row className="g-3 mb-4">
                {statCards.map(stat => (
                    <Col key={stat.title} xs={6} sm={6} lg={4} xl={3}>
                        <Card className="admin-stat-card shadow-sm h-100">
                            <Card.Body className="d-flex align-items-center justify-content-between gap-2 p-3">
                                <div>
                                    <div className="admin-stat-label">{stat.title}</div>
                                    <div className="admin-stat-count">{stat.count}</div>
                                </div>
                                <div
                                    className="admin-stat-icon"
                                    style={{ background: stat.background, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="admin-panel shadow-sm">
                <div className="admin-panel-header">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div>
                            <h5 className="mb-1">All Civic Issues</h5>
                            <p className="text-muted small mb-0">
                                Showing <strong>{filteredIssues.length}</strong> of {issues.length} issues
                            </p>
                        </div>
                        <Badge bg="light" text="dark" className="px-3 py-2">
                            <FaClipboardList className="me-2 text-primary" />
                            {issues.length} Total Records
                        </Badge>
                    </div>
                </div>

                <Card.Body className="p-3 p-md-4">
                    <div className="admin-filter-box mb-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <FaFilter className="text-primary" />
                            <span className="fw-bold small">Search and Filter Issues</span>
                        </div>

                        <Row className="g-2">
                            <Col xs={12} md={4}>
                                <div className="admin-search-wrap">
                                    <FaSearch className="admin-search-icon" />
                                    <Form.Control
                                        className="admin-search-input"
                                        placeholder="Search title, location, reporter or ID..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </Col>

                            <Col xs={12} sm={6} md={3}>
                                <Form.Select
                                    value={departmentFilter}
                                    onChange={e => setDepartmentFilter(e.target.value)}
                                    aria-label="Filter by department"
                                >
                                    <option value="All">All Departments</option>
                                    <option value="Roads">Roads</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Public Safety">Public Safety</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} sm={6} md={3}>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    aria-label="Filter by status"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Reported">Reported</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending Verification">Pending Verification</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} md={2}>
                                <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    onClick={() => {
                                        setSearch('')
                                        setDepartmentFilter('All')
                                        setStatusFilter('All')
                                    }}
                                >
                                    <FaTimes className="me-1" />
                                    Reset
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {error && (
                        <Alert variant="danger" className="rounded-3">
                            {typeof error === 'string' ? error : 'Failed to load issues.'}
                        </Alert>
                    )}

                    {loading || staffLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-3 small">Loading dashboard...</p>
                        </div>
                    ) : (
                        <>
                            {filteredIssues.length > 0 ? (
                                <div className="admin-table-wrap">
                                    <Table hover className="admin-table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Issue Details</th>
                                                <th>Department</th>
                                                <th>Location</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Assigned Staff</th>
                                                <th>Photos & Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredIssues.map(issue => (
                                                <tr
                                                    key={issue.id}
                                                    onClick={() => navigate(`/issues/${issue.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to view issue details"
                                                >
                                                    <td>
                                                        <div className="admin-issue-title">
                                                            {issue.title || 'Untitled issue'}
                                                        </div>
                                                        <div className="admin-issue-meta">ID: {issue.id}</div>
                                                        <div className="admin-reporter">
                                                            Reported by: {issue.userName || 'Unknown'}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="admin-department">
                                                            {issue.category || 'Other'}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="admin-location">
                                                            <FaMapMarkerAlt />
                                                            <span>{issue.location || 'Not specified'}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className="admin-priority"
                                                            style={getPriorityStyle(issue.priority)}
                                                        >
                                                            {issue.priority || 'Low'}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Badge
                                                            bg={getStatusColor(issue.status)}
                                                            text={['In Progress', 'Pending Verification'].includes(issue.status) ? 'dark' : undefined}
                                                            className="admin-status"
                                                        >
                                                            {issue.status || 'Reported'}
                                                        </Badge>

                                                        {issue.status === 'Rejected' && issue.rejectionReason && (
                                                            <div className="admin-feedback text-danger mt-2">
                                                                {issue.rejectionReason}
                                                            </div>
                                                        )}

                                                        {issue.status === 'In Progress' && issue.verificationRejectionReason && (
                                                            <div className="admin-feedback text-danger mt-2">
                                                                <strong>Evidence feedback:</strong> {issue.verificationRejectionReason}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {issue.assignedStaffName ? (
                                                            <>
                                                                <div className="admin-staff-name">
                                                                    <FaUserTie className="text-primary me-1" />
                                                                    {issue.assignedStaffName}
                                                                </div>
                                                                <div className="admin-staff-dept">
                                                                    {issue.assignedDepartment || issue.category}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="admin-not-assigned">Not assigned</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="admin-action-stack">
                                                            {(issue.imageUrl || issue.afterImageUrl) ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-primary"
                                                                    className="admin-photo-btn mb-2"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        setSelectedIssue(issue)
                                                                    }}
                                                                >
                                                                    <FaImage className="me-1" />
                                                                    View Photos
                                                                </Button>
                                                            ) : (
                                                                <div className="text-muted small mb-2">No photos</div>
                                                            )}

                                                            {(issue.status || 'Reported') === 'Reported' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="w-100 mb-1"
                                                                    disabled={busyIssueId === issue.id}
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        handleAssign(issue)
                                                                    }}
                                                                >
                                                                    <FaUsers className="me-1" />
                                                                    {busyIssueId === issue.id ? 'Please wait...' : 'Assign Staff'}
                                                                </Button>
                                                            )}

                                                            {issue.status === 'Pending Verification' && (
                                                                <div className="d-flex flex-column gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="success"
                                                                        disabled={busyIssueId === issue.id}
                                                                        onClick={e => {
                                                                            e.stopPropagation()
                                                                            handleVerification(issue, true)
                                                                        }}
                                                                    >
                                                                        <FaCheck className="me-1" />
                                                                        Verify & Resolve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-danger"
                                                                        disabled={busyIssueId === issue.id}
                                                                        onClick={e => {
                                                                            e.stopPropagation()
                                                                            handleVerification(issue, false)
                                                                        }}
                                                                    >
                                                                        <FaTimes className="me-1" />
                                                                        Reject Evidence
                                                                    </Button>
                                                                </div>
                                                            )}

                                                            {!['Resolved', 'Rejected', 'Pending Verification'].includes(issue.status) && (
                                                                <Form.Select
                                                                    size="sm"
                                                                    value={issue.status || 'Reported'}
                                                                    disabled={busyIssueId === issue.id}
                                                                    onClick={e => e.stopPropagation()}
                                                                    onChange={e => handleStatusChange(issue, e.target.value)}
                                                                    aria-label={`Change status for issue ${issue.id}`}
                                                                >
                                                                    <option value="Reported">Reported</option>
                                                                    <option value="Assigned" disabled={!issue.assignedStaffId}>Assigned</option>
                                                                    <option value="In Progress" disabled={!issue.assignedStaffId}>In Progress</option>
                                                                    <option value="Resolved">Resolved (verify evidence)</option>
                                                                    <option value="Rejected">Reject Issue</option>
                                                                </Form.Select>
                                                            )}

                                                            {['Resolved', 'Rejected'].includes(issue.status) && (
                                                                <small className="text-muted">Final status</small>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="admin-empty-state">
                                    <div className="admin-empty-icon">
                                        <FaClipboardList />
                                    </div>
                                    <h6>No issues found</h6>
                                    <p className="mb-3">Try changing your search or filters.</p>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => {
                                            setSearch('')
                                            setDepartmentFilter('All')
                                            setStatusFilter('All')
                                        }}
                                    >
                                        Clear Filters
                                        <FaArrowRight className="ms-2" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            <Modal
                show={Boolean(selectedIssue)}
                onHide={() => setSelectedIssue(null)}
                size="lg"
                centered
                className="admin-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaEye className="me-2" />
                        Issue Photo Verification
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedIssue && (
                        <>
                            <div className="mb-4">
                                <h5 className="fw-bold mb-2" style={{ color: '#172554' }}>
                                    {selectedIssue.title}
                                </h5>
                                <div className="text-muted small">
                                    <FaMapMarkerAlt className="me-2" />
                                    {selectedIssue.location || 'Location not specified'}
                                </div>
                            </div>

                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <div className="admin-photo-card">
                                        <div className="admin-photo-heading">
                                            <FaImage className="me-2 text-primary" />
                                            Original Citizen Photo
                                        </div>
                                        <div className="admin-photo-content">
                                            {selectedIssue.imageUrl ? (
                                                <a
                                                    href={selectedIssue.imageUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <img
                                                        src={selectedIssue.imageUrl}
                                                        alt="Original issue reported by citizen"
                                                    />
                                                </a>
                                            ) : (
                                                <div className="admin-photo-empty">
                                                    <FaImage />
                                                    No original photo uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={12} md={6}>
                                    <div className="admin-photo-card">
                                        <div className="admin-photo-heading">
                                            <FaCheckCircle className="me-2 text-success" />
                                            Staff After-Work Photo
                                        </div>
                                        <div className="admin-photo-content">
                                            {selectedIssue.afterImageUrl ? (
                                                <a
                                                    href={selectedIssue.afterImageUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <img
                                                        src={selectedIssue.afterImageUrl}
                                                        alt="Staff after-work evidence"
                                                    />
                                                </a>
                                            ) : (
                                                <div className="admin-photo-empty">
                                                    <FaImage />
                                                    Staff evidence has not been uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {selectedIssue.submittedByStaffName && (
                                <div className="admin-evidence-note mt-3">
                                    <FaUserTie className="me-2" />
                                    Evidence submitted by <strong>{selectedIssue.submittedByStaffName}</strong>
                                    {selectedIssue.submittedForVerificationAt
                                        ? ` on ${new Date(selectedIssue.submittedForVerificationAt).toLocaleString()}`
                                        : ''}
                                </div>
                            )}

                            {selectedIssue.status === 'Pending Verification' && selectedIssue.afterImageUrl && (
                                <div className="d-flex flex-wrap gap-2 mt-4">
                                    <Button
                                        variant="success"
                                        disabled={busyIssueId === selectedIssue.id}
                                        onClick={() => handleVerification(selectedIssue, true)}
                                    >
                                        <FaCheck className="me-2" />
                                        Verify & Resolve
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        disabled={busyIssueId === selectedIssue.id}
                                        onClick={() => handleVerification(selectedIssue, false)}
                                    >
                                        <FaTimes className="me-2" />
                                        Reject Evidence
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AdminDashboard
