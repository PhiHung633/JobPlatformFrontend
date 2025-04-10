import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getQuestions, createQuestion, uploadImage } from '../../utils/ApiFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const PAGE_SIZE = 5;
const API_URL = 'http://localhost:8080/questions';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    content: '',
    image: '',
    answers: [''],
    correctAnswer: '',
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [feedback, setFeedback] = useState({ type: '', message: '', open: false });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await getQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (question = null) => {
    if (question) {
      setForm({ ...question });
      setSelectedImageFile(null);
      setEditingId(question.id);
    } else {
      setForm({ content: '', image: '', answers: [''], correctAnswer: '' });
      setSelectedImageFile(null);
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ content: '', image: '', answers: [''], correctAnswer: '' });
    setSelectedImageFile(null);
    setEditingId(null);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...form.answers];
    updatedAnswers[index] = value;
    setForm((prev) => ({ ...prev, answers: updatedAnswers }));
  };

  const addAnswerField = () => {
    setForm((prev) => ({ ...prev, answers: [...prev.answers, ''] }));
  };

  const removeAnswerField = (index) => {
    const updatedAnswers = form.answers.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, answers: updatedAnswers }));
  };

  const validateForm = () => {
    if (!form.content.trim()) return 'Content is required.';
    if (form.answers.some(a => !a.trim())) return 'All answers must be filled.';
    if (!form.correctAnswer.trim()) return 'Correct answer must be selected.';
    return null;
  };

  const saveQuestion = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: 'error', message: validationError, open: true });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = form.image;
      if (selectedImageFile) {
        imageUrl = await uploadImage(selectedImageFile);
      }

      const payload = { ...form, image: imageUrl?.data || '' };

      if (editingId) {
        await api.patch(`/${editingId}`, payload);
      } else {
        await createQuestion(payload);
      }

      await fetchQuestions();
      closeModal();
      setFeedback({ type: 'success', message: `Question ${editingId ? 'updated' : 'created'} successfully!`, open: true });
    } catch (err) {
      console.error('Failed to save question', err);
      setFeedback({ type: 'error', message: 'Failed to save question. Please try again.', open: true });
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete question', err);
      setFeedback({ type: 'error', message: 'Failed to delete question.', open: true });
    }
  };

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Question Manager</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => openModal()}
        >
          + Add Question
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Content</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Answers</th>
            <th className="p-2 border">Correct</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedQuestions.map((q, index) => (
            <tr key={q.id}>
              <td className="p-2 border">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
              <td className="p-2 border">{q.content}</td>
              <td className="p-2 border">
                {q.image ? <img src={q.image} alt="question" className="w-16" /> : 'N/A'}
              </td>
              <td className="p-2 border">
                <ul className="list-disc ml-4">
                  {q.answers.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2 border font-semibold">{q.correctAnswer}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => openModal(q)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Question' : 'Create Question'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Content</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={form.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Upload Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImageFile(file);
                    }
                  }}
                />
                {selectedImageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(selectedImageFile)} alt="Preview" className="w-32 rounded" />
                  </div>
                )}
                {!selectedImageFile && form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="Current" className="w-32 rounded" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Answers</label>
                {form.answers.map((answer, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border p-2 rounded"
                      value={answer}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeAnswerField(idx)}
                      className="text-red-600"
                      disabled={form.answers.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={addAnswerField}
                >
                  + Add Answer
                </button>
              </div>

              <div>
                <label className="block font-medium">Correct Answer</label>
                <select
                  className="w-full border p-2 rounded"
                  value={form.correctAnswer}
                  onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                >
                  <option value="">-- Select correct answer --</option>
                  {form.answers.map((a, i) => (
                    <option key={i} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <CircularProgress size={60} style={{ color: '#fff' }} />
            <p className="text-white mt-4 text-lg">Loading...</p>
          </div>
        </div>
      )}

      {/* Snackbar Feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Quiz;
