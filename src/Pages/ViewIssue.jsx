import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUser,
    FaCheckCircle,
    FaTools,
    FaImage,
    FaClipboardList,
    FaBuilding,
    FaFlag,
    FaHashtag,
    FaClock,
    FaShieldAlt,
    FaExclamationCircle
} from 'react-icons/fa'

import { getAllIssues } from '../Redux/slice/issueSlice'
import FeedbackForm from '../Components/FeedbackForm'

function ViewIssue() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { issues, loading, error } = useSelector(
        state => state.issueReducer
    )
    const { user } = useSelector(state => state.authReducer)

    useEffect(() => {
        if (issues.length === 0) {
            dispatch(getAllIssues())
        }
    }, [dispatch, issues.length])

    const issue = issues.find(
        item => String(item.id) === String(id)
    )

    const getStatusVariant = status => {
        switch (status) {
            case 'Reported': return 'secondary'
            case 'Assigned': return 'info'
            case 'In Progress': return 'primary'
            case 'Pending Verification': return 'warning'
            case 'Resolved': return 'success'
            case 'Rejected': return 'danger'
            default: return 'secondary'
        }
    }

    const getStatusClass = status => {
        switch (status) {
            case 'Reported': return 'status-reported'
            case 'Assigned': return 'status-assigned'
            case 'In Progress': return 'status-progress'
            case 'Pending Verification': return 'status-pending'
            case 'Resolved': return 'status-resolved'
            case 'Rejected': return 'status-rejected'
            default: return 'status-reported'
        }
    }

    const formatDate = date => {
        if (!date) return 'Not available'

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Not available'
        }

        return parsedDate.toLocaleString()
    }

    const InfoItem = ({ icon, label, value }) => (
        <div className="detail-item">
            <div className="detail-icon">{icon}</div>
            <div className="detail-content">
                <span className="detail-label">{label}</span>
                <span className="detail-value">
                    {value || 'Not specified'}
                </span>
            </div>
        </div>
    )

    if (loading && issues.length === 0) {
        return (
            <div className="view-loading">
                <div className="loading-icon">
                    <Spinner animation="border" />
                </div>
                <h5>Loading issue details</h5>
                <p>Please wait while we retrieve the information.</p>
                <style>{viewIssueStyles}</style>
            </div>
        )
    }

    if (error && issues.length === 0) {
        return (
            <div className="view-page">
                <Alert variant="danger" className="error-alert">
                    <FaExclamationCircle className="me-2" />
                    Unable to load issue details. Please try again.

                    <div className="mt-3">
                        <Button
                            variant="outline-danger"
                            onClick={() => dispatch(getAllIssues())}
                        >
                            Retry
                        </Button>
                    </div>
                </Alert>

                <style>{viewIssueStyles}</style>
            </div>
        )
    }

    if (!issue) {
        return (
            <div className="view-page">
                <div className="not-found">
                    <div className="not-found-icon">
                        <FaClipboardList />
                    </div>

                    <h3>Issue Not Found</h3>
                    <p>
                        This issue may have been deleted or is currently unavailable.
                    </p>

                    <Button
                        className="back-primary"
                        onClick={() => navigate('/issues')}
                    >
                        <FaArrowLeft className="me-2" />
                        Back to Issues
                    </Button>
                </div>

                <style>{viewIssueStyles}</style>
            </div>
        )
    }

    return (
        <div className="view-page">
            <style>{viewIssueStyles}</style>

            <div className="view-container">

                {/* Page Header */}
                <Button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="me-2" />
                    Back
                </Button>

                <div className="page-heading">
                    <div className="heading-icon">
                        <FaClipboardList />
                    </div>

                    <div>
                        <p className="eyebrow">CIVICLENS / ISSUE DETAILS</p>
                        <h2>Issue Overview</h2>
                        <p className="heading-description">
                            View issue information, track progress, and review resolution evidence.
                        </p>
                    </div>
                </div>

                {/* Main Issue Details */}
                <Card className="issue-main-card">
                    <Card.Body>
                        <div className="issue-top">
                            <div className="issue-heading-content">
                                <span className="issue-id">
                                    <FaHashtag />
                                    Issue ID: {issue.id}
                                </span>

                                <h3>{issue.title}</h3>

                                <div className="issue-meta">
                                    <span>
                                        <FaMapMarkerAlt />
                                        {issue.location || 'Location not specified'}
                                    </span>

                                    <span>
                                        <FaCalendarAlt />
                                        {formatDate(issue.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <Badge
                                bg={getStatusVariant(issue.status)}
                                className={`issue-status ${getStatusClass(issue.status)}`}
                            >
                                <span className="status-dot"></span>
                                {issue.status || 'Unknown'}
                            </Badge>
                        </div>

                        <div className="issue-divider"></div>

                        {/* Status Alerts */}
                        {issue.status === 'Resolved' && (
                            <Alert variant="success" className="status-alert">
                                <FaCheckCircle className="status-alert-icon" />
                                <div>
                                    <strong>Issue Resolved</strong>
                                    <p className="mb-0">
                                        This issue has been resolved by the assigned department.
                                    </p>
                                </div>
                            </Alert>
                        )}

                        {issue.status === 'Pending Verification' && (
                            <Alert variant="warning" className="status-alert">
                                <FaClock className="status-alert-icon" />
                                <div>
                                    <strong>Awaiting Verification</strong>
                                    <p className="mb-0">
                                        Staff has submitted work evidence. The admin is reviewing it.
                                    </p>
                                </div>
                            </Alert>
                        )}

                        {issue.status === 'Assigned' && (
                            <Alert variant="info" className="status-alert">
                                <FaUser className="status-alert-icon" />
                                <div>
                                    <strong>Issue Assigned</strong>
                                    <p className="mb-0">
                                        This issue has been assigned for further action.
                                    </p>
                                </div>
                            </Alert>
                        )}

                        {issue.status === 'In Progress' && (
                            <Alert variant="primary" className="status-alert">
                                <FaTools className="status-alert-icon" />
                                <div>
                                    <strong>Work in Progress</strong>
                                    <p className="mb-0">
                                        The assigned department is working on this issue.
                                    </p>
                                </div>
                            </Alert>
                        )}

                        {/* Issue Information */}
                        <div className="section-heading">
                            <span className="section-heading-icon">
                                <FaClipboardList />
                            </span>

                            <div>
                                <h5>Issue Information</h5>
                                <p>Details provided when the issue was reported</p>
                            </div>
                        </div>

                        <Row className="g-3">
                            <Col md={6}>
                                <InfoItem
                                    icon={<FaClipboardList />}
                                    label="Category"
                                    value={issue.category}
                                />
                            </Col>

                            <Col md={6}>
                                <InfoItem
                                    icon={<FaMapMarkerAlt />}
                                    label="Location"
                                    value={issue.location}
                                />
                            </Col>

                            <Col md={6}>
                                <InfoItem
                                    icon={<FaFlag />}
                                    label="Priority"
                                    value={issue.priority || 'Normal'}
                                />
                            </Col>

                            <Col md={6}>
                                <InfoItem
                                    icon={<FaCalendarAlt />}
                                    label="Reported On"
                                    value={formatDate(issue.createdAt)}
                                />
                            </Col>

                            <Col md={6}>
                                <InfoItem
                                    icon={<FaUser />}
                                    label="Reported By"
                                    value={issue.userName || 'Citizen'}
                                />
                            </Col>

                            {issue.assignedStaffName && (
                                <Col md={6}>
                                    <InfoItem
                                        icon={<FaTools />}
                                        label="Assigned Staff"
                                        value={issue.assignedStaffName}
                                    />
                                </Col>
                            )}

                            {issue.department && (
                                <Col md={6}>
                                    <InfoItem
                                        icon={<FaBuilding />}
                                        label="Department"
                                        value={issue.department}
                                    />
                                </Col>
                            )}
                        </Row>

                        {/* Description */}
                        <div className="description-box">
                            <div className="description-heading">
                                <FaClipboardList />
                                <h6>Issue Description</h6>
                            </div>

                            <p>
                                {issue.description || 'No description provided.'}
                            </p>
                        </div>

                        {user && String(issue.userId) === String(user.id) && (
                            <div className="citizen-note">
                                <FaShieldAlt />
                                You reported this issue. You can view its latest status and updates here.
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Issue Photos - Side by Side */}
                <Row className="g-4 mb-4">

                    {/* Original Issue Photo */}
                    <Col
                        md={
                            issue.status === 'Resolved' && issue.afterImageUrl
                                ? 6
                                : 12
                        }
                    >
                        <Card className="evidence-card h-100">
                            <Card.Body>
                                <div className="section-heading">
                                    <span className="section-heading-icon">
                                        <FaImage />
                                    </span>

                                    <div>
                                        <h5>Original Issue Photo</h5>
                                        <p>Photo submitted by the citizen</p>
                                    </div>
                                </div>

                                {issue.imageUrl ? (
                                    <a
                                        href={issue.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="image-link"
                                    >
                                        <img
                                            src={issue.imageUrl}
                                            alt="Original issue"
                                            className="side-photo"
                                        />
                                    </a>
                                ) : (
                                    <div className="no-image">
                                        <FaImage />
                                        <p>No original photo available.</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Resolved Work Photo */}
                    {issue.status === 'Resolved' && issue.afterImageUrl && (
                        <Col md={6}>
                            <Card className="evidence-card resolved-card h-100">
                                <Card.Body>
                                    <div className="section-heading">
                                        <span className="section-heading-icon resolved-icon">
                                            <FaCheckCircle />
                                        </span>

                                        <div>
                                            <h5>Resolved Work Photo</h5>
                                            <p>Evidence of completed work</p>
                                        </div>
                                    </div>

                                    <a
                                        href={issue.afterImageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="image-link"
                                    >
                                        <img
                                            src={issue.afterImageUrl}
                                            alt="Resolved issue"
                                            className="side-photo"
                                        />
                                    </a>

                                    {issue.submittedByStaffName && (
                                        <p className="photo-info">
                                            Uploaded by:{' '}
                                            <strong>{issue.submittedByStaffName}</strong>
                                        </p>
                                    )}

                                    {issue.submittedForVerificationAt && (
                                        <p className="photo-info">
                                            Submitted on:{' '}
                                            <strong>
                                                {formatDate(issue.submittedForVerificationAt)}
                                            </strong>
                                        </p>
                                    )}

                                    {issue.verifiedAt && (
                                        <p className="photo-verified">
                                            <FaCheckCircle className="me-1" />
                                            Verified on: {formatDate(issue.verifiedAt)}
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}

                </Row>

                {/* Rejection Reason */}
                {issue.status === 'Rejected' &&
                    issue.verificationRejectionReason && (
                        <Alert variant="danger" className="rejection-alert">
                            <FaExclamationCircle className="me-2" />
                            <strong>Issue Update:</strong>{' '}
                            {issue.verificationRejectionReason}
                        </Alert>
                    )}

                {/* Missing Resolution Photo */}
                {issue.status === 'Resolved' && !issue.afterImageUrl && (
                    <Alert variant="info" className="status-alert">
                        <FaImage className="status-alert-icon" />
                        <div>
                            <strong>Resolution Photo Unavailable</strong>
                            <p className="mb-0">
                                The issue is marked as resolved, but no staff work photo is available.
                            </p>
                        </div>
                    </Alert>
                )}

                {/* Feedback */}
                <div className="feedback-section">
                    <div className="section-heading">
                        <span className="section-heading-icon">
                            <FaCheckCircle />
                        </span>

                        <div>
                            <h5>Citizen Feedback</h5>
                            <p>Share your feedback about this issue</p>
                        </div>
                    </div>

                    <FeedbackForm issue={issue} />
                </div>

              
            </div>
        </div>
    )
}

const viewIssueStyles = `
    .view-page {
        min-height: 100vh;
        padding: 25px 20px 15px;
        background: #f3f6fb;
        color: #24344d;
        font-family: Arial, Helvetica, sans-serif;
    }

    .view-container {
        max-width: 1100px;
        margin: 0 auto;
    }

    .back-button {
        display: inline-flex;
        align-items: center;
        background: #fff;
        color: #243d63;
        border: 1px solid #dbe4f0;
        border-radius: 9px;
        padding: 9px 15px;
        font-weight: 600;
        margin-bottom: 23px;
        transition: all 0.2s ease;
    }

    .back-button:hover {
        background: #e9effa;
        color: #17396c;
        border-color: #b8cbe8;
        transform: translateX(-2px);
    }

    .page-heading {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 23px;
    }

    .heading-icon {
        width: 58px;
        height: 58px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 23px;
        background: linear-gradient(135deg, #17396c, #3876c9);
        border-radius: 15px;
        box-shadow: 0 6px 17px rgba(35, 78, 139, 0.17);
    }

    .eyebrow {
        color: #5278b4;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.6px;
        margin: 0 0 5px;
    }

    .page-heading h2 {
        font-size: 27px;
        color: #172d4f;
        font-weight: 800;
        margin: 0 0 5px;
    }

    .heading-description {
        color: #75849a;
        font-size: 13px;
        margin: 0;
        line-height: 1.6;
    }

    .issue-main-card,
    .evidence-card {
        border: 1px solid #e5ebf4 !important;
        border-radius: 15px !important;
        background: #fff;
        box-shadow: 0 4px 18px rgba(26, 48, 82, 0.045);
        margin-bottom: 22px;
        overflow: hidden;
    }

    .issue-main-card .card-body,
    .evidence-card .card-body {
        padding: 25px;
    }

    .issue-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
    }

    .issue-heading-content {
        min-width: 0;
    }

    .issue-id {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #5478ae;
        background: #edf3fc;
        padding: 6px 10px;
        border-radius: 7px;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 11px;
    }

    .issue-heading-content h3 {
        color: #172d4f;
        font-size: 23px;
        font-weight: 800;
        line-height: 1.4;
        margin: 0 0 12px;
        overflow-wrap: anywhere;
    }

    .issue-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 9px 20px;
        color: #78869b;
        font-size: 12px;
    }

    .issue-meta span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
    }

    .issue-meta svg {
        color: #527bb9;
        flex-shrink: 0;
    }

    .issue-status {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 11px;
        border-radius: 8px;
        font-size: 11px !important;
        white-space: normal;
        text-align: center;
        flex-shrink: 0;
    }

    .status-dot {
        width: 7px;
        height: 7px;
        background: currentColor;
        border-radius: 50%;
    }

    .status-reported {
        background: #edf0f5 !important;
        color: #526174 !important;
    }

    .status-assigned {
        background: #e1f5fb !important;
        color: #14758f !important;
    }

    .status-progress {
        background: #e7efff !important;
        color: #2459a6 !important;
    }

    .status-pending {
        background: #fff3d8 !important;
        color: #97640a !important;
    }

    .status-resolved {
        background: #def7e8 !important;
        color: #197449 !important;
    }

    .status-rejected {
        background: #ffe5e5 !important;
        color: #b42332 !important;
    }

    .issue-divider {
        height: 1px;
        background: #e9eef5;
        margin: 22px 0;
    }

    .status-alert {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border-radius: 10px;
        padding: 13px 15px;
        margin-bottom: 22px;
        border-width: 1px;
    }

    .status-alert-icon {
        flex-shrink: 0;
        font-size: 18px;
        margin-top: 2px;
    }

    .status-alert strong {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
    }

    .status-alert p {
        font-size: 12px;
        line-height: 1.6;
    }

    .section-heading {
        display: flex;
        align-items: center;
        gap: 11px;
        margin-bottom: 17px;
    }

    .section-heading-icon {
        width: 39px;
        height: 39px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2d5fa6;
        background: #eaf1fd;
        border-radius: 10px;
        font-size: 16px;
    }

    .section-heading h5 {
        color: #203657;
        font-size: 15px;
        font-weight: 800;
        margin: 0 0 4px;
    }

    .section-heading p {
        color: #8491a4;
        font-size: 11px;
        margin: 0;
        line-height: 1.5;
    }

    .detail-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        height: 100%;
        min-height: 76px;
        padding: 13px;
        background: #f8faff;
        border: 1px solid #edf1f7;
        border-radius: 11px;
        transition: border-color 0.2s ease, background 0.2s ease;
    }

    .detail-item:hover {
        background: #f1f6ff;
        border-color: #d4e2f7;
    }

    .detail-icon {
        width: 33px;
        height: 33px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4773b3;
        background: #e6eefb;
        border-radius: 8px;
        font-size: 13px;
    }

    .detail-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;
    }

    .detail-label {
        color: #8491a4;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .detail-value {
        color: #2c405e;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.6;
        overflow-wrap: anywhere;
    }

    .description-box {
        margin-top: 20px;
        padding: 18px;
        border: 1px solid #e4ebf5;
        border-radius: 12px;
        background: #fff;
    }

    .description-heading {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #4773b3;
        margin-bottom: 10px;
    }

    .description-heading h6 {
        color: #233b5d;
        font-size: 13px;
        font-weight: 800;
        margin: 0;
    }

    .description-box > p {
        color: #65758b;
        font-size: 13px;
        line-height: 1.8;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        margin: 0;
    }

    .citizen-note {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        margin-top: 17px;
        padding: 11px 13px;
        border-radius: 9px;
        background: #edf4ff;
        color: #345b91;
        font-size: 11px;
        line-height: 1.7;
    }

    .citizen-note svg {
        flex-shrink: 0;
        margin-top: 2px;
    }

    /* Photo cards */
    .evidence-card {
        margin-bottom: 0;
    }

    .evidence-card .card-body {
        display: flex;
        flex-direction: column;
    }

    .evidence-card .section-heading {
        min-height: 43px;
        margin-bottom: 14px;
    }

    .resolved-card {
        border-top: 3px solid #2ba875 !important;
    }

    .resolved-icon {
        color: #1b8c5a;
        background: #e0f7eb;
    }

    .image-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 240px;
        padding: 10px;
        border-radius: 11px;
        border: 1px solid #e7edf5;
        background: #f8faff;
        text-decoration: none;
        overflow: hidden;
    }

    .side-photo {
        display: block;
        width: 100%;
        height: 240px;
        object-fit: contain;
        border-radius: 7px;
        transition: transform 0.25s ease;
    }

    .image-link:hover .side-photo {
        transform: scale(1.02);
    }

    .no-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        min-height: 240px;
        padding: 20px;
        border: 1px dashed #cbd7e8;
        border-radius: 11px;
        background: #f8faff;
        text-align: center;
    }

    .no-image svg {
        color: #9aabc2;
        font-size: 27px;
        margin-bottom: 10px;
    }

    .no-image p {
        color: #8491a4;
        font-size: 12px;
        margin: 0;
    }

    .photo-info {
        margin: 10px 0 0;
        color: #78869b;
        font-size: 11px;
        overflow-wrap: anywhere;
        line-height: 1.6;
    }

    .photo-info strong {
        color: #354963;
    }

    .photo-verified {
        margin: 8px 0 0;
        color: #198754;
        font-size: 11px;
        line-height: 1.6;
    }

    .rejection-alert {
        border-radius: 11px;
        padding: 16px;
        line-height: 1.8;
        margin-top: 22px;
    }

    .feedback-section {
        padding: 23px;
        background: #fff;
        border: 1px solid #e5ebf4;
        border-radius: 15px;
        box-shadow: 0 4px 18px rgba(26, 48, 82, 0.045);
        margin-top: 24px;
    }

    .view-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #8a97aa;
        font-size: 11px;
        text-align: center;
        padding: 25px 10px 10px;
    }

    .view-footer svg {
        color: #527bb9;
    }

    .view-loading {
        min-height: 75vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f3f6fb;
        color: #24344d;
        padding: 25px;
        text-align: center;
    }

    .loading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: #e5efff;
        color: #3569b5;
        border-radius: 15px;
        margin-bottom: 18px;
    }

    .loading-icon .spinner-border {
        width: 26px;
        height: 26px;
    }

    .view-loading h5 {
        color: #233a5d;
        font-weight: 800;
    }

    .view-loading p {
        color: #8290a4;
        font-size: 12px;
    }

    .error-alert {
        max-width: 700px;
        margin: 30px auto;
        border-radius: 11px;
        padding: 20px;
    }

    .not-found {
        max-width: 520px;
        margin: 70px auto;
        padding: 35px 25px;
        background: #fff;
        border: 1px solid #e5ebf4;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 8px 28px rgba(26, 48, 82, 0.05);
    }

    .not-found-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 70px;
        margin: 0 auto 18px;
        border-radius: 18px;
        background: #eaf1fd;
        color: #386bb4;
        font-size: 28px;
    }

    .not-found h3 {
        color: #203657;
        font-weight: 800;
        margin-bottom: 10px;
    }

    .not-found p {
        color: #8491a4;
        font-size: 13px;
        line-height: 1.8;
        margin-bottom: 22px;
    }

    .back-primary {
        background: #234f91;
        border-color: #234f91;
        border-radius: 9px;
        padding: 10px 16px;
        font-weight: 700;
    }

    .back-primary:hover {
        background: #17396c;
        border-color: #17396c;
    }

    @media (max-width: 767px) {
        .view-page {
            padding: 18px 12px;
        }

        .page-heading {
            align-items: flex-start;
            gap: 12px;
        }

        .heading-icon {
            width: 48px;
            height: 48px;
            font-size: 19px;
            border-radius: 12px;
        }

        .page-heading h2 {
            font-size: 22px;
        }

        .heading-description {
            font-size: 12px;
        }

        .issue-main-card .card-body,
        .evidence-card .card-body {
            padding: 17px;
        }

        .issue-top {
            flex-direction: column;
            align-items: flex-start;
        }

        .issue-heading-content h3 {
            font-size: 20px;
        }

        .issue-meta {
            flex-direction: column;
            gap: 9px;
        }

        .side-photo {
            height: 220px;
        }

        .image-link,
        .no-image {
            min-height: 220px;
        }

        .feedback-section {
            padding: 17px;
        }

        .description-box {
            padding: 15px;
        }
    }

    @media (max-width: 420px) {
        .view-page {
            padding: 14px 9px;
        }

        .issue-main-card .card-body,
        .evidence-card .card-body {
            padding: 13px;
        }

        .page-heading h2 {
            font-size: 20px;
        }

        .eyebrow {
            font-size: 9px;
            letter-spacing: 1px;
        }

        .issue-heading-content h3 {
            font-size: 18px;
        }

        .detail-item {
            padding: 11px;
        }

        .side-photo {
            height: 200px;
        }

        .image-link,
        .no-image {
            min-height: 200px;
        }

        .feedback-section {
            padding: 14px;
        }
    }
`

export default ViewIssue