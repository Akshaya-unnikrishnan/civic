import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { registerUserAPI, getUsersAPI } from '../Services/allAPI'

function Register() {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'public'
    })
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        if (loading) return

        const name = user.name.trim()
        const email = user.email.trim().toLowerCase()

        if (!name) {
            Swal.fire('Invalid Name', 'Please enter your full name.', 'warning')
            return
        }

        setLoading(true)

        try {
            const response = await getUsersAPI()

            const existingUser = response.data.find(
                item => item.email?.toLowerCase() === email
            )

            if (existingUser) {
                await Swal.fire(
                    'Account Exists',
                    'This email is already registered.',
                    'warning'
                )
                return
            }

            await registerUserAPI({
                name,
                email,
                password: user.password,
                role: 'public'
            })

            await Swal.fire('Success', 'Registration completed!', 'success')
            navigate('/login')
        } catch (error) {
            Swal.fire('Error', 'Unable to register. Please try again.', 'error')
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
            padding: '35px 6%',
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
            gridTemplateColumns: '1fr 520px',
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
            marginBottom: '27px',
            fontWeight: '600'
        },

        heading: {
            fontSize: 'clamp(36px, 4vw, 55px)',
            lineHeight: '1.17',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            margin: '0 0 23px',
            color: '#ffffff'
        },

        blueText: {
            color: '#72c4ff'
        },

        accentLine: {
            width: '65px',
            height: '5px',
            backgroundColor: '#249cff',
            marginBottom: '22px',
            borderRadius: '5px'
        },

        description: {
            color: '#c2dcff',
            fontSize: '19px',
            lineHeight: '1.7',
            marginBottom: '32px'
        },

        features: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
        },

        feature: {
            width: '120px',
            textAlign: 'center',
            color: '#ffffff'
        },

        featureIcon: {
            width: '65px',
            height: '65px',
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'rgba(39, 133, 239, 0.35)',
            border: '1px solid rgba(120, 190, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '25px',
            color: '#ffffff'
        },

        featureText: {
            fontSize: '13px',
            lineHeight: '1.5',
            fontWeight: '600'
        },

        card: {
            boxSizing: 'border-box',
            width: '100%',
            padding: '36px 40px',
            borderRadius: '25px',
            background: 'rgba(4, 26, 57, 0.93)',
            border: '1px solid rgba(75, 158, 255, 0.35)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(18px)'
        },

        headingCard: {
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '34px',
            fontWeight: '750',
            letterSpacing: '-1px',
            margin: '0 0 10px'
        },

        subtitle: {
            textAlign: 'center',
            color: '#a9c7ec',
            fontSize: '15px',
            lineHeight: '1.6',
            margin: '0 0 30px'
        },

        label: {
            display: 'block',
            color: '#e1edff',
            fontSize: '14px',
            fontWeight: '650',
            marginBottom: '8px'
        },

        inputWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
            padding: '0 15px',
            marginBottom: '19px',
            border: '1px solid #426a9c',
            borderRadius: '12px',
            background: 'rgba(11, 42, 80, 0.75)'
        },

        input: {
            width: '100%',
            minWidth: 0,
            height: '51px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: '#ffffff',
            fontSize: '14px'
        },

        button: {
            width: '100%',
            minHeight: '54px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '8px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(100deg, #269cff, #0759dc)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '750',
            boxShadow: '0 8px 25px rgba(0, 105, 255, 0.23)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1
        },

        divider: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            margin: '25px 0 19px',
            color: '#7899c2',
            fontSize: '11px',
            letterSpacing: '1.5px'
        },

        dividerLine: {
            flex: 1,
            height: '1px',
            background: 'rgba(117, 160, 212, 0.25)'
        },

        loginText: {
            textAlign: 'center',
            color: '#9cb8dd',
            fontSize: '14px',
            margin: 0
        },

        loginLink: {
            color: '#55b2ff',
            fontWeight: '750',
            textDecoration: 'none',
            marginLeft: '5px'
        },

        footer: {
            marginTop: '25px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9cb8dd'
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.layout}>

                {/* Left introduction */}
                <section style={styles.left}>

                    <p style={styles.eyebrow}>
                        BE PART OF THE CHANGE
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
                        Join your community.
                        <br />
                        Report issues. Make a difference.
                    </p>

                    
                </section>

                {/* Registration card */}
                <section style={styles.card}>

                    <h2 style={styles.headingCard}>
                        Join CivicLens
                    </h2>

                    <p style={styles.subtitle}>
                        Create your public account and be part of the change.
                    </p>

                    <form onSubmit={handleRegister}>

                        <label style={styles.label}>
                            Full Name
                        </label>

                        <div style={styles.inputWrapper}>
                            <i
                                className="bi bi-person"
                                style={{ color: '#b5d5ff', fontSize: '21px' }}
                            ></i>

                            <input
                                style={styles.input}
                                type="text"
                                required
                                value={user.name}
                                onChange={e =>
                                    setUser({ ...user, name: e.target.value })
                                }
                                placeholder="Enter your full name"
                            />
                        </div>

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <div style={styles.inputWrapper}>
                            <i
                                className="bi bi-envelope"
                                style={{ color: '#b5d5ff', fontSize: '20px' }}
                            ></i>

                            <input
                                style={styles.input}
                                type="email"
                                required
                                value={user.email}
                                onChange={e =>
                                    setUser({ ...user, email: e.target.value })
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
                                style={{ color: '#b5d5ff', fontSize: '20px' }}
                            ></i>

                            <input
                                style={styles.input}
                                type="password"
                                required
                                minLength={6}
                                value={user.password}
                                onChange={e =>
                                    setUser({ ...user, password: e.target.value })
                                }
                                placeholder="Create a password"
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
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}
                        </button>

                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span>ALREADY A MEMBER?</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <p style={styles.loginText}>
                        Already have an account?
                        <Link to="/login" style={styles.loginLink}>
                            Login
                        </Link>
                    </p>

                    <p style={styles.footer}>
                        A better community starts with you.
                    </p>

                </section>

            </div>
        </div>
    )
}

export default Register