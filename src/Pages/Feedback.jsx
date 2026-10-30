
import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Col, Row, Spinner } from 'react-bootstrap'
import {
    FaStar,
    FaCommentDots,
    FaRegComments,
    FaCalendarAlt,
    FaUser,
    FaSyncAlt
} from 'react-icons/fa'
import { getAllFeedbackAPI } from '../Services/allAPI'

function Feedback() {
    const [feedback, setFeedback] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setError('')
                const response = await getAllFeedbackAPI()
                const data = response.data
                setFeedback(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Error loading feedback:', err)
                setError('Unable to load feedback. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchFeedback()
    }, [])

    const averageRating = feedback.length
        ? (
            feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
            feedback.length
        ).toFixed(1)
        : '0.0'

    const getRatingLabel = (rating) => {
        if (rating >= 4.5) return 'Excellent'
        if (rating >= 3.5) return 'Good'
        if (rating >= 2.5) return 'Average'
        if (rating >= 1.5) return 'Below Average'
        return 'Poor'
    }

    if (loading) {
        return (
            <div className="feedback-loading">
                <Spinner animation="border" />
                <p>Loading citizen feedback...</p>
            </div>
        )
    }

    return (
        <div className="civic-feedback">
            <style>{`
                .civic-feedback {
                    min-height: 100vh;
                    background: #f4f7fc;
                    padding: 28px;
                    color: #1e293b;
                    font-family: Inter, "Segoe UI", Arial, sans-serif;
                }

                .feedback-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-bottom: 25px;
                }

                .feedback-title {
                    color: #10264a;
                    font-size: 27px;
                    font-weight: 800;
                    letter-spacing: -.5px;
                    margin: 0;
                }

                .feedback-subtitle {
                    color: #718096;
                    font-size: 13px;
                    margin: 7px 0 0;
                    line-height: 1.6;
                }

                .feedback-section-label {
                    color: #7c8ba1;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }

                .feedback-summary {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    margin-bottom: 30px;
                }

                .feedback-summary-card {
                    border: 1px solid #e7edf5 !important;
                    border-radius: 14px !important;
                    background: #fff;
                    box-shadow: 0 4px 15px rgba(20, 45, 85, .035);
                }

                .feedback-summary-card .card-body {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .feedback-summary-icon {
                    height: 48px;
                    width: 48px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    font-size: 19px;
                }

                .feedback-icon-blue {
                    color: #2859a5;
                    background: #eaf1ff;
                }

                .feedback-icon-yellow {
                    color: #c18a0b;
                    background: #fff5d9;
                }

                .feedback-icon-green {
                    color: #198754;
                    background: #e4f8ee;
                }

                .feedback-summary-label {
                    color: #75839a;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                .feedback-summary-value {
                    color: #14294c;
                    font-size: 27px;
                    font-weight: 800;
                    line-height: 1.2;
                }

                .feedback-summary-note {
                    color: #96a1b2;
                    font-size: 10px;
                    margin-top: 4px;
                }

                .feedback-section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 15px;
                }

                .feedback-section-title {
                    color: #14294c;
                    font-size: 17px;
                    font-weight: 800;
                    margin: 0;
                }

                .feedback-count {
                    background: #edf3ff;
                    color: #234e91;
                    padding: 6px 10px;
                    border-radius: 7px;
                    font-size: 11px;
                    font-weight: 700;
                }

                .feedback-grid {
                    row-gap: 18px;
                }

                .feedback-card {
                    height: 100%;
                    border: 1px solid #e6edf5 !important;
                    border-radius: 13px !important;
                    background: #fff;
                    box-shadow: 0 4px 14px rgba(20, 45, 85, .025);
                    transition: transform .2s ease, box-shadow .2s ease;
                }

                .feedback-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 22px rgba(20, 45, 85, .07);
                }

                .feedback-card .card-body {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .feedback-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 17px;
                }

                .feedback-issue-label {
                    color: #8995a8;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .5px;
                    margin-bottom: 5px;
                }

                .feedback-issue-id {
                    color: #19365f;
                    font-size: 15px;
                    font-weight: 800;
                    overflow-wrap: anywhere;
                }

                .feedback-rating-badge {
                    color: #986a00 !important;
                    background: #fff4d5 !important;
                    border-radius: 7px !important;
                    padding: 7px 9px !important;
                    font-size: 11px !important;
                    white-space: nowrap;
                }

                .feedback-stars {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-bottom: 9px;
                }

                .feedback-star {
                    font-size: 15px;
                }

                .feedback-rating-text {
                    color: #9a7a27;
                    font-size: 11px;
                    font-weight: 700;
                    margin-left: 5px;
                }

                .feedback-comment {
                    color: #475569;
                    font-size: 13px;
                    line-height: 1.8;
                    white-space: pre-wrap;
                    overflow-wrap: anywhere;
                    margin: 0 0 18px;
                    flex-grow: 1;
                }

                .feedback-no-comment {
                    color: #a0a9b8;
                    font-size: 12px;
                    font-style: italic;
                }

                .feedback-divider {
                    border: 0;
                    border-top: 1px solid #edf1f7;
                    margin: 0 0 14px;
                    opacity: 1;
                }

                .feedback-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .feedback-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #7b899d;
                    font-size: 11px;
                    overflow-wrap: anywhere;
                }

                .feedback-meta-item svg {
                    color: #96a6bc;
                    flex-shrink: 0;
                }

                .feedback-empty {
                    background: #fff;
                    border: 1px dashed #d8e2ef;
                    border-radius: 14px;
                    text-align: center;
                    padding: 55px 20px;
                }

                .feedback-empty-icon {
                    width: 58px;
                    height: 58px;
                    margin: 0 auto 15px;
                    border-radius: 16px;
                    background: #edf3ff;
                    color: #426ba6;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 23px;
                }

                .feedback-empty-title {
                    color: #243a59;
                    font-size: 16px;
                    font-weight: 800;
                    margin-bottom: 7px;
                }

                .feedback-empty-text {
                    color: #8794a7;
                    font-size: 12px;
                    line-height: 1.7;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .feedback-loading {
                    min-height: 65vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    color: #31588f;
                    background: #f4f7fc;
                }

                .feedback-loading p {
                    margin: 0;
                    font-size: 13px;
                    color: #718096;
                }

                @media (max-width: 850px) {
                    .feedback-summary {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .civic-feedback {
                        padding: 16px;
                    }

                    .feedback-title {
                        font-size: 23px;
                    }

                    .feedback-summary {
                        grid-template-columns: 1fr;
                        gap: 11px;
                    }

                    .feedback-summary-card .card-body {
                        padding: 16px;
                    }

                    .feedback-card .card-body {
                        padding: 17px;
                    }
                }
            `}</style>

            <div className="feedback-header">
                <div>
                    <h3 className="feedback-title">Citizen Feedback</h3>
                    <p className="feedback-subtitle">
                        Review citizen ratings and comments about resolved public issues.
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <div className="feedback-section-label">Feedback Overview</div>

            <div className="feedback-summary">
                <Card className="feedback-summary-card">
                    <Card.Body>
                        <div className="feedback-summary-icon feedback-icon-blue">
                            <FaRegComments />
                        </div>
                        <div>
                            <div className="feedback-summary-label">
                                Total Feedback
                            </div>
                            <div className="feedback-summary-value">
                                {feedback.length}
                            </div>
                            <div className="feedback-summary-note">
                                Citizen responses received
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="feedback-summary-card">
                    <Card.Body>
                        <div className="feedback-summary-icon feedback-icon-yellow">
                            <FaStar />
                        </div>
                        <div>
                            <div className="feedback-summary-label">
                                Average Rating
                            </div>
                            <div className="feedback-summary-value">
                                {averageRating}
                                <span style={{ fontSize: 14, color: '#9aa5b5' }}>
                                    {' '}/ 5
                                </span>
                            </div>
                            <div className="feedback-summary-note">
                                Based on submitted ratings
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="feedback-summary-card">
                    <Card.Body>
                        <div className="feedback-summary-icon feedback-icon-green">
                            <FaCommentDots />
                        </div>
                        <div>
                            <div className="feedback-summary-label">
                                Positive Ratings
                            </div>
                            <div className="feedback-summary-value">
                                {feedback.filter(
                                    (item) => Number(item.rating) >= 4
                                ).length}
                            </div>
                            <div className="feedback-summary-note">
                                Ratings of 4 stars or higher
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className="feedback-section-header">
                <div>
                    <h5 className="feedback-section-title">
                        Recent Feedback
                    </h5>
                    <p className="feedback-subtitle">
                        Citizen reviews and issue satisfaction ratings.
                    </p>
                </div>

                <span className="feedback-count">
                    {feedback.length} RESPONSE{feedback.length !== 1 ? 'S' : ''}
                </span>
            </div>

            {feedback.length === 0 ? (
                <div className="feedback-empty">
                    <div className="feedback-empty-icon">
                        <FaRegComments />
                    </div>
                    <div className="feedback-empty-title">
                        No feedback yet
                    </div>
                    <p className="feedback-empty-text">
                        Citizen ratings and comments will appear here after
                        feedback has been submitted for resolved issues.
                    </p>
                </div>
            ) : (
                <Row className="feedback-grid">
                    {feedback.map((item) => {
                        const rating = Math.min(
                            5,
                            Math.max(0, Number(item.rating) || 0)
                        )

                        return (
                            <Col md={6} xl={4} key={item.id}>
                                <Card className="feedback-card">
                                    <Card.Body>
                                        <div className="feedback-card-top">
                                            <div>
                                                <div className="feedback-issue-label">
                                                    Issue Reference
                                                </div>
                                                <div className="feedback-issue-id">
                                                    #{item.issueId || item.id}
                                                </div>
                                            </div>

                                            <Badge className="feedback-rating-badge">
                                                <FaStar className="me-1" />
                                                {rating}/5
                                            </Badge>
                                        </div>

                                        <div className="feedback-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className="feedback-star"
                                                    color={
                                                        star <= rating
                                                            ? '#f5b301'
                                                            : '#e1e6ee'
                                                    }
                                                />
                                            ))}

                                            <span className="feedback-rating-text">
                                                {getRatingLabel(rating)}
                                            </span>
                                        </div>

                                        <p className="feedback-comment">
                                            {item.comment?.trim() ? (
                                                item.comment
                                            ) : (
                                                <span className="feedback-no-comment">
                                                    No written comment provided.
                                                </span>
                                            )}
                                        </p>

                                        <hr className="feedback-divider" />

                                        <div className="feedback-meta">
                                            <div className="feedback-meta-item">
                                                <FaUser />
                                                <span>
                                                    {item.userName || 'Citizen'}
                                                </span>
                                            </div>

                                            <div className="feedback-meta-item">
                                                <FaCalendarAlt />
                                                <span>
                                                    {item.createdAt
                                                        ? new Date(
                                                            item.createdAt
                                                        ).toLocaleDateString()
                                                        : 'Date unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            )}
        </div>
    )
}

export default Feedback
