import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import {
    FaArrowLeft,
    FaClipboardList,
    FaMapMarkerAlt,
    FaAlignLeft,
    FaBuilding,
    FaFlag,
    FaSave,
    FaTimes,
    FaEdit,
    FaInfoCircle,
    FaExclamationCircle
} from 'react-icons/fa'

import { getAllIssues, updateIssue } from '../Redux/slice/issueSlice'

function EditIssue() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.authReducer)
    const { issues, loading, error } = useSelector(
        state => state.issueReducer
    )

    const [issue, setIssue] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!issues.length) {
            dispatch(getAllIssues())
        }
    }, [dispatch, issues.length])

    useEffect(() => {
        if (!user || !issues.length) return

        const found = issues.find(
            item => String(item.id) === String(id)
        )

        if (!found || String(found.userId) !== String(user.id)) {
            Swal.fire(
                'Not Found',
                'You cannot edit this report.',
                'error'
            )
            navigate('/issues')
        } else if (found.status !== 'Reported') {
            Swal.fire(
                'Cannot Edit',
                'Only reports with Reported status can be edited.',
                'info'
            )
            navigate('/issues')
        } else {
            setIssue(found)
        }
    }, [id, issues, user, navigate])

    const handleChange = e => {
        setIssue({
            ...issue,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (!issue) return

        setSaving(true)

        try {
            await dispatch(
                updateIssue({ id, issueData: issue })
            ).unwrap()

            await Swal.fire(
                'Updated!',
                'Your report has been updated.',
                'success'
            )

            navigate('/issues')
        } catch (error) {
            Swal.fire(
                'Error',
                'Unable to update the report.',
                'error'
            )
        } finally {
            setSaving(false)
        }
    }

    // Loading state
    if (loading && !issue) {
        return (
            <div className="edit-loading">
                <style>{editIssueStyles}</style>

                <div className="edit-loading-icon">
                    <div className="spinner-border" role="status"></div>
                </div>

                <h5>Loading Report</h5>
                <p>Please wait while we retrieve your report details.</p>
            </div>
        )
    }

    // Error state
    if (error && !issue) {
        return (
            <div className="edit-page">
                <style>{editIssueStyles}</style>

                <div className="edit-message-card">
                    <FaExclamationCircle className="message-error-icon" />
                    <h4>Unable to Load Report</h4>
                    <p>{String(error)}</p>

                    <button
                        className="edit-back-button"
                        onClick={() => navigate('/issues')}
                    >
                        <FaArrowLeft />
                        Back to Reports
                    </button>
                </div>
            </div>
        )
    }

    if (!issue) {
        return (
            <div className="edit-loading">
                <style>{editIssueStyles}</style>

                <div className="edit-loading-icon">
                    <div className="spinner-border" role="status"></div>
                </div>

                <h5>Loading Report</h5>
                <p>Please wait while we retrieve your report details.</p>
            </div>
        )
    }

    return (
        <div className="edit-page">
            <style>{editIssueStyles}</style>

            <div className="edit-container">

                {/* Back Button */}
                <button
                    className="edit-back-button"
                    onClick={() => navigate('/issues')}
                >
                    <FaArrowLeft />
                    Back to Reports
                </button>

                {/* Page Heading */}
                <div className="edit-heading">
                    <div className="edit-heading-icon">
                        <FaEdit />
                    </div>

                    <div>
                        <p className="edit-eyebrow">
                            CIVICLENS / MY REPORTS
                        </p>
                        <h2>Edit Issue Report</h2>
                        <p className="edit-subtitle">
                            Update the details of your reported issue.
                        </p>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="edit-card">

                    <div className="edit-card-header">
                        <div>
                            <h5>
                                <FaClipboardList />
                                Report Information
                            </h5>
                            <p>
                                Make the necessary changes and save your report.
                            </p>
                        </div>

                        <span className="edit-status-badge">
                            <span></span>
                            {issue.status}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="edit-form-body">

                            {/* Issue Title */}
                            <div className="edit-form-group">
                                <label htmlFor="title">
                                    <FaClipboardList />
                                    Issue Title
                                </label>

                                <input
                                    id="title"
                                    className="edit-input"
                                    type="text"
                                    name="title"
                                    value={issue.title || ''}
                                    onChange={handleChange}
                                    placeholder="Enter a clear title for the issue"
                                    required
                                />

                                <small>
                                    Give a short and clear title describing the issue.
                                </small>
                            </div>

                            {/* Description */}
                            <div className="edit-form-group">
                                <label htmlFor="description">
                                    <FaAlignLeft />
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    className="edit-input edit-textarea"
                                    name="description"
                                    rows="4"
                                    value={issue.description || ''}
                                    onChange={handleChange}
                                    placeholder="Describe the issue in detail..."
                                    required
                                />

                                <small>
                                    Include relevant details to help the department understand the problem.
                                </small>
                            </div>

                            {/* Department and Priority */}
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="edit-form-group">
                                        <label htmlFor="category">
                                            <FaBuilding />
                                            Department / Category
                                        </label>

                                        <select
                                            id="category"
                                            className="edit-input edit-select"
                                            name="category"
                                            value={issue.category || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select department
                                            </option>
                                            <option value="Sanitation">
                                                Sanitation
                                            </option>
                                            <option value="Roads">
                                                Roads
                                            </option>
                                            <option value="Water Supply">
                                                Water Supply
                                            </option>
                                            <option value="Electricity">
                                                Electricity
                                            </option>
                                            <option value="Public Safety">
                                                Public Safety
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="edit-form-group">
                                        <label htmlFor="priority">
                                            <FaFlag />
                                            Priority
                                        </label>

                                        <select
                                            id="priority"
                                            className="edit-input edit-select"
                                            name="priority"
                                            value={issue.priority || 'Medium'}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="edit-form-group">
                                <label htmlFor="location">
                                    <FaMapMarkerAlt />
                                    Location
                                </label>

                                <input
                                    id="location"
                                    className="edit-input"
                                    type="text"
                                    name="location"
                                    value={issue.location || ''}
                                    onChange={handleChange}
                                    placeholder="Enter the location of the issue"
                                    required
                                />
                            </div>

                            {/* Information Note */}
                            <div className="edit-info-note">
                                <FaInfoCircle />
                                <p>
                                    You can edit a report only while its status is
                                    <strong> Reported</strong>. Once it is assigned
                                    to a department, editing is no longer available.
                                </p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="edit-form-footer">
                            <button
                                className="edit-cancel-button"
                                type="button"
                                onClick={() => navigate('/issues')}
                                disabled={saving}
                            >
                                <FaTimes />
                                Cancel
                            </button>

                            <button
                                className="edit-save-button"
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="edit-footer">
                    <FaInfoCircle />
                    Please verify your report details before saving.
                </div>
            </div>
        </div>
    )
}

const editIssueStyles = `
    .edit-page {
        min-height: 100vh;
        padding: 25px 20px 18px;
        background: #f3f6fb;
        color: #24344d;
        font-family: Arial, Helvetica, sans-serif;
    }

    .edit-container {
        max-width: 850px;
        margin: 0 auto;
    }

    .edit-back-button {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 9px 15px;
        margin-bottom: 23px;
        color: #243d63;
        background: #ffffff;
        border: 1px solid #dbe4f0;
        border-radius: 9px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .edit-back-button:hover {
        color: #17396c;
        background: #e9effa;
        border-color: #b8cbe8;
    }

    .edit-heading {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 25px;
    }

    .edit-heading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 58px;
        flex-shrink: 0;
        color: #ffffff;
        background: linear-gradient(135deg, #17396c, #3876c9);
        border-radius: 15px;
        font-size: 23px;
        box-shadow: 0 6px 17px rgba(35, 78, 139, 0.17);
    }

    .edit-eyebrow {
        color: #5278b4;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.6px;
        margin: 0 0 5px;
    }

    .edit-heading h2 {
        color: #172d4f;
        font-size: 27px;
        font-weight: 800;
        margin: 0 0 5px;
    }

    .edit-subtitle {
        color: #75849a;
        font-size: 13px;
        line-height: 1.6;
        margin: 0;
    }

    .edit-card {
        background: #ffffff;
        border: 1px solid #e5ebf4;
        border-radius: 16px;
        box-shadow: 0 5px 22px rgba(26, 48, 82, 0.045);
        overflow: hidden;
    }

    .edit-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        padding: 23px 26px;
        background: #ffffff;
        border-bottom: 1px solid #e9eef5;
    }

    .edit-card-header h5 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #203657;
        font-size: 16px;
        font-weight: 800;
        margin: 0 0 6px;
    }

    .edit-card-header h5 svg {
        color: #4773b3;
    }

    .edit-card-header p {
        color: #8491a4;
        font-size: 12px;
        line-height: 1.6;
        margin: 0;
    }

    .edit-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 11px;
        border-radius: 8px;
        background: #edf0f5;
        color: #526174;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
    }

    .edit-status-badge span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #64748b;
    }

    .edit-form-body {
        padding: 25px 26px;
    }

    .edit-form-group {
        margin-bottom: 21px;
    }

    .edit-form-group label {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #304563;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 9px;
    }

    .edit-form-group label svg {
        color: #527bb9;
        font-size: 13px;
    }

    .edit-input {
        display: block;
        width: 100%;
        padding: 11px 13px;
        color: #2c405e;
        background: #fbfcff;
        border: 1px solid #dce5f0;
        border-radius: 9px;
        font-family: inherit;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
    }

    .edit-input::placeholder {
        color: #a0acbd;
    }

    .edit-input:focus {
        background: #ffffff;
        border-color: #5282c6;
        box-shadow: 0 0 0 3px rgba(65, 116, 190, 0.12);
    }

    .edit-textarea {
        min-height: 110px;
        resize: vertical;
        line-height: 1.7;
    }

    .edit-select {
        min-height: 43px;
        cursor: pointer;
    }

    .edit-form-group small {
        display: block;
        color: #8a97aa;
        font-size: 11px;
        line-height: 1.6;
        margin-top: 7px;
    }

    .edit-info-note {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        padding: 13px 15px;
        margin-top: 3px;
        background: #edf4ff;
        border: 1px solid #dce9fc;
        border-radius: 10px;
        color: #345b91;
    }

    .edit-info-note > svg {
        flex-shrink: 0;
        font-size: 16px;
        margin-top: 2px;
    }

    .edit-info-note p {
        font-size: 12px;
        line-height: 1.8;
        margin: 0;
    }

    .edit-form-footer {
        display: flex;
        justify-content: flex-end;
        gap: 11px;
        padding: 17px 26px;
        background: #f8faff;
        border-top: 1px solid #e9eef5;
    }

    .edit-cancel-button,
    .edit-save-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 42px;
        padding: 10px 17px;
        border-radius: 9px;
        font-size: 12px;
        font-weight: 700;
        transition: all 0.2s ease;
    }

    .edit-cancel-button {
        color: #526174;
        background: #ffffff;
        border: 1px solid #dbe4f0;
    }

    .edit-cancel-button:hover:not(:disabled) {
        color: #243d63;
        background: #edf2f9;
    }

    .edit-save-button {
        color: #ffffff;
        background: #234f91;
        border: 1px solid #234f91;
    }

    .edit-save-button:hover:not(:disabled) {
        background: #17396c;
        border-color: #17396c;
        box-shadow: 0 4px 12px rgba(35, 79, 145, 0.17);
    }

    .edit-save-button:disabled,
    .edit-cancel-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }

    .edit-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 23px 10px 10px;
        color: #8a97aa;
        font-size: 11px;
        text-align: center;
    }

    .edit-footer svg {
        color: #527bb9;
    }

    .edit-loading {
        min-height: 75vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        background: #f3f6fb;
        color: #24344d;
        text-align: center;
    }

    .edit-loading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        margin-bottom: 18px;
        color: #3569b5;
        background: #e5efff;
        border-radius: 15px;
    }

    .edit-loading-icon .spinner-border {
        width: 26px;
        height: 26px;
        border-width: 3px;
    }

    .edit-loading h5 {
        color: #233a5d;
        font-weight: 800;
        margin-bottom: 7px;
    }

    .edit-loading p {
        color: #8290a4;
        font-size: 12px;
    }

    .edit-message-card {
        max-width: 500px;
        margin: 70px auto;
        padding: 35px 25px;
        background: #ffffff;
        border: 1px solid #e5ebf4;
        border-radius: 16px;
        box-shadow: 0 5px 22px rgba(26, 48, 82, 0.045);
        text-align: center;
    }

    .message-error-icon {
        color: #dc3545;
        font-size: 35px;
        margin-bottom: 16px;
    }

    .edit-message-card h4 {
        color: #203657;
        font-weight: 800;
    }

    .edit-message-card p {
        color: #8491a4;
        font-size: 13px;
        margin: 12px 0 20px;
    }

    @media (max-width: 600px) {
        .edit-page {
            padding: 18px 12px;
        }

        .edit-heading {
            align-items: flex-start;
            gap: 12px;
        }

        .edit-heading-icon {
            width: 47px;
            height: 47px;
            font-size: 19px;
            border-radius: 12px;
        }

        .edit-heading h2 {
            font-size: 22px;
        }

        .edit-subtitle {
            font-size: 12px;
        }

        .edit-card-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 18px;
        }

        .edit-form-body {
            padding: 20px 17px;
        }

        .edit-form-footer {
            padding: 15px 17px;
        }

        .edit-input {
            font-size: 13px;
        }

        .edit-form-footer button {
            flex: 1;
            padding: 10px 9px;
        }
    }

    @media (max-width: 380px) {
        .edit-page {
            padding: 14px 9px;
        }

        .edit-heading h2 {
            font-size: 20px;
        }

        .edit-form-body {
            padding: 16px 13px;
        }

        .edit-form-footer {
            gap: 8px;
            padding: 13px;
        }

        .edit-cancel-button,
        .edit-save-button {
            gap: 6px;
            font-size: 11px;
        }
    }
`

export default EditIssue