import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthError, fetchMe, loginUser } from "../features/auth/authSlice.js";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
    }
  }, [token, dispatch]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/quizzes", { replace: true });
      }
    }
  }, [token, user, navigate, location.state]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginUser(form));
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={5} lg={4}>
          <Card className="card-soft p-3">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Login"}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                Don't have an account? <Link to="/register">Register</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;