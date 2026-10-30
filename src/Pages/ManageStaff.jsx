
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table, Button, Form, Row, Col, Modal, Spinner, InputGroup, Alert } from 'react-bootstrap'
import { FaUserPlus, FaEdit, FaTrash, FaSearch, FaUsers } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { getUsersAPI } from '../Services/allAPI'
import { getAllStaff, addStaff, updateStaff, deleteStaff } from '../Redux/slice/staffSlice'

const departments = ['Roads', 'Sanitation', 'Water Supply', 'Electricity', 'Public Safety']

const emptyForm = {
    name: '',
    email: '',
    password: '',
    department: 'Roads'
}

function ManageStaff() {
    const dispatch = useDispatch()
    const { staff, loading, error } = useSelector(state => state.staffReducer)

    const [saving, setSaving] = useState(false)
    const [busyStaffId, setBusyStaffId] = useState(null)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        dispatch(getAllStaff())
    }, [dispatch])

    const openAddModal = () => {
        setEditingStaff(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEditModal = (member) => {
        setEditingStaff(member)
        setForm({
            name: member.name || '',
            email: member.email || '',
            password: '',
            department: member.department || 'Other'
        })
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        const name = form.name.trim()
        const email = form.email.trim().toLowerCase()
        const password = form.password.trim()

        if (!name || !email || (!editingStaff && !password)) {
            Swal.fire('Required Fields', 'Please fill in all required fields.', 'warning')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Swal.fire('Invalid Email', 'Please enter a valid email address.', 'warning')
            return
        }

        if (!editingStaff && password.length < 6) {
            Swal.fire('Weak Password', 'Password must contain at least 6 characters.', 'warning')
            return
        }

        if (editingStaff && password && password.length < 6) {
            Swal.fire('Weak Password', 'New password must contain at least 6 characters.', 'warning')
            return
        }

        try {
            setSaving(true)

            const usersResponse = await getUsersAPI()
            const duplicate = usersResponse.data.some(user =>
                user.email?.toLowerCase() === email &&
                String(user.id) !== String(editingStaff?.id)
            )

            if (duplicate) {
                Swal.fire('Email Already Exists', 'Please use a different email address.', 'warning')
                return
            }

            const staffData = {
                name,
                email,
                role: 'staff',
                department: form.department
            }

            if (password) {
                staffData.password = password
            }

            if (editingStaff) {
                await dispatch(updateStaff({
                    id: editingStaff.id,
                    staffData: {
                        ...editingStaff,
                        ...staffData,
                        ...(password ? { password } : {})
                    }
                })).unwrap()

                Swal.fire({
                    icon: 'success',
                    title: 'Staff Updated',
                    text: 'Staff details updated successfully.',
                    timer: 1700,
                    showConfirmButton: false
                })
            } else {
                await dispatch(addStaff({
                    ...staffData,
                    password,
                    id: `staff_${Date.now()}`
                })).unwrap()

                Swal.fire({
                    icon: 'success',
                    title: 'Staff Added',
                    text: 'New staff account created successfully.',
                    timer: 1700,
                    showConfirmButton: false
                })
            }

            setShowModal(false)
            setForm(emptyForm)
            setEditingStaff(null)
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Could not save staff details.', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (member) => {
        const result = await Swal.fire({
            title: 'Delete Staff Member?',
            text: `Delete ${member.name}'s account? Check their assigned issues before proceeding.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        })

        if (!result.isConfirmed) return

        try {
            setBusyStaffId(member.id)

            await dispatch(deleteStaff(member.id)).unwrap()

            Swal.fire('Deleted', 'Staff account deleted.', 'success')
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'Could not delete the staff account.', 'error')
        } finally {
            setBusyStaffId(null)
        }
    }

    const filteredStaff = staff.filter(member =>
        (member.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (member.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (member.department || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Manage Staff</h2>
                    <p className="text-muted mb-0">Create and manage department staff accounts.</p>
                </div>
                <Button variant="primary" onClick={openAddModal}>
                    <FaUserPlus className="me-2" />Add Staff
                </Button>
            </div>

            <Row className="g-3 mb-4">
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-primary-subtle text-primary rounded-3 p-3">
                                <FaUsers size={24} />
                            </div>
                            <div>
                                <div className="text-muted small">Total Staff</div>
                                <h3 className="fw-bold mb-0">{staff.length}</h3>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-3 p-md-4">
                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <InputGroup>
                                <InputGroup.Text><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search name, email or department..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    {error && <Alert variant="danger">{typeof error === 'string' ? error : 'Something went wrong.'}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-2">Loading staff...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaff.map(member => (
                                        <tr key={member.id}>
                                            <td className="fw-semibold">{member.name}</td>
                                            <td>{member.email}</td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary">
                                                    {member.department || 'Other'}
                                                </span>
                                            </td>
                                            <td><span className="badge bg-secondary">Staff</span></td>
                                            <td>
                                                <Button size="sm" variant="outline-primary" className="me-2 mb-1" onClick={() => openEditModal(member)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button size="sm" variant="outline-danger" className="mb-1" disabled={busyStaffId === member.id} onClick={() => handleDelete(member)}>
                                                    {busyStaffId === member.id ? <Spinner size="sm" /> : <FaTrash />}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {filteredStaff.length === 0 && (
                                <div className="text-center py-4">
                                    <FaUsers size={30} className="text-muted mb-3" />
                                    <h6>No staff members found</h6>
                                    <p className="text-muted mb-0">Try another search or add a staff member.</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => !saving && setShowModal(false)} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="staff@example.com" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{editingStaff ? 'New Password (optional)' : 'Password'}</Form.Label>
                            <Form.Control required={!editingStaff} type="password" minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editingStaff ? 'Leave blank to keep current password' : 'At least 6 characters'} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Department</Form.Label>
                            <Form.Select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                                {departments.map(department => (
                                    <option key={department} value={department}>{department}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" type="button" disabled={saving} onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : editingStaff ? 'Save Changes' : 'Create Staff'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default ManageStaff
