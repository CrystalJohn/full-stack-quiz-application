import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuizError,
  createQuestion,
  deleteQuestion,
  fetchQuestionsByQuiz,
  fetchQuizzes,
  updateQuestion,
} from "../features/quizzes/quizSlice.js";

const emptyQuestion = { content: "", options: ["", "", "", ""], correctAnswerIndex: 0 };

const AdminQuestionsPage = () => {
  const dispatch = useDispatch();
  const { list, questions, loading, error } = useSelector((state) => state.quizzes);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
    return () => dispatch(clearQuizError());
  }, [dispatch]);

  useEffect(() => {
    if (selectedQuizId) {
      dispatch(fetchQuestionsByQuiz(selectedQuizId));
    }
  }, [dispatch, selectedQuizId]);

  const onQuestionSubmit = async (event) => {
    event.preventDefault();
    if (!selectedQuizId) return;

    const options = questionForm.options.map((s) => String(s).trim()).filter(Boolean);
    const payload = {
      content: questionForm.content,
      options,
      correctAnswerIndex: Math.min(
        Number(questionForm.correctAnswerIndex),
        Math.max(0, options.length - 1)
      ),
    };

    if (editingQuestionId) {
      await dispatch(updateQuestion({ questionId: editingQuestionId, quizId: selectedQuizId, payload }));
    } else {
      await dispatch(createQuestion({ quizId: selectedQuizId, payload }));
    }

    setQuestionForm(emptyQuestion);
    setEditingQuestionId(null);
  };

  const handleOptionChange = (index, value) => {
    setQuestionForm((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = value;
      return { ...prev, options: nextOptions };
    });
  };

  const selectedQuiz = useMemo(() => list.find((q) => q._id === selectedQuizId), [list, selectedQuizId]);

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (questionToDelete && selectedQuizId) {
      dispatch(deleteQuestion({ questionId: questionToDelete, quizId: selectedQuizId }));
    }
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  return (
    <>
      <h1 className="page-title mb-4">Manage Questions</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner />}

      <Card className="card-soft mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Chọn quiz để quản lý câu hỏi</Form.Label>
            <Form.Select
              value={selectedQuizId}
              onChange={(e) => {
                setSelectedQuizId(e.target.value);
                setQuestionForm(emptyQuestion);
                setEditingQuestionId(null);
              }}
            >
              <option value="">-- Chọn quiz --</option>
              {list.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {selectedQuiz && (
        <Card className="card-soft">
          <Card.Body>
            <Card.Title className="mb-4">Questions of &quot;{selectedQuiz.title}&quot;</Card.Title>

            <Form onSubmit={onQuestionSubmit} className="mb-4">
              <Form.Group className="mb-2">
                <Form.Label>Question content</Form.Label>
                <Form.Control
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm((prev) => ({ ...prev, content: e.target.value }))}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Options & Correct Answer</Form.Label>
                {questionForm.options.map((optionText, index) => (
                  <div key={index} className="d-flex align-items-center mb-2 gap-2">
                    <Form.Check
                      type="radio"
                      name="correctAnswer"
                      id={`radio-${index}`}
                      checked={questionForm.correctAnswerIndex === index}
                      onChange={() => setQuestionForm((prev) => ({ ...prev, correctAnswerIndex: index }))}
                    />
                    <Form.Control
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={optionText}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
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

            <Table striped responsive hover className="align-middle">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Content</th>
                  <th style={{ width: "30%" }}>Options</th>
                  <th style={{ width: "20%" }}>Correct Answer</th>
                  <th style={{ width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question._id}>
                    <td>{question.content}</td>
                    <td>
                      <ul className="mb-0 ps-3">
                        {question.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <Badge bg="success" className="text-wrap text-start">
                        {question.options[question.correctAnswerIndex] || `Option ${question.correctAnswerIndex + 1}`}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            const opts = question.options.slice(0, 4);
                            const padded =
                              opts.length >= 4
                                ? opts
                                : [...opts, ...Array(4 - opts.length).fill("")];
                            setEditingQuestionId(question._id);
                            setQuestionForm({
                              content: question.content,
                              options: padded,
                              correctAnswerIndex: question.correctAnswerIndex,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteClick(question._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa câu hỏi này không? Thao tác này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminQuestionsPage;
