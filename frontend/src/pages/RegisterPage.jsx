import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, registerUser } from "../features/auth/authSlice.js";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/quizzes", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(registerUser(form));
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={5} lg={4}>
          <Card className="card-soft p-3">
            <Card.Body>
              <h3 className="text-center mb-4">Register</h3>
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
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Register"}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                Already have account? <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;