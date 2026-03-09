import { Alert, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Alert variant="warning">Page not found.</Alert>
      <Button as={Link} to="/quizzes">
        Go to quizzes
      </Button>
    </Container>
  );
};

export default NotFoundPage;