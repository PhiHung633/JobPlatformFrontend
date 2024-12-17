import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Alert, Snackbar, CircularProgress } from "@mui/material";
import { resetPassword } from "../../utils/ApiFunctions";

const PasswordResetForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const token = searchParams.get("token");

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường và 1 chữ số.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      const payload = { token, password };
      const response = await resetPassword(payload);

      if (!response.error) {
        setSuccessMessage("Mật khẩu đã được đặt lại thành công!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/dang-nhap");
        }, 2000);
      } else {
        setError("Đặt lại mật khẩu không thành công do token sai hoặc đã hết hạn. Vui lòng tạo lại yêu cầu mới");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Đặt lại mật khẩu
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
          <TextField
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={loading} // Disable button during loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Đặt lại mật khẩu"}
          </Button>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default PasswordResetForm;
