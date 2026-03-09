import { useEffect } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearQuizError, fetchQuizzes } from "../features/quizzes/quizSlice.js";

const QuizListPage = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
    return () => dispatch(clearQuizError());
  }, [dispatch]);

  return (
    <>
      <h1 className="page-title mb-4">Available Quizzes</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner />}
      {!loading && !list.length && <Alert variant="info">No quizzes available.</Alert>}
      <Row className="g-3">
        {list.map((quiz) => (
          <Col key={quiz._id} md={6} lg={4}>
            <Card className="card-soft h-100">
              <Card.Body>
                <Card.Title>{quiz.title}</Card.Title>
                <Card.Text>{quiz.description || "No description"}</Card.Text>
                <Button as={Link} to={`/quizzes/${quiz._id}/take`}>
                  Take quiz
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default QuizListPage;