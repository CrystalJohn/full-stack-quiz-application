import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, Nav } from "react-bootstrap";
import { logout } from "../features/auth/authSlice.js";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      <Container className="py-4 position-relative">
        <div className="position-absolute top-0 end-0 mt-3 me-3 text-muted">
          Welcome, {user?.username}
        </div>

        <h1 className="fw-bold mb-4">Admin Dashboard</h1>

        <Card className="card-soft mb-4">
          <Card.Body>
            <Nav variant="pills" className="gap-2 flex-wrap">
              <Nav.Link
                as={Link}
                to="/admin"
                className={
                  isActive("/admin") &&
                  !location.pathname.includes("/quizzes") &&
                  !location.pathname.includes("/questions") &&
                  !location.pathname.includes("/articles")
                    ? "active fw-semibold"
                    : ""
                }
              >
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/questions" className={isActive("/admin/questions") ? "active fw-semibold" : ""}>
                Manage Questions
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/articles" className={isActive("/admin/articles") ? "active fw-semibold" : ""}>
                Manage Articles
              </Nav.Link>
              <Nav.Link
                as="button"
                className="btn btn-link text-decoration-none ms-auto"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>

        <Outlet />
      </Container>
    </>
  );
};

export default AdminDashboardPage;
