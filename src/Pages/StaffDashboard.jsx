
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
    Card, Row, Col, Table, Badge, Button,
    Spinner, Alert, Form, Modal
} from 'react-bootstrap'
import {
    FaClipboardList, FaClock, FaCheckCircle,
    FaEye, FaImage, FaUpload, FaMapMarkerAlt,
    FaSyncAlt, FaSearch, FaTimes, FaCheck,
    FaExclamationCircle
} from 'react-icons/fa'
import { getAllIssues, updateIssue } from '../Redux/slice/issueSlice'

const CLOUD_NAME = 'p5nn8oks'
const UPLOAD_PRESET = 'civicproject'

function StaffDashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { issues = [], loading, error } = useSelector(state => state.issueReducer)
    const { user } = useSelector(state => state.authReducer)

    const [selectedIssue, setSelectedIssue] = useState(null)
    const [proofImage, setProofImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    useEffect(() => {
        dispatch(getAllIssues())
    }, [dispatch])

    useEffect(() => {
        if (!proofImage) {
            setPreviewUrl('')
            return
        }

        const url = URL.createObjectURL(proofImage)
        setPreviewUrl(url)

        return () => URL.revokeObjectURL(url)
    }, [proofImage])

    const assignedIssues = issues.filter(issue =>
        String(issue.assignedStaffId) === String(user?.id)
    )

    const activeIssues = assignedIssues.filter(issue =>
        ['Assigned', 'In Progress'].includes(issue.status)
    )

    const pendingVerification = assignedIssues.filter(issue =>
        issue.status === 'Pending Verification'
    )

    const resolvedIssues = assignedIssues.filter(issue =>
        issue.status === 'Resolved'
    )

    const filteredIssues = assignedIssues.filter(issue => {
        const search = searchTerm.trim().toLowerCase()

        const matchesSearch =
            !search ||
            String(issue.title || '').toLowerCase().includes(search) ||
            String(issue.id || '').toLowerCase().includes(search) ||
            String(issue.location || '').toLowerCase().includes(search) ||
            String(issue.category || '').toLowerCase().includes(search)

        const matchesStatus =
            statusFilter === 'All' || issue.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const statusColor = {
        Reported: 'secondary',
        Assigned: 'primary',
        'In Progress': 'warning',
        'Pending Verification': 'info',
        Resolved: 'success',
        Rejected: 'danger'
    }

    const priorityClass = priority => {
        const value = String(priority || 'Low').toLowerCase()

        if (value === 'high' || value === 'critical') return 'staff-priority-high'
        if (value === 'medium') return 'staff-priority-medium'

        return 'staff-priority-low'
    }

    const openEvidenceModal = issue => {
        setSelectedIssue(issue)
        setProofImage(null)
    }

    const closeEvidenceModal = () => {
        if (uploading) return

        setSelectedIssue(null)
        setProofImage(null)
        setPreviewUrl('')
    }

    const handleStartWork = async issue => {
        if (!user || String(issue.assignedStaffId) !== String(user.id)) {
            Swal.fire('Access denied', 'You can only update issues assigned to you.', 'error')
            return
        }

        const result = await Swal.fire({
            title: 'Start work?',
            text: 'This issue will be marked as In Progress.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Start Work',
            confirmButtonColor: '#153b73'
        })

        if (!result.isConfirmed) return

        try {
            await dispatch(updateIssue({
                id: issue.id,
                issueData: { ...issue, status: 'In Progress' }
            })).unwrap()

            await dispatch(getAllIssues())

            Swal.fire('Updated!', 'The issue is now In Progress.', 'success')
        } catch {
            Swal.fire('Error', 'Unable to update the issue.', 'error')
        }
    }

    const handleSubmitEvidence = async event => {
        event.preventDefault()

        if (!selectedIssue || !proofImage) {
            Swal.fire('Photo required', 'Please upload a photo showing the completed work.', 'warning')
            return
        }

        if (!user || String(selectedIssue.assignedStaffId) !== String(user.id)) {
            Swal.fire('Access denied', 'You can only submit evidence for your assigned issues.', 'error')
            return
        }

        if (selectedIssue.status !== 'In Progress') {
            Swal.fire('Cannot submit', 'Only issues marked In Progress can be submitted for verification.', 'warning')
            return
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

        if (!allowedTypes.includes(proofImage.type)) {
            Swal.fire('Invalid image', 'Choose a JPG, PNG, or WebP image.', 'warning')
            return
        }

        if (proofImage.size > 5 * 1024 * 1024) {
            Swal.fire('Image too large', 'The image must be 5 MB or smaller.', 'warning')
            return
        }

        const result = await Swal.fire({
            title: 'Submit for verification?',
            text: 'The admin will review your after-work photo before resolving this issue.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Submit Evidence',
            confirmButtonColor: '#153b73'
        })

        if (!result.isConfirmed) return

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', proofImage)
            formData.append('upload_preset', UPLOAD_PRESET)

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            )

            const uploadData = await uploadResponse.json()

            if (!uploadResponse.ok || !uploadData.secure_url) {
                throw new Error(uploadData.error?.message || 'Image upload failed.')
            }

            await dispatch(updateIssue({
                id: selectedIssue.id,
                issueData: {
                    ...selectedIssue,
                    afterImageUrl: uploadData.secure_url,
                    status: 'Pending Verification',
                    submittedForVerificationAt: new Date().toISOString(),
                    submittedByStaffId: user.id,
                    submittedByStaffName: user.name,
                    verificationRejectionReason: ''
                }
            })).unwrap()

            await dispatch(getAllIssues())

            setSelectedIssue(null)
            setProofImage(null)
            setPreviewUrl('')

            await Swal.fire({
                title: 'Evidence Submitted!',
                text: 'The admin can now review your photo and verify the work.',
                icon: 'success'
            })
        } catch (err) {
            Swal.fire(
                'Submission failed',
                err.message || 'Unable to submit evidence. Please try again.',
                'error'
            )
        } finally {
            setUploading(false)
        }
    }

    if (!user) {
        return (
            <Alert variant="warning" className="m-3">
                Please log in to access the staff dashboard.
            </Alert>
        )
    }

    return (
        <div className="civic-staff">
            <style>{`
                .civic-staff {
                    min-height: 100vh;
                    background: #f4f7fc;
                    color: #1e293b;
                    padding: 28px;
                    font-family: Inter, "Segoe UI", Arial, sans-serif;
                }

                .staff-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 26px;
                }

                .staff-title {
                    color: #10264a;
                    font-size: 27px;
                    font-weight: 800;
                    letter-spacing: -.5px;
                    margin: 0;
                }

                .staff-subtitle {
                    color: #718096;
                    font-size: 13px;
                    margin: 7px 0 0;
                    line-height: 1.7;
                }

               

                .staff-stats {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 25px;
                }

                .staff-stat-card {
                    background: #fff;
                    border: 1px solid #e7edf5 !important;
                    border-radius: 14px !important;
                    box-shadow: 0 4px 15px rgba(20,45,85,.03);
                }

                .staff-stat-card .card-body {
                    padding: 19px;
                }

                .staff-stat-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 17px;
                }

                .staff-stat-icon {
                    width: 43px;
                    height: 43px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-size: 17px;
                }

                .staff-icon-blue { background: #eaf1ff; color: #2859a5; }
                .staff-icon-orange { background: #fff3df; color: #c77a0b; }
                .staff-icon-purple { background: #f0eaff; color: #7652c8; }
                .staff-icon-green { background: #e4f8ee; color: #198754; }

                .staff-stat-label {
                    color: #75839a;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                .staff-stat-value {
                    color: #14294c;
                    font-size: 28px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .staff-stat-note {
                    color: #98a3b3;
                    font-size: 10px;
                    margin-top: 5px;
                }

                .staff-panel {
                    border: 1px solid #e7edf5 !important;
                    border-radius: 15px !important;
                    overflow: hidden;
                    box-shadow: 0 4px 18px rgba(20,45,85,.035);
                    background: #fff;
                }

                .staff-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    padding: 20px 22px;
                    border-bottom: 1px solid #edf1f7;
                }

                .staff-panel-title {
                    color: #14294c;
                    font-size: 16px;
                    font-weight: 800;
                    margin: 0;
                }

                .staff-panel-description {
                    color: #8995a8;
                    font-size: 12px;
                    margin: 5px 0 0;
                }

                .staff-count {
                    color: #234e91;
                    background: #edf3ff;
                    border-radius: 7px;
                    padding: 7px 10px;
                    font-size: 11px;
                    font-weight: 750;
                }

                .staff-filters {
                    display: grid;
                    grid-template-columns: minmax(200px, 1fr) 190px;
                    gap: 12px;
                    padding: 16px 22px;
                    background: #fbfcfe;
                    border-bottom: 1px solid #edf1f7;
                }

                .staff-search {
                    position: relative;
                }

                .staff-search svg {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #98a5b8;
                }

                .staff-search .form-control {
                    padding-left: 36px;
                }

                .staff-filters .form-control,
                .staff-filters .form-select {
                    min-height: 39px;
                    border: 1px solid #e0e7f0;
                    border-radius: 8px;
                    font-size: 12px;
                    box-shadow: none;
                }

                .staff-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .staff-table {
                    min-width: 1000px;
                    margin-bottom: 0 !important;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .staff-table thead th {
                    background: #f8fafd;
                    color: #7b899d;
                    padding: 14px 16px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: .6px;
                    text-transform: uppercase;
                    white-space: nowrap;
                    border-bottom: 1px solid #e8edf5;
                }

                .staff-table tbody td {
                    padding: 16px;
                    vertical-align: middle;
                    font-size: 12px;
                    border-bottom: 1px solid #edf1f7;
                    background: #fff;
                }

                .staff-table tbody tr:last-child td {
                    border-bottom: 0;
                }

                .staff-table tbody tr:hover td {
                    background: #f9fbff;
                }

                .staff-issue-title {
                    color: #1b2f50;
                    font-size: 13px;
                    font-weight: 750;
                    line-height: 1.5;
                    overflow-wrap: anywhere;
                    margin-bottom: 5px;
                    min-width: 170px;
                }

                .staff-issue-id {
                    color: #94a0b1;
                    font-size: 10px;
                    margin-bottom: 5px;
                }

                .staff-reporter {
                    color: #75839a;
                    font-size: 11px;
                }

                .staff-location {
                    display: flex;
                    align-items: flex-start;
                    gap: 7px;
                    color: #526176;
                    line-height: 1.6;
                    min-width: 125px;
                    max-width: 180px;
                    overflow-wrap: anywhere;
                }

                .staff-location svg {
                    color: #94a3b8;
                    margin-top: 3px;
                    flex-shrink: 0;
                }

                .staff-priority {
                    display: inline-block;
                    padding: 5px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: capitalize;
                    white-space: nowrap;
                }

                .staff-priority-high { background: #ffebeb; color: #c63838; }
                .staff-priority-medium { background: #fff2db; color: #a96809; }
                .staff-priority-low { background: #e5f7ed; color: #208451; }

                .staff-status {
                    padding: 6px 9px !important;
                    border-radius: 6px !important;
                    font-size: 10px !important;
                    font-weight: 750 !important;
                    white-space: nowrap;
                }

                .staff-photo-btn {
                    font-size: 10px !important;
                    font-weight: 650 !important;
                    border-radius: 7px !important;
                    white-space: nowrap;
                }

                .staff-actions {
                    min-width: 155px;
                }

                .staff-actions .btn {
                    border-radius: 7px !important;
                    font-size: 10px !important;
                    font-weight: 700 !important;
                    padding: 7px 9px !important;
                    white-space: nowrap;
                }

                .staff-action-main {
                    background: #153b73 !important;
                    border-color: #153b73 !important;
                }

                .staff-empty {
                    text-align: center;
                    padding: 55px 20px !important;
                    color: #8390a4;
                }

                .staff-empty-icon {
                    font-size: 28px;
                    color: #a6b5ca;
                    margin-bottom: 13px;
                }

                .staff-empty-title {
                    color: #32445f;
                    font-size: 14px;
                    font-weight: 800;
                    margin-bottom: 6px;
                }

                .staff-empty-text {
                    font-size: 12px;
                }

                .staff-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 13px 22px;
                    background: #fbfcfe;
                    border-top: 1px solid #edf1f7;
                    color: #8995a8;
                    font-size: 11px;
                }

                .staff-modal .modal-content {
                    border: 0;
                    border-radius: 15px;
                    overflow: hidden;
                }

                .staff-modal .modal-header {
                    background: #102b54;
                    color: #fff;
                    border: 0;
                    padding: 18px 22px;
                }

                .staff-modal .modal-title {
                    font-size: 16px;
                    font-weight: 800;
                }

                .staff-modal .btn-close {
                    filter: brightness(0) invert(1);
                }

                .staff-modal-description {
                    color: #64748b;
                    font-size: 12px;
                    line-height: 1.7;
                }

                .staff-preview {
                    width: 100%;
                    max-height: 260px;
                    object-fit: contain;
                    display: block;
                    border-radius: 9px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                }

                .staff-original-photo {
                    width: 100%;
                    max-height: 210px;
                    object-fit: contain;
                    border-radius: 9px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                }

                @media (max-width: 1000px) {
                    .staff-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .civic-staff {
                        padding: 15px;
                    }

                    .staff-title {
                        font-size: 23px;
                    }

                    .staff-stats {
                        gap: 10px;
                    }

                    .staff-stat-card .card-body {
                        padding: 14px;
                    }

                    .staff-stat-value {
                        font-size: 24px;
                    }

                    .staff-stat-icon {
                        width: 37px;
                        height: 37px;
                        font-size: 14px;
                    }

                    .staff-filters {
                        grid-template-columns: 1fr;
                        padding: 14px;
                    }

                    .staff-panel-header {
                        padding: 16px;
                    }

                    .staff-footer {
                        padding: 12px 16px;
                    }
                }
            `}</style>

            <div className="staff-header">
                <div>
                    <h2 className="staff-title">Staff Dashboard</h2>
                    <p className="staff-subtitle">
                        Welcome, {user.name || 'Staff Member'}. Manage assigned issues and submit completed-work evidence.
                    </p>
                </div>

              
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {typeof error === 'string' ? error : 'Unable to load issues.'}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={() => dispatch(getAllIssues())}
                    >
                        Retry
                    </Button>
                </Alert>
            )}

            <div className="staff-stats">
                <Card className="staff-stat-card">
                    <Card.Body>
                        <div className="staff-stat-top">
                            <div className="staff-stat-icon staff-icon-blue">
                                <FaClipboardList />
                            </div>
                        </div>
                        <div className="staff-stat-label">Total Assigned</div>
                        <div className="staff-stat-value">{assignedIssues.length}</div>
                        <div className="staff-stat-note">Issues assigned to you</div>
                    </Card.Body>
                </Card>

                <Card className="staff-stat-card">
                    <Card.Body>
                        <div className="staff-stat-top">
                            <div className="staff-stat-icon staff-icon-orange">
                                <FaClock />
                            </div>
                        </div>
                        <div className="staff-stat-label">Active Tasks</div>
                        <div className="staff-stat-value">{activeIssues.length}</div>
                        <div className="staff-stat-note">Assigned or in progress</div>
                    </Card.Body>
                </Card>

                <Card className="staff-stat-card">
                    <Card.Body>
                        <div className="staff-stat-top">
                            <div className="staff-stat-icon staff-icon-purple">
                                <FaImage />
                            </div>
                        </div>
                        <div className="staff-stat-label">Awaiting Verification</div>
                        <div className="staff-stat-value">{pendingVerification.length}</div>
                        <div className="staff-stat-note">Submitted to the admin</div>
                    </Card.Body>
                </Card>

                <Card className="staff-stat-card">
                    <Card.Body>
                        <div className="staff-stat-top">
                            <div className="staff-stat-icon staff-icon-green">
                                <FaCheckCircle />
                            </div>
                        </div>
                        <div className="staff-stat-label">Resolved Issues</div>
                        <div className="staff-stat-value">{resolvedIssues.length}</div>
                        <div className="staff-stat-note">Verified completed work</div>
                    </Card.Body>
                </Card>
            </div>

            <Card className="staff-panel">
                <div className="staff-panel-header">
                    <div>
                        <h5 className="staff-panel-title">My Assigned Issues</h5>
                        <p className="staff-panel-description">
                            Track work, view issue photos, and submit evidence for verification.
                        </p>
                    </div>

                    <span className="staff-count">
                        {filteredIssues.length} ISSUE{filteredIssues.length !== 1 ? 'S' : ''}
                    </span>
                </div>

                <div className="staff-filters">
                    <div className="staff-search">
                        <FaSearch />
                        <Form.Control
                            placeholder="Search issue, ID or location..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Form.Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        aria-label="Filter issues by status"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </Form.Select>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="text-secondary mt-3 small">Loading assigned issues...</p>
                    </div>
                ) : (
                    <>
                        <div className="staff-table-wrap">
                            <Table hover className="staff-table align-middle">
                                <thead>
                                    <tr>
                                        <th>Issue Details</th>
                                        <th>Location</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Photos</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredIssues.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="staff-empty">
                                                <div className="staff-empty-icon">
                                                    <FaClipboardList />
                                                </div>
                                                <div className="staff-empty-title">
                                                    {assignedIssues.length === 0
                                                        ? 'No issues assigned yet'
                                                        : 'No matching issues'}
                                                </div>
                                                <div className="staff-empty-text">
                                                    {assignedIssues.length === 0
                                                        ? 'New issues assigned to you will appear here.'
                                                        : 'Try another search term or status filter.'}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredIssues.map(issue => (
                                            <tr key={issue.id}>
                                                <td>
                                                    <div className="staff-issue-title">
                                                        {issue.title || 'Untitled issue'}
                                                    </div>
                                                    <div className="staff-issue-id">
                                                        ID: {issue.id}
                                                    </div>
                                                    <div className="staff-reporter">
                                                        Reported by: {issue.userName || 'Citizen'}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="staff-location">
                                                        <FaMapMarkerAlt />
                                                        <span>{issue.location || 'Not specified'}</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className={`staff-priority ${priorityClass(issue.priority)}`}>
                                                        {issue.priority || 'Low'}
                                                    </span>
                                                </td>

                                                <td>
                                                    <Badge
                                                        bg={statusColor[issue.status] || 'secondary'}
                                                        text={['In Progress', 'Pending Verification'].includes(issue.status) ? 'dark' : undefined}
                                                        className="staff-status"
                                                    >
                                                        {issue.status || 'Reported'}
                                                    </Badge>

                                                    {issue.status === 'In Progress' && issue.verificationRejectionReason && (
                                                        <div className="mt-2 text-danger" style={{ fontSize: '10px', maxWidth: '170px' }}>
                                                            <strong>Admin feedback:</strong> {issue.verificationRejectionReason}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        {issue.imageUrl ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-secondary"
                                                                className="staff-photo-btn"
                                                                onClick={() => window.open(issue.imageUrl, '_blank', 'noopener,noreferrer')}
                                                            >
                                                                <FaImage className="me-1" />
                                                                Original Photo
                                                            </Button>
                                                        ) : (
                                                            <span className="text-secondary" style={{ fontSize: '10px' }}>
                                                                No original photo
                                                            </span>
                                                        )}

                                                        {issue.afterImageUrl && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-info"
                                                                className="staff-photo-btn"
                                                                onClick={() => window.open(issue.afterImageUrl, '_blank', 'noopener,noreferrer')}
                                                            >
                                                                <FaImage className="me-1" />
                                                                After Photo
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="staff-actions">
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            onClick={() => navigate(`/issues/${issue.id}`)}
                                                        >
                                                            <FaEye className="me-1" />
                                                            View Details
                                                        </Button>

                                                        {issue.status === 'Assigned' && (
                                                            <Button
                                                                size="sm"
                                                                variant="primary"
                                                                className="staff-action-main"
                                                                onClick={() => handleStartWork(issue)}
                                                            >
                                                                <FaClock className="me-1" />
                                                                Start Work
                                                            </Button>
                                                        )}

                                                        {issue.status === 'In Progress' && (
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                onClick={() => openEvidenceModal(issue)}
                                                            >
                                                                <FaUpload className="me-1" />
                                                                Upload Evidence
                                                            </Button>
                                                        )}

                                                        {issue.status === 'Pending Verification' && (
                                                            <span className="text-info small fw-semibold">
                                                                <FaClock className="me-1" />
                                                                Awaiting admin
                                                            </span>
                                                        )}

                                                        {issue.status === 'Resolved' && (
                                                            <span className="text-success small fw-semibold">
                                                                <FaCheckCircle className="me-1" />
                                                                Verified
                                                            </span>
                                                        )}

                                                        {issue.status === 'Rejected' && (
                                                            <span className="text-danger small fw-semibold">
                                                                <FaExclamationCircle className="me-1" />
                                                                Issue rejected
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        <div className="staff-footer">
                            <span>
                                Showing {filteredIssues.length} of {assignedIssues.length} assigned issues
                            </span>
                            <span>
                                <FaCheckCircle className="me-1" />
                                Work is resolved after admin verification
                            </span>
                        </div>
                    </>
                )}
            </Card>

            <Modal
                show={Boolean(selectedIssue)}
                onHide={closeEvidenceModal}
                centered
                className="staff-modal"
            >
                <Form onSubmit={handleSubmitEvidence}>
                    <Modal.Header closeButton={!uploading}>
                        <Modal.Title>Submit Work Evidence</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="p-4">
                        <div className="staff-issue-title mb-2">
                            {selectedIssue?.title}
                        </div>

                        <p className="staff-modal-description">
                            Upload a clear photo showing the completed work.
                            The admin must verify the evidence before the issue
                            is marked as resolved.
                        </p>

                        {selectedIssue?.imageUrl && (
                            <div className="mb-4">
                                <Form.Label className="fw-semibold small">
                                    Original photo submitted by citizen
                                </Form.Label>
                                <img
                                    src={selectedIssue.imageUrl}
                                    alt="Original issue reported by citizen"
                                    className="staff-original-photo d-block"
                                />
                            </div>
                        )}

                        <Form.Group>
                            <Form.Label className="fw-semibold small">
                                After-work photo <span className="text-danger">*</span>
                            </Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={event => setProofImage(event.target.files?.[0] || null)}
                                required
                                disabled={uploading}
                            />

                            <Form.Text muted>
                                Accepted formats: JPG, PNG, WebP. Maximum size: 5 MB.
                            </Form.Text>
                        </Form.Group>

                        {previewUrl && (
                            <div className="mt-4">
                                <Form.Label className="fw-semibold small">
                                    Photo Preview
                                </Form.Label>
                                <img
                                    src={previewUrl}
                                    alt="Preview of completed-work evidence"
                                    className="staff-preview"
                                />
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="outline-secondary"
                            onClick={closeEvidenceModal}
                            disabled={uploading}
                        >
                            <FaTimes className="me-1" />
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            className="staff-action-main"
                            disabled={uploading || !proofImage}
                        >
                            {uploading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FaUpload className="me-2" />
                                    Submit for Verification
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default StaffDashboard
