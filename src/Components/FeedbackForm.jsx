
import { useEffect, useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { addFeedbackAPI, getFeedbackAPI } from '../Services/allAPI'

function FeedbackForm({ issue }) {
    const { user } = useSelector(state => state.authReducer)

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [feedbackExists, setFeedbackExists] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const isReporter =
        String(issue?.userId) === String(user?.id)

    useEffect(() => {
        let active = true

        const checkFeedback = async () => {
            if (!issue?.id || !user?.id || !isReporter) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const response = await getFeedbackAPI(issue.id)

                const existing = response.data.find(item =>
                    String(item.userId) === String(user.id)
                )

                if (active && existing) {
                    setFeedbackExists(true)
                    setRating(Number(existing.rating))
                    setComment(existing.comment || '')
                }
            } catch (err) {
                console.error('Check feedback error:', err)
                if (active) {
                    setError('Could not check existing feedback.')
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        checkFeedback()

        return () => {
            active = false
        }
    }, [issue?.id, user?.id, isReporter])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')

        if (!user || user.role !== 'public' || !isReporter) {
            setError(
                'Only the citizen who reported this issue can submit feedback.'
            )
            return
        }

        if (issue?.status !== 'Resolved') {
            setError('Feedback is available only after an issue is resolved.')
            return
        }

        if (feedbackExists) {
            setError('You have already submitted feedback for this issue.')
            return
        }

        if (rating < 1 || rating > 5) {
            setError('Please select a star rating.')
            return
        }

        if (!comment.trim()) {
            setError('Please enter a feedback comment.')
            return
        }

        try {
            setSubmitting(true)

            const feedbackData = {
                issueId: String(issue.id),
                userId: String(user.id),
                userName: user.name || user.username || user.email || 'Citizen',
                rating: Number(rating),
                comment: comment.trim(),
                createdAt: new Date().toISOString()
            }

            console.log('Submitting feedback:', feedbackData)

            const response = await addFeedbackAPI(feedbackData)

            console.log('Feedback saved successfully:', response.data)

            setFeedbackExists(true)
            setSuccess('Thank you! Your feedback has been submitted.')
        } catch (err) {
            console.error('Feedback submission error:', err)
            console.error('Error response:', err.response?.data)
            console.error('HTTP status:', err.response?.status)

            setError(
                err.response?.data?.message ||
                err.message ||
                'Unable to submit feedback. Please try again.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (!user || user.role !== 'public' || !isReporter) {
        return null
    }

    if (issue?.status !== 'Resolved') {
        return (
            <Alert variant="info" className="mt-3">
                You can submit feedback after this issue has been resolved.
            </Alert>
        )
    }

    if (loading) {
        return (
            <div className="text-center p-3">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Checking feedback...</span>
            </div>
        )
    }

    return (
        <div className="border rounded-3 p-4 mt-4 bg-white">
            <h5 className="fw-bold mb-2">Resolution Feedback</h5>

            <p className="text-muted">
                How satisfied are you with the resolution of this issue?
            </p>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success">
                    {success}
                </Alert>
            )}

            {feedbackExists && !success && (
                <Alert variant="info">
                    You have already submitted feedback for this issue.
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                        Your Rating
                    </Form.Label>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                disabled={feedbackExists}
                                aria-label={`Rate ${star} out of 5 stars`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    padding: 0,
                                    cursor: feedbackExists
                                        ? 'default'
                                        : 'pointer'
                                }}
                            >
                                <FaStar
                                    size={28}
                                    color={
                                        star <= (hoverRating || rating)
                                            ? '#f5b301'
                                            : '#d3d3d3'
                                    }
                                />
                            </button>
                        ))}

                        <span className="ms-2">
                            {rating > 0
                                ? `${rating}/5`
                                : 'Select a rating'}
                        </span>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                        Comments
                    </Form.Label>

                    <Form.Control
                        as="textarea"
                        rows={4}
                        maxLength={500}
                        placeholder="Share your experience with the resolution..."
                        value={comment}
                        disabled={feedbackExists}
                        onChange={e => setComment(e.target.value)}
                    />

                    <Form.Text className="text-muted">
                        {comment.length}/500 characters
                    </Form.Text>
                </Form.Group>

                {!feedbackExists && (
                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Submitting...'
                            : 'Submit Feedback'}
                    </Button>
                )}
            </Form>
        </div>
    )
}

export default FeedbackForm
