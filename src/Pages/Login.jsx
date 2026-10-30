import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { getUsersAPI } from '../Services/allAPI'
import { setUser } from '../Redux/slice/authSlice'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [user, setUserData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (loading) return

        setLoading(true)

        try {
            const response = await getUsersAPI()

            const loggedUser = response.data.find(item =>
                item.email?.toLowerCase() === user.email.trim().toLowerCase() &&
                item.password === user.password
            )

            if (!loggedUser) {
                await Swal.fire('Login Failed', 'Invalid email or password.', 'error')
                return
            }

            dispatch(setUser(loggedUser))

            if (loggedUser.role === 'admin') navigate('/admin')
            else if (loggedUser.role === 'staff') navigate('/staff')
            else navigate('/home')

            Swal.fire({
                title: 'Welcome!',
                text: `Welcome, ${loggedUser.name}!`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            })
        } catch (error) {
            Swal.fire('Error', 'Unable to login. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 6%',
            boxSizing: 'border-box',
            backgroundColor: '#061a38',
            backgroundImage:
                "linear-gradient(90deg, rgba(3,18,43,0.35), rgba(3,18,43,0.55)), url('/civiclens-dark-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            fontFamily: "'Segoe UI', Arial, sans-serif"
        },

        layout: {
            width: '100%',
            maxWidth: '1250px',
            display: 'grid',
            gridTemplateColumns: '1fr 540px',
            alignItems: 'center',
            gap: '55px'
        },

        left: {
            color: '#ffffff',
            padding: '20px 0'
        },

        eyebrow: {
            fontSize: '13px',
            letterSpacing: '3px',
            color: '#82b8f7',
            marginBottom: '30px',
            fontWeight: '600'
        },

        heading: {
            fontSize: 'clamp(36px, 4vw, 56px)',
            lineHeight: '1.15',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            margin: '0 0 24px',
            color: '#ffffff'
        },

        blueText: {
            color: '#72c4ff'
        },

        accentLine: {
            width: '65px',
            height: '5px',
            backgroundColor: '#249cff',
            marginBottom: '23px',
            borderRadius: '5px'
        },

        description: {
            color: '#c2dcff',
            fontSize: '20px',
            lineHeight: '1.7',
            marginBottom: '34px'
        },

        features: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        },

        feature: {
            width: '125px',
            textAlign: 'center',
            color: '#ffffff'
        },

        featureIcon: {
            width: '68px',
            height: '68px',
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'rgba(39, 133, 239, 0.35)',
            border: '1px solid rgba(120, 190, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '27px',
            color: '#ffffff'
        },

        featureText: {
            fontSize: '14px',
            lineHeight: '1.5',
            fontWeight: '600'
        },

        card: {
            boxSizing: 'border-box',
            width: '100%',
            padding: '42px 42px',
            borderRadius: '27px',
            background: 'rgba(4, 26, 57, 0.91)',
            border: '1px solid rgba(75, 158, 255, 0.35)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(18px)'
        },

        cardHeading: {
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '38px',
            fontWeight: '750',
            letterSpacing: '-1px',
            margin: '0 0 10px'
        },

        subtitle: {
            textAlign: 'center',
            color: '#a9c7ec',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 42px'
        },

        label: {
            display: 'block',
            color: '#e1edff',
            fontSize: '14px',
            fontWeight: '650',
            marginBottom: '10px'
        },

        inputWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            padding: '0 17px',
            marginBottom: '27px',
            border: '1px solid #426a9c',
            borderRadius: '14px',
            background: 'rgba(11, 42, 80, 0.75)'
        },

        input: {
            width: '100%',
            minWidth: 0,
            height: '61px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#ffffff',
            fontSize: '15px'
        },

        button: {
            width: '100%',
            minHeight: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px',
            marginTop: '7px',
            border: 'none',
            borderRadius: '15px',
            background: loading
                ? '#426eab'
                : 'linear-gradient(100deg, #269cff, #0759dc)',
            color: '#ffffff',
            fontSize: '17px',
            fontWeight: '750',
            boxShadow: '0 8px 25px rgba(0, 105, 255, 0.23)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1
        },

        divider: {
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            margin: '30px 0 25px',
            color: '#7899c2',
            fontSize: '12px',
            letterSpacing: '2px'
        },

        dividerLine: {
            flex: 1,
            height: '1px',
            background: 'rgba(117, 160, 212, 0.25)'
        },

        registerText: {
            textAlign: 'center',
            color: '#9cb8dd',
            fontSize: '15px',
            margin: '0 0 15px'
        },

        linkButton: {
            width: '100%',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            border: '1px solid #258fff',
            borderRadius: '30px',
            color: '#55b2ff',
            fontSize: '15px',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'background 0.2s ease'
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.layout}>

                {/* Left content - no logo */}
                <section style={styles.left}>

                    <p style={styles.eyebrow}>
                        FOR A BETTER TOMORROW
                    </p>

                    <h1 style={styles.heading}>
                        Cleaner
                        <br />
                        <span style={styles.blueText}>Communities.</span>
                        <br />
                        Brighter Tomorrows.
                    </h1>

                    <div style={styles.accentLine}></div>

                    <p style={styles.description}>
                        Report&nbsp; · &nbsp;Track&nbsp; · &nbsp;Resolve
                        <br />
                        for a Better City
                    </p>

                    
                </section>

                {/* Login form */}
                <section style={styles.card}>

                    <h2 style={styles.cardHeading}>
                        Welcome Back
                    </h2>

                    <p style={styles.subtitle}>
                        Sign in to continue to your account.
                    </p>

                    <form onSubmit={handleLogin}>

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <div style={styles.inputWrapper}>
                            <i
                                className="bi bi-envelope"
                                style={{ color: '#b5d5ff', fontSize: '23px' }}
                            ></i>

                            <input
                                style={styles.input}
                                type="email"
                                required
                                value={user.email}
                                onChange={e =>
                                    setUserData({
                                        ...user,
                                        email: e.target.value
                                    })
                                }
                                placeholder="Enter your email"
                            />
                        </div>

                        <label style={styles.label}>
                            Password
                        </label>

                        <div style={styles.inputWrapper}>
                            <i
                                className="bi bi-lock"
                                style={{ color: '#b5d5ff', fontSize: '23px' }}
                            ></i>

                            <input
                                style={styles.input}
                                type="password"
                                required
                                value={user.password}
                                onChange={e =>
                                    setUserData({
                                        ...user,
                                        password: e.target.value
                                    })
                                }
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            style={styles.button}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login to Account
                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>

                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span>OR</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <p style={styles.registerText}>
                        New to our platform?
                    </p>

                    <Link
                        to="/register"
                        style={styles.linkButton}
                    >
                        Create an account
                    </Link>

                </section>

            </div>
        </div>
    )
}

export default Login