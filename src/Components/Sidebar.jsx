
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sidebar() {
    const { user } = useSelector(state => state.authReducer)

    const linkStyle = ({ isActive }) => ({
        display: 'block',
        padding: '16px 20px',
        marginBottom: '6px',
        borderRadius: '8px',
        color: isActive ? '#ffffff' : '#cbd5e1',
        background: isActive ? '#087f8c' : 'transparent',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: isActive ? '600' : '400'
    })

   return (
    <div style={{
        width: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#172439',
        color: 'white',
        padding: '16px',
        flexShrink: 0,
        overflowY: 'auto',
        alignSelf: 'flex-start'
    }}>
        <div style={{
            padding: '8px 0 20px',
            borderBottom: '1px solid #29364a'
        }}>
            <h2 style={{
                fontSize: '32px',
                margin: 0,
                fontWeight: '700'
            }}>
                    CivicLens
                </h2>

                <p style={{
                    color: '#9db4d4',
                    margin: '4px 0 0',
                    fontSize: '14px'
                }}>
                    Civic Issue Management
                </p>
            </div>

            <p style={{
                color: '#8da6c8',
                fontSize: '13px',
                marginTop: '24px',
                marginBottom: '12px',
                letterSpacing: '1px'
            }}>
                MAIN MENU
            </p>

            {/* Citizen Menu */}
            {user?.role === 'public' && (
                <>
                    <NavLink to="/home" style={linkStyle}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/report" style={linkStyle}>
                        Report an Issue
                    </NavLink>

                    <NavLink to="/issues" style={linkStyle}>
                        Reported Issues
                    </NavLink>
                </>
            )}

            {/* Admin Menu */}
            {user?.role === 'admin' && (
                <>
                    <NavLink to="/admin" style={linkStyle}>
                        Admin Dashboard
                    </NavLink>

                    <NavLink to="/manage-staff" style={linkStyle}>
                        Manage Staff
                    </NavLink>

                    <NavLink to="/feedback" style={linkStyle}>
                        Citizen Feedback
                    </NavLink>
                </>
            )}

            {/* Staff Menu */}
            {user?.role === 'staff' && (
                <NavLink to="/staff" style={linkStyle}>
                    Staff Dashboard
                </NavLink>
            )}
        </div>
    )
}

export default Sidebar
