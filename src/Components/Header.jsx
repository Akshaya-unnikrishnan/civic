import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Navbar,
    Container,
    Nav,
    Dropdown,
    Badge,
    Button
} from 'react-bootstrap'
import { FaBell, FaSignOutAlt } from 'react-icons/fa'
import { getAllIssues } from '../Redux/slice/issueSlice'
import { logoutUser } from '../Redux/slice/authSlice'

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector(state => state.authReducer)
    const { issues } = useSelector(state => state.issueReducer)

    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch issues
    useEffect(() => {
        if (user && issues.length === 0) {
            dispatch(getAllIssues())
        }
    }, [dispatch, user, issues.length])

    // Generate notifications based on the logged-in user's role
    const notifications = useMemo(() => {
        if (!user) return []

        let relevantIssues = []

        if (user.role === 'admin') {
            relevantIssues = issues.filter(issue =>
                ['Reported', 'Pending Verification'].includes(issue.status)
            )
        } else if (user.role === 'staff') {
            relevantIssues = issues.filter(issue =>
                String(issue.assignedStaffId) === String(user.id) &&
                ['Assigned', 'In Progress', 'Pending Verification'].includes(issue.status)
            )
        } else if (user.role === 'public') {
            relevantIssues = issues.filter(issue =>
                String(issue.userId) === String(user.id) &&
                ['Assigned', 'In Progress', 'Pending Verification', 'Resolved', 'Rejected'].includes(issue.status)
            )
        }

        return relevantIssues
            .map(issue => {
                let message = ''

                if (user.role === 'admin') {
                    message = issue.status === 'Reported'
                        ? 'A new issue has been reported.'
                        : 'An issue is waiting for verification.'
                } else if (user.role === 'staff') {
                    if (issue.status === 'Assigned') {
                        message = 'A new issue has been assigned to you.'
                    } else if (issue.status === 'In Progress') {
                        message = 'An assigned issue is in progress.'
                    } else {
                        message = 'Your submitted work is waiting for verification.'
                    }
                } else {
                    if (issue.status === 'Assigned') {
                        message = 'Your issue has been assigned to staff.'
                    } else if (issue.status === 'In Progress') {
                        message = 'Work has started on your issue.'
                    } else if (issue.status === 'Pending Verification') {
                        message = 'Your issue is waiting for verification.'
                    } else if (issue.status === 'Resolved') {
                        message = 'Your issue has been resolved.'
                    } else {
                        message = 'Your issue has been rejected.'
                    }
                }

                return {
                    id: issue.id,
                    issueId: issue.id,
                    title: issue.title,
                    message,
                    status: issue.status,
                    createdAt: issue.updatedAt || issue.createdAt
                }
            })
            .sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
    }, [issues, user])

    const handleNotificationClick = (notification) => {
        setShowDropdown(false)
        navigate(`/issues/${notification.issueId}`)
    }

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate('/')
    }

    return (
        <Navbar bg="white" className="shadow-sm px-3 py-3">
            <Container fluid>
                <Navbar.Brand
                    className="fw-bold text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        if (user?.role === 'admin') navigate('/admin')
                        else if (user?.role === 'staff') navigate('/staff')
                        else navigate('/home')
                    }}
                >
                    CivicLens
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center flex-row">
                    {/* Notification bell */}
                    <Dropdown
                        show={showDropdown}
                        onToggle={setShowDropdown}
                        align="end"
                    >
                        <Dropdown.Toggle
                            variant="light"
                            id="notification-dropdown"
                            className="position-relative border-0"
                        >
                            <FaBell size={20} />

                            {notifications.length > 0 && (
                                <Badge
                                    bg="danger"
                                    pill
                                    className="position-absolute top-0 start-100 translate-middle"
                                >
                                    {notifications.length > 99
                                        ? '99+'
                                        : notifications.length}
                                </Badge>
                            )}
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            style={{
                                width: '320px',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}
                        >
                            <Dropdown.Header className="fw-bold">
                                Notifications ({notifications.length})
                            </Dropdown.Header>

                            {notifications.length === 0 ? (
                                <Dropdown.ItemText className="text-muted text-center py-3">
                                    No notifications right now
                                </Dropdown.ItemText>
                            ) : (
                                notifications.slice(0, 5).map(notification => (
                                    <Dropdown.Item
                                        key={notification.id}
                                        onClick={() =>
                                            handleNotificationClick(notification)
                                        }
                                        style={{ whiteSpace: 'normal' }}
                                    >
                                        <div className="fw-semibold">
                                            {notification.title}
                                        </div>

                                        <div className="small text-muted">
                                            {notification.message}
                                        </div>

                                        <Badge
                                            bg={
                                                notification.status === 'Resolved'
                                                    ? 'success'
                                                    : notification.status === 'Rejected'
                                                        ? 'danger'
                                                        : 'primary'
                                            }
                                            className="mt-2"
                                        >
                                            {notification.status}
                                        </Badge>
                                    </Dropdown.Item>
                                ))
                            )}

                            <Dropdown.Divider />

                            <Dropdown.Item
                                onClick={() => {
                                    setShowDropdown(false)
                                    if (user?.role === 'admin') navigate('/admin')
                                    else if (user?.role === 'staff') navigate('/staff')
                                    else navigate('/home')
                                }}
                                className="text-center text-primary"
                            >
                                Go to Dashboard
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Logged-in user */}
                    {user && (
                        <span className="d-none d-md-inline text-muted ms-3">
                            {user.name || user.username || user.email}
                        </span>
                    )}

                    {/* Logout */}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-3"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="me-1" />
                        Logout
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header