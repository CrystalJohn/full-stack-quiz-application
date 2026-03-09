import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Form, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearQuizError,
  clearSubmission,
  fetchQuestionsByQuiz,
  fetchQuizById,
  submitQuiz,
} from "../features/quizzes/quizSlice.js";

const indexToLetter = (index) => (Number.isInteger(index) && index >= 0 ? String.fromCharCode(65 + index) : "N/A");

const TakeQuizPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedQuiz, questions, submissionResult, loading, error } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});

  const questionMap = useMemo(() => new Map(questions.map((q) => [q._id, q])), [questions]);
  const isSubmitted = !!submissionResult;

  useEffect(() => {
    dispatch(fetchQuizById(id));
    dispatch(fetchQuestionsByQuiz(id));
    return () => {
      dispatch(clearSubmission());
      dispatch(clearQuizError());
    };
  }, [dispatch, id]);

  const answerPayload = useMemo(
    () =>
      Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      })),
    [answers]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    await dispatch(submitQuiz({ quizId: id, answers: answerPayload }));
  };

  return (
    <>
      <h1 className="page-title">{selectedQuiz?.title || "Quiz"}</h1>
      <p className="text-muted">{selectedQuiz?.description}</p>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner />}

      <Form onSubmit={onSubmit}>
        {questions.map((question, index) => (
          <Card className="card-soft mb-3" key={question._id}>
            <Card.Body>
              <Card.Title>
                {index + 1}. {question.content}
              </Card.Title>
              {question.options.map((option, optIndex) => (
                <Form.Check
                  key={`${question._id}-${optIndex}`}
                  type="radio"
                  name={question._id}
                  label={option}
                  checked={answers[question._id] === optIndex}
                  disabled={isSubmitted}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question._id]: optIndex }))}
                />
              ))}
            </Card.Body>
          </Card>
        ))}
        {!!questions.length && !isSubmitted && <Button type="submit">Submit answers</Button>}
      </Form>

      {submissionResult && (
        <Card className="card-soft mt-4">
          <Card.Body>
            <Card.Title>
              Result: {submissionResult.score}/{submissionResult.total}
            </Card.Title>
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Your answer</th>
                  <th>Correct answer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissionResult.details.map((item) => (
                  <tr key={item.questionId}>
                    {/* Hiển thị câu hỏi từ questionMap với content */}
                    <td>{questionMap.get(item.questionId)?.content ?? "—"}</td> 
                    <td>{item.selectedIndex === null ? "N/A" : indexToLetter(item.selectedIndex)}</td>
                    <td>{indexToLetter(item.correctAnswerIndex)}</td>
                    {/* Hiển thị status đúng sai với tô màu success hay danger */}
                    <td className={item.isCorrect ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                      {item.isCorrect ? "Correct" : "Wrong"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default TakeQuizPage;