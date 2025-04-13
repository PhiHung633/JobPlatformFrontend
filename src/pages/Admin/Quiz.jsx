import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Add, Close, Delete, Edit } from '@mui/icons-material';
import {
  getQuestions,
  createQuestion,
  uploadImage,
  editQuestion,
  deleteQuestion
} from '../../utils/ApiFunctions';

const PAGE_SIZE = 5;

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    content: '',
    image: '',
    answers: [''],
    correctAnswer: ''
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
      setEditingId(question.id);
    } else {
      setForm({ content: '', image: '', answers: [''], correctAnswer: '-- Chọn câu trả lời đúng --' });
      setEditingId(null);
    }
    setSelectedImageFile(null);
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
    const oldAnswer = updatedAnswers[index];
    updatedAnswers[index] = value;

    let updatedCorrect = form.correctAnswer;
    if (oldAnswer === form.correctAnswer && value !== form.correctAnswer) {
      updatedCorrect = '';
    }

    setForm((prev) => ({ ...prev, answers: updatedAnswers, correctAnswer: updatedCorrect }));
  };

  const addAnswerField = () => {
    setForm((prev) => ({ ...prev, answers: [...prev.answers, ''] }));
  };

  const removeAnswerField = (index) => {
    const removedAnswer = form.answers[index];
    const updatedAnswers = form.answers.filter((_, i) => i !== index);
    const updatedCorrect = removedAnswer === form.correctAnswer ? '' : form.correctAnswer;
    setForm((prev) => ({ ...prev, answers: updatedAnswers, correctAnswer: updatedCorrect }));
  };

  const validateForm = () => {
    if (!form.content.trim()) return 'Nội dung câu hỏi không được để trống.';
    if (form.answers.some(a => !a.trim())) return 'Câu trả lời không được để trống.';
    if (!form.correctAnswer.trim() || form.correctAnswer === '-- Chọn câu trả lời đúng --') return 'Vui lòng chọn câu trả lời đúng.';
    if (!form.answers.includes(form.correctAnswer)) return 'Câu trả lời đúng phải nằm trong các câu trả lời.';
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
        await editQuestion(payload, editingId);
      } else {
        await createQuestion(payload);
      }

      await fetchQuestions();
      closeModal();
      setFeedback({
        type: 'success',
        message: `Câu hỏi ${editingId ? 'đã cập nhật' : 'đã tạo'} thành công!`,
        open: true
      });
    } catch (err) {
      console.error('Failed to save question', err);
      setFeedback({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.', open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      console.error('Failed to delete question', err);
      setFeedback({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.', open: true });
    }
  };

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paginatedQuestions = questions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Quản lý câu hỏi IQ</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openModal()}>
          Thêm câu hỏi
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hình ảnh</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Câu trả lời</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Câu trả lời đúng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Chỉnh sửa</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQuestions.map((q, index) => (
                <TableRow key={q.id}>
                  <TableCell>{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                  <TableCell>{q.content}</TableCell>
                  <TableCell>
                    {q.image ? (
                      <img src={q.image} alt="question" style={{ width: 60, borderRadius: 4 }} />
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <ul style={{ paddingLeft: 16 }}>
                      {q.answers.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{q.correctAnswer}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => openModal(q)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuestion(q.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="center" gap={1}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? 'contained' : 'outlined'}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Box>

      {/* Dialog Modal */}
      <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nội dung câu hỏi"
                fullWidth
                multiline
                rows={3}
                value={form.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button component="label" variant="outlined" fullWidth>
                Tải ảnh lên
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files?.[0])}
                />
              </Button>
              {(selectedImageFile || form.image) && (
                <Box mt={2}>
                  <img
                    src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : form.image}
                    alt="preview"
                    style={{ width: 100, borderRadius: 8 }}
                  />
                </Box>
              )}
            </Grid>

            {form.answers.map((answer, index) => (
              <Grid item xs={12} key={index} container spacing={1} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    label={`Câu trả lời ${index + 1}`}
                  />
                </Grid>
                <Grid item>
                  <IconButton
                    color="error"
                    onClick={() => removeAnswerField(index)}
                    disabled={form.answers.length <= 1}
                  >
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button variant="text" onClick={addAnswerField} startIcon={<Add />}>
                Thêm câu trả lời
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Select
                fullWidth
                displayEmpty
                value={form.correctAnswer}
                onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
              >
                <MenuItem value="" disabled>
                  -- Chọn câu trả lời đúng --
                </MenuItem>
                {form.answers.map((a, i) => (
                  <MenuItem key={i} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>Hủy</Button>
          <Button
            variant="contained"
            onClick={saveQuestion}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : editingId ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Loading Overlay */}
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(0,0,0,0.5)"
          zIndex={1300}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={60} style={{ color: '#fff' }} />
        </Box>
      )}
    </Box>
  );
};

export default Quiz;
