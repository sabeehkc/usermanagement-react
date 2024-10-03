import { useSelector, useDispatch } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAdminLogoutMutation } from "../slices/adminApiSlice"; 
import { adminLogout } from "../slices/adminAuthSlice"; 
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
    const { adminInfo } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useAdminLogoutMutation(); 

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap(); 
            dispatch(adminLogout()); 
            navigate('/admin/login'); 
        } catch (err) {
            console.error('Logout error:', err); 
        }
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand>MERN Admin</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {adminInfo ? (
                                <NavDropdown title={adminInfo.name} id="username">
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/admin/login">
                                    <Nav.Link>Admin Login</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default AdminHeader;
