
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
    FiFileText,
    FiMapPin,
    FiTag,
    FiAlertCircle,
    FiUpload,
    FiImage,
    FiX,
    FiSend,
    FiArrowLeft,
    FiCheckCircle
} from 'react-icons/fi'
import { addIssue } from '../Redux/slice/issueSlice'

const CLOUD_NAME = 'p5nn8oks'
const UPLOAD_PRESET = 'civicproject'

async function uploadImage(image) {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', UPLOAD_PRESET)

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        formData
    )

    return response.data.secure_url
}

function ReportIssue() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.authReducer)

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('')
    const [uploading, setUploading] = useState(false)
    const [issue, setIssue] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        priority: 'Medium'
    })

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (
            !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            file.size > 5 * 1024 * 1024
        ) {
            Swal.fire(
                'Invalid Image',
                'Choose a JPG, PNG or WebP image under 5 MB.',
                'warning'
            )
            e.target.value = ''
            return
        }

        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImage(null)
        setPreview('')

        const fileInput = document.getElementById('issueImage')
        if (fileInput) fileInput.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            Swal.fire(
                'Login Required',
                'Please log in before reporting an issue.',
                'warning'
            )
            navigate('/login')
            return
        }

        setUploading(true)

        try {
            const imageUrl = image ? await uploadImage(image) : ''

            const newIssue = {
                ...issue,
                title: issue.title.trim(),
                description: issue.description.trim(),
                location: issue.location.trim(),
                imageUrl,
                userId: user.id,
                userName: user.name,
                status: 'Reported',
                createdAt: new Date().toISOString()
            }

            await dispatch(addIssue(newIssue)).unwrap()

            await Swal.fire(
                'Success',
                'Your issue has been reported!',
                'success'
            )

            navigate('/issues')
        } catch (error) {
            Swal.fire(
                'Error',
                'Unable to submit. Check your connection and Cloudinary settings, then try again.',
                'error'
            )
        } finally {
            setUploading(false)
        }
    }

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.topBar}>
                <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate('/home')}
                >
                    <FiArrowLeft />
                    Back to Home
                </button>

                <div style={styles.pageBadge}>
                    <FiFileText />
                    CIVICLENS / REPORT ISSUE
                </div>
            </div>

            {/* Hero */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroLabel}>
                        <FiAlertCircle />
                        MAKE YOUR VOICE HEARD
                    </div>

                    <h1 style={styles.heroTitle}>
                        Report a Civic Issue
                    </h1>

                    <p style={styles.heroText}>
                        Help make your community better. Share the details
                        of a public issue so the appropriate department
                        can take action.
                    </p>
                </div>

                <div style={styles.heroIcon}>
                    <FiFileText />
                </div>

                <div style={styles.heroCircle}></div>
            </div>

            {/* Form Layout */}
            <div style={styles.formLayout}>
                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <div style={styles.formHeaderIcon}>
                            <FiFileText />
                        </div>

                        <div>
                            <h2 style={styles.formTitle}>
                                Issue Details
                            </h2>
                            <p style={styles.formSubtitle}>
                                Fill in the information below
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Issue Title <span style={styles.required}>*</span>
                            </label>

                            <div style={styles.inputWrapper}>
                                <FiFileText style={styles.inputIcon} />

                                <input
                                    style={styles.input}
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={issue.title}
                                    onChange={e =>
                                        setIssue({
                                            ...issue,
                                            title: e.target.value
                                        })
                                    }
                                    placeholder="e.g. Broken streetlight"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Description <span style={styles.required}>*</span>
                            </label>

                            <textarea
                                style={styles.textarea}
                                required
                                rows={4}
                                value={issue.description}
                                onChange={e =>
                                    setIssue({
                                        ...issue,
                                        description: e.target.value
                                    })
                                }
                                placeholder="Describe the issue, its impact and any useful details..."
                            />
                        </div>

                        {/* Category */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Department Category <span style={styles.required}>*</span>
                            </label>

                            <div style={styles.inputWrapper}>
                                <FiTag style={styles.inputIcon} />

                                <select
                                    style={styles.select}
                                    required
                                    value={issue.category}
                                    onChange={e =>
                                        setIssue({
                                            ...issue,
                                            category: e.target.value
                                        })
                                    }
                                >
                                    <option value="">Select department</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Roads">Roads</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Public Safety">Public Safety</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Location <span style={styles.required}>*</span>
                            </label>

                            <div style={styles.inputWrapper}>
                                <FiMapPin style={styles.inputIcon} />

                                <input
                                    style={styles.input}
                                    type="text"
                                    required
                                    value={issue.location}
                                    onChange={e =>
                                        setIssue({
                                            ...issue,
                                            location: e.target.value
                                        })
                                    }
                                    placeholder="Street, area or landmark"
                                />
                            </div>
                        </div>

                        {/* Priority */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Priority Level
                            </label>

                            <div style={styles.priorityOptions}>
                                {['Low', 'Medium', 'High'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        style={{
                                            ...styles.priorityButton,
                                            ...(issue.priority === level
                                                ? styles[`priority${level}`]
                                                : {})
                                        }}
                                        onClick={() =>
                                            setIssue({
                                                ...issue,
                                                priority: level
                                            })
                                        }
                                    >
                                        <span
                                            style={{
                                                ...styles.priorityDot,
                                                background:
                                                    level === 'Low'
                                                        ? '#10b981'
                                                        : level === 'Medium'
                                                        ? '#f59e0b'
                                                        : '#ef4444'
                                            }}
                                        ></span>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Issue Photo <span style={styles.optional}>(Optional)</span>
                            </label>

                            <label htmlFor="issueImage" style={styles.uploadArea}>
                                <div style={styles.uploadIcon}>
                                    <FiUpload />
                                </div>

                                <div>
                                    <p style={styles.uploadTitle}>
                                        Click to upload an image
                                    </p>
                                    <p style={styles.uploadText}>
                                        JPG, PNG or WebP · Maximum 5 MB
                                    </p>
                                </div>
                            </label>

                            <input
                                id="issueImage"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImage}
                                style={{ display: 'none' }}
                            />

                            {preview && (
                                <div style={styles.previewCard}>
                                    <img
                                        src={preview}
                                        alt="Issue preview"
                                        style={styles.previewImage}
                                    />

                                    <div style={styles.previewInfo}>
                                        <div style={styles.previewFileIcon}>
                                            <FiImage />
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={styles.previewTitle}>
                                                Image attached
                                            </p>
                                            <p style={styles.previewText}>
                                                Ready to upload
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            style={styles.removeButton}
                                            onClick={removeImage}
                                            aria-label="Remove photo"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div style={styles.formActions}>
                            <button
                                type="button"
                                style={styles.cancelButton}
                                disabled={uploading}
                                onClick={() => navigate('/home')}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    opacity: uploading ? 0.7 : 1
                                }}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <span style={styles.spinner}></span>
                                        Uploading & Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FiSend />
                                        Submit Report
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Information Panel */}
                <div style={styles.sidePanel}>
                    <div style={styles.sideIcon}>
                        <FiCheckCircle />
                    </div>

                    <h3 style={styles.sideTitle}>
                        How it works
                    </h3>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>1</div>
                        <div>
                            <h4 style={styles.stepTitle}>Report an issue</h4>
                            <p style={styles.stepText}>
                                Describe the problem and provide its location.
                            </p>
                        </div>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>2</div>
                        <div>
                            <h4 style={styles.stepTitle}>Department assignment</h4>
                            <p style={styles.stepText}>
                                An administrator reviews the report and assigns it
                                to the relevant department.
                            </p>
                        </div>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepNumber}>3</div>
                        <div>
                            <h4 style={styles.stepTitle}>Track progress</h4>
                            <p style={styles.stepText}>
                                Follow the status of your issue as the team works
                                towards a resolution.
                            </p>
                        </div>
                    </div>

                    <div style={styles.tipBox}>
                        <FiAlertCircle style={{ flexShrink: 0 }} />
                        <p>
                            <strong>Tip:</strong> Include a clear description
                            and the correct location to help the department
                            respond efficiently.
                        </p>
                    </div>
                </div>
            </div>

            <p style={styles.footerText}>
                CivicLens · Together for better communities
            </p>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        padding: '30px',
        background: '#f4f7fc',
        fontFamily: 'Arial, sans-serif',
        color: '#172554'
    },

    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '22px'
    },

    backButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        border: '1px solid #dbe4f0',
        borderRadius: '9px',
        background: '#ffffff',
        color: '#334155',
        fontSize: '13px',
        cursor: 'pointer'
    },

    pageBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#64748b',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px'
    },

    hero: {
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        padding: '38px',
        minHeight: '225px',
        borderRadius: '22px',
        background: 'linear-gradient(120deg, #0f172a, #1e3a8a, #2563eb)',
        color: '#ffffff',
        boxShadow: '0 15px 35px rgba(30,58,138,0.16)',
        marginBottom: '28px'
    },

    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '650px'
    },

    heroLabel: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '25px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.18)',
        fontSize: '10px',
        letterSpacing: '1px',
        marginBottom: '16px'
    },

    heroTitle: {
        fontSize: 'clamp(25px, 4vw, 35px)',
        fontWeight: '700',
        margin: '0 0 12px'
    },

    heroText: {
        maxWidth: '600px',
        color: '#dbeafe',
        fontSize: '14px',
        lineHeight: '1.8',
        margin: 0
    },

    heroIcon: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '90px',
        height: '90px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#bfdbfe',
        fontSize: '43px'
    },

    heroCircle: {
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        border: '40px solid rgba(255,255,255,0.05)',
        right: '-100px',
        bottom: '-190px'
    },

    formLayout: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.7fr) minmax(230px, 0.8fr)',
        alignItems: 'start',
        gap: '25px'
    },

    formCard: {
        minWidth: 0,
        padding: '30px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #e5eaf3',
        boxShadow: '0 8px 25px rgba(15,23,42,0.04)'
    },

    formHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        paddingBottom: '23px',
        marginBottom: '25px',
        borderBottom: '1px solid #edf1f7'
    },

    formHeaderIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: '#eff6ff',
        color: '#2563eb',
        fontSize: '23px'
    },

    formTitle: {
        fontSize: '21px',
        fontWeight: '700',
        margin: '0 0 6px'
    },

    formSubtitle: {
        color: '#64748b',
        fontSize: '13px',
        margin: 0
    },

    field: {
        marginBottom: '22px'
    },

    label: {
        display: 'block',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '9px'
    },

    required: {
        color: '#ef4444'
    },

    optional: {
        color: '#94a3b8',
        fontWeight: '400'
    },

    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '11px',
        minHeight: '47px',
        padding: '0 13px',
        border: '1px solid #dce4ef',
        borderRadius: '10px',
        background: '#ffffff'
    },

    inputIcon: {
        color: '#64748b',
        fontSize: '17px',
        flexShrink: 0
    },

    input: {
        width: '100%',
        minWidth: 0,
        padding: '12px 0',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: '#172554',
        fontSize: '13px'
    },

    select: {
        width: '100%',
        minWidth: 0,
        padding: '12px 0',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: '#334155',
        fontSize: '13px',
        cursor: 'pointer'
    },

    textarea: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '13px',
        border: '1px solid #dce4ef',
        borderRadius: '10px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        lineHeight: '1.7',
        color: '#172554'
    },

    priorityOptions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
    },

    priorityButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 15px',
        border: '1px solid #e2e8f0',
        borderRadius: '9px',
        background: '#ffffff',
        color: '#475569',
        fontSize: '13px',
        cursor: 'pointer'
    },

    priorityLow: {
        border: '1px solid #6ee7b7',
        background: '#ecfdf5',
        color: '#047857'
    },

    priorityMedium: {
        border: '1px solid #fcd34d',
        background: '#fffbeb',
        color: '#b45309'
    },

    priorityHigh: {
        border: '1px solid #fca5a5',
        background: '#fef2f2',
        color: '#b91c1c'
    },

    priorityDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%'
    },

    uploadArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '22px',
        border: '1px dashed #93b4eb',
        borderRadius: '12px',
        background: '#f8fbff',
        cursor: 'pointer'
    },

    uploadIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        background: '#dbeafe',
        color: '#2563eb',
        fontSize: '21px',
        flexShrink: 0
    },

    uploadTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#1e40af',
        margin: '0 0 6px'
    },

    uploadText: {
        fontSize: '11px',
        color: '#64748b',
        margin: 0
    },

    previewCard: {
        overflow: 'hidden',
        marginTop: '15px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        background: '#ffffff'
    },

    previewImage: {
        display: 'block',
        width: '100%',
        maxHeight: '240px',
        objectFit: 'cover'
    },

    previewInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px'
    },

    previewFileIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: '#eff6ff',
        color: '#2563eb',
        fontSize: '19px'
    },

    previewTitle: {
        fontSize: '12px',
        fontWeight: '700',
        margin: '0 0 5px'
    },

    previewText: {
        fontSize: '11px',
        color: '#64748b',
        margin: 0
    },

    removeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        border: '1px solid #fecaca',
        borderRadius: '9px',
        background: '#fef2f2',
        color: '#dc2626',
        fontSize: '17px',
        cursor: 'pointer'
    },

    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        flexWrap: 'wrap',
        paddingTop: '22px',
        borderTop: '1px solid #edf1f7'
    },

    cancelButton: {
        padding: '12px 19px',
        border: '1px solid #dbe4f0',
        borderRadius: '10px',
        background: '#ffffff',
        color: '#475569',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },

    submitButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '10px',
        background: 'linear-gradient(120deg, #1d4ed8, #2563eb)',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer'
    },

    spinner: {
        width: '15px',
        height: '15px',
        border: '2px solid rgba(255,255,255,0.4)',
        borderTopColor: '#ffffff',
        borderRadius: '50%',
        display: 'inline-block'
    },

    sidePanel: {
        padding: '25px',
        border: '1px solid #e5eaf3',
        borderRadius: '18px',
        background: '#ffffff',
        boxShadow: '0 8px 25px rgba(15,23,42,0.04)'
    },

    sideIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45px',
        height: '45px',
        borderRadius: '13px',
        background: '#ecfdf5',
        color: '#059669',
        fontSize: '23px',
        marginBottom: '17px'
    },

    sideTitle: {
        color: '#172554',
        fontSize: '19px',
        fontWeight: '700',
        margin: '0 0 25px'
    },

    step: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '23px'
    },

    stepNumber: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '30px',
        height: '30px',
        borderRadius: '50%',
        background: '#eff6ff',
        color: '#2563eb',
        fontSize: '12px',
        fontWeight: '700'
    },

    stepTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#334155',
        margin: '2px 0 7px'
    },

    stepText: {
        fontSize: '12px',
        color: '#64748b',
        lineHeight: '1.7',
        margin: 0
    },

    tipBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '14px',
        borderRadius: '11px',
        background: '#eff6ff',
        color: '#2563eb',
        fontSize: '17px',
        marginTop: '5px'
    },

    footerText: {
        textAlign: 'center',
        fontSize: '11px',
        color: '#94a3b8',
        margin: '28px 0 0'
    }
}

export default ReportIssue
