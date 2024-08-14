import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Outlet } from 'react-router-dom';


function BasicExample() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">AMIS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/image_browser">Image Browser</Nav.Link>
                            <Nav.Link href="/3d_browser">3D Browser</Nav.Link>
                            <Nav.Link href="/help">Help</Nav.Link>
                            <Nav.Link href='/feedback'>Feedback</Nav.Link>

                            <Nav.Link target="_blank" href="https://druggablegenome.net/DRGC_GPCR">IDG Program</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </div>
    );
}

export default BasicExample;