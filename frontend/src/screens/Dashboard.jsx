import { useFetchUsersQuery } from "../slices/adminApiSlice"; 
import Loader from "../components/Loader"; 
import { Table, Button, Form, Modal } from "react-bootstrap"; 
import AdminHeader from '../components/AdminHeder';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
    const { data: users, error, isLoading, refetch } = useFetchUsersQuery();  
    const { adminInfo } = useSelector((state) => state.adminAuth);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [showAddUserModal, setShowAddUserModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);  
    const [editUserData, setEditUserData] = useState({});
    const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', confirmPassword: '' }); 

    useEffect(() => {
        if (!adminInfo) {
            navigate('/admin/login'); 
        }
    }, [navigate, adminInfo]);

    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (user) => {
        setEditUserData(user);
        setShowEditModal(true); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserData({ ...editUserData, [name]: value });
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`/api/admin/user/${editUserData._id}`, editUserData, {
                headers: { Authorization: `Bearer ${adminInfo.token}` },
            });
            setShowEditModal(false);  
            refetch();  
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleAddNewUser = async () => {
        const { name, email, password, confirmPassword } = newUserData;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.post('/api/admin/add-new-user', { name, email, password }, {
                headers: { Authorization: `Bearer ${adminInfo.token}` },
            });
            setShowAddUserModal(false);  
            setNewUserData({ name: '', email: '', password: '', confirmPassword: '' });  
            refetch();  
        } catch (error) {
            console.error('Error adding new user:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`/api/admin/user/${userId}`, {
                    headers: { Authorization: `Bearer ${adminInfo.token}` },
                });
                refetch();  
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error fetching users: {error.message}</div>;

    return (
        <div>
            <AdminHeader />
            <h1 className="mt-4 d-flex justify-content-center">User Dashboard</h1>

            {/* Search Bar */}
            <Form className="d-flex justify-content-center mt-4">
                <Form.Control
                    type="text"
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ width: '300px' }}
                />
            </Form>

            {/* Button to Add New User */}
            <Button variant="primary" onClick={() => setShowAddUserModal(true)} className="mb-3">
                Add New User
            </Button>

            {/* Users Table */}
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr className="table-primary">
                        <th>NO</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleEdit(user)}  
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Editing User */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editUserData.name || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editUserData.email || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Adding New User */}
            <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newUserData.name}
                                placeholder="Enter Name"
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                 placeholder="Enter Email"
                                value={newUserData.email}
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                 placeholder="Enter Password"
                                value={newUserData.password}
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={newUserData.confirmPassword}
                                 placeholder="Confirm Password"
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddNewUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Dashboard;
