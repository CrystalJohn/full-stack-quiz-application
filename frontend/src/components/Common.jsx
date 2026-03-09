import { Alert, Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../features/auth/authSlice.js";

export const ProtectedRoute = ({ children, roles }) => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/quizzes" replace />;
  }

  return children;
};

export const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/quizzes">
            Quiz App
          </Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/quizzes">
                Admin
              </Nav.Link>
            )}
            <span className="text-light small">{user?.username} ({user?.role})</span>
            <Button variant="outline-light" size="sm" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export const ErrorText = ({ error }) => {
  if (!error) return null;
  return <Alert variant="danger">{error}</Alert>;
};