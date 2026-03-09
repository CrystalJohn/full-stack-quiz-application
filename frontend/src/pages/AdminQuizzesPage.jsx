import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuizError,
  createQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  fetchQuestionsByQuiz,
  fetchQuizzes,
  updateQuestion,
  updateQuiz,
} from "../features/quizzes/quizSlice.js";

const emptyQuiz = { title: "", description: "", isPublished: true };
const emptyQuestion = { content: "", optionsText: "", correctAnswerIndex: 0 };

const AdminQuizzesPage = () => {
  const dispatch = useDispatch();
  const { list, questions, loading, error } = useSelector((state) => state.quizzes);
  const [quizForm, setQuizForm] = useState(emptyQuiz);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
    return () => dispatch(clearQuizError());
  }, [dispatch]);

  useEffect(() => {
    if (activeQuizId) {
      dispatch(fetchQuestionsByQuiz(activeQuizId));
    }
  }, [dispatch, activeQuizId]);

  const onQuizSubmit = async (event) => {
    event.preventDefault();
    if (editingQuizId) {
      await dispatch(updateQuiz({ quizId: editingQuizId, payload: quizForm }));
    } else {
      await dispatch(createQuiz(quizForm));
    }
    setQuizForm(emptyQuiz);
    setEditingQuizId(null);
  };

  const onQuestionSubmit = async (event) => {
    event.preventDefault();
    if (!activeQuizId) return;

    const options = questionForm.optionsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      content: questionForm.content,
      options,
      correctAnswerIndex: Number(questionForm.correctAnswerIndex),
    };

    if (editingQuestionId) {
      await dispatch(updateQuestion({ questionId: editingQuestionId, quizId: activeQuizId, payload }));
    } else {
      await dispatch(createQuestion({ quizId: activeQuizId, payload }));
    }

    setQuestionForm(emptyQuestion);
    setEditingQuestionId(null);
  };

  const activeQuiz = useMemo(() => list.find((quiz) => quiz._id === activeQuizId), [list, activeQuizId]);

  return (
    <>
      <h1 className="page-title mb-4">Admin Quiz Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner />}
      <Row className="g-4">
        <Col lg={5}>
          <Card className="card-soft">
            <Card.Body>
              <Card.Title>{editingQuizId ? "Edit Quiz" : "Create Quiz"}</Card.Title>
              <Form onSubmit={onQuizSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={quizForm.title}
                    onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={quizForm.description}
                    onChange={(e) => setQuizForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </Form.Group>
                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  label="Published"
                  checked={quizForm.isPublished}
                  onChange={(e) => setQuizForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                />
                <div className="d-flex gap-2">
                  <Button type="submit">{editingQuizId ? "Update" : "Create"}</Button>
                  {editingQuizId && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingQuizId(null);
                        setQuizForm(emptyQuiz);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="card-soft mt-3">
            <Card.Body>
              <Card.Title>Quiz list</Card.Title>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((quiz) => (
                    <tr key={quiz._id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.isPublished ? "Published" : "Draft"}</td>
                      <td className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setEditingQuizId(quiz._id);
                            setQuizForm({
                              title: quiz.title,
                              description: quiz.description || "",
                              isPublished: quiz.isPublished,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-dark" onClick={() => setActiveQuizId(quiz._id)}>
                          Questions
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => dispatch(deleteQuiz(quiz._id))}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="card-soft">
            <Card.Body>
              <Card.Title>
                {activeQuiz ? `Questions of ${activeQuiz.title}` : "Select a quiz to manage questions"}
              </Card.Title>
              {activeQuiz && (
                <>
                  <Form onSubmit={onQuestionSubmit} className="mb-3">
                    <Form.Group className="mb-2">
                      <Form.Label>Question content</Form.Label>
                      <Form.Control
                        value={questionForm.content}
                        onChange={(e) => setQuestionForm((prev) => ({ ...prev, content: e.target.value }))}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Options (one per line)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={questionForm.optionsText}
                        onChange={(e) => setQuestionForm((prev) => ({ ...prev, optionsText: e.target.value }))}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correct answer index (0-based)</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={questionForm.correctAnswerIndex}
                        onChange={(e) =>
                          setQuestionForm((prev) => ({ ...prev, correctAnswerIndex: e.target.value }))
                        }
                        required
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button type="submit">{editingQuestionId ? "Update" : "Create"}</Button>
                      {editingQuestionId && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingQuestionId(null);
                            setQuestionForm(emptyQuestion);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>

                  <Table striped size="sm">
                    <thead>
                      <tr>
                        <th>Content</th>
                        <th>Options</th>
                        <th>Correct</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question._id}>
                          <td>{question.content}</td>
                          <td>{question.options.join(" | ")}</td>
                          <td>{question.correctAnswerIndex}</td>
                          <td className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setEditingQuestionId(question._id);
                                setQuestionForm({
                                  content: question.content,
                                  optionsText: question.options.join("\n"),
                                  correctAnswerIndex: question.correctAnswerIndex,
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() =>
                                dispatch(deleteQuestion({ questionId: question._id, quizId: activeQuizId }))
                              }
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminQuizzesPage;