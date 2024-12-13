import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Typography,
  Box,
  TablePagination,
  CircularProgress,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Dialog, DialogActions, DialogContent, DialogTitle, Button
} from "@mui/material";
import { Settings, Visibility } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAllUsers, updateUser } from "../../utils/ApiFunctions";
import Swal from 'sweetalert2';


const UserTable = () => {
  const [chipValue, setChipValue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("recruiter");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElementals, setTotalElementals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);


  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "fullName", // Default sort by "Tài khoản"
    direction: "asc", // Default sort direction
  });

  const loadUsers = async (page, rowsPerPage, email) => {
    setIsLoading(true);
    try {
      const role = activeTab === "recruiter" ? "ROLE_RECRUITER" : "ROLE_JOB_SEEKER";
      const { data, error, headers } = await getAllUsers(page, rowsPerPage, role, email);
      if (data) {
        setUsers(data);
        console.log(data)
        setTotalElementals(headers.get("x-total-elements"));
      } else {
        console.error("Error fetching job:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(page, rowsPerPage, null);
  }, [page, rowsPerPage, activeTab]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setPage(0);
    setRowsPerPage(5);
    setActiveTab(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      loadUsers(page, rowsPerPage, searchTerm);
      setChipValue(searchTerm);
      setSearchTerm('');
    }
  };

  const handleChipDelete = () => {
    setChipValue(null);
    loadUsers(0, 5, null);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const isSameKey = prevConfig.key === key;
      return {
        key,
        direction: isSameKey && prevConfig.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  const sortedUsers = [...users].sort((a, b) => {
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    // Special handling for boolean values
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return direction === "asc" ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
    }

    // Handle other types (strings, numbers, etc.)
    const aString = aValue?.toString().toLowerCase() || "";
    const bString = bValue?.toString().toLowerCase() || "";
    if (aString < bString) return direction === "asc" ? -1 : 1;
    if (aString > bString) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const showCompanyColumn = activeTab === "recruiter";

  const handleEditUser = (user) => {
    setEditedUser(user);
    setOpenEditModal(true);
    setAnchorEl(null);
  };

  const handleLockUnlockUser = async (user) => {
    try {
      setAnchorEl(null);
      Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const { data, error } = await updateUser(user.id, {
        isNonLocked: !user.isNonLocked,
      });

      if (data) {
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật thành công.',
        });

        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, isNonLocked: !u.isNonLocked } : u
          )
        );
      } else {
        console.error('Error deactivating user:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi thực hiện, vui lòng thử lại sau.',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể kết nối đến máy chủ.',
      });
    }
  };

  const handleVerifyUser = async (user) => {
    try {
      setAnchorEl(null);
      Swal.fire({
        title: 'Đang xử lý...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const { data, error } = await updateUser(user.id, {
        isActive: !user.isActive,
      });

      if (data) {
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật thành công.',
        });

        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, isActive: !u.isActive } : u
          )
        );
      } else {
        console.error('Error deactivating user:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Có lỗi xảy ra khi thực hiện, vui lòng thử lại sau.',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể kết nối đến máy chủ.',
      });
    }
  };

  const handleSaveUserChanges = async (updatedUser) => {
    setIsUpdating(true);

    try {
      const cleanedUser = Object.fromEntries(
        Object.entries(updatedUser).filter(([_, value]) => value !== null)
      );
      const { data, error } = await updateUser(updatedUser.id, cleanedUser);

      if (data) {
        setUsers((prevUsers) => prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...cleanedUser } : user
        ));
        setOpenEditModal(false);

        setTimeout(async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Cập nhật thành công',
          });
        }, 300);
      } else {
        console.error("Error updating user:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="mt-3 mr-4">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2">
            Quản lý người dùng
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            label="Tìm kiếm theo email"
            value={chipValue ? '' : searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            InputProps={{
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                  {chipValue && (
                    <Chip
                      label={chipValue}
                      onDelete={handleChipDelete}
                      deleteIcon={<CancelIcon />}
                      size="small"
                      style={{ marginRight: 8 }}
                    />
                  )}
                </>
              ),
            }}
            disabled={!!chipValue}
            style={{ width: '300px' }}
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="User Role Tabs"
        >
          <Tab label="Nhà tuyển dụng" value="recruiter" />
          <Tab label="Người tìm việc" value="jobSeeker" />
        </Tabs>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: "16px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }}>
                    <b>Tài khoản {sortConfig.key === "fullName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</b>
                  </TableCell>
                  <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                    <b>Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</b>
                  </TableCell>
                  {showCompanyColumn && (
                    <TableCell onClick={() => handleSort("companyName")} style={{ cursor: "pointer" }}>
                      <b>Công ty {sortConfig.key === "companyName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</b>
                    </TableCell>
                  )}
                  <TableCell onClick={() => handleSort("isActive")} style={{ cursor: "pointer" }}>
                    <b>
                      Xác thực {sortConfig.key === "isActive" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                    </b>
                  </TableCell>
                  <TableCell onClick={() => handleSort("isNonLocked")} style={{ cursor: "pointer" }}>
                    <b>
                      Trạng thái {sortConfig.key === "isNonLocked" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                    </b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Bằng chứng</b>
                  </TableCell>
                  <TableCell>
                    <b>Cài đặt</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={user.avatar} alt={user.fullName} />
                        <Typography style={{ marginLeft: "10px" }}>{user.fullName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {showCompanyColumn && <TableCell>{user.companyName || "-"}</TableCell>}
                    <TableCell>
                      <span
                        style={{
                          color: user.isActive ? "green" : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        ● {user.isActive ? "Đã xác thực" : "Chưa xác thực"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          color: user.isNonLocked ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        ● {user.isNonLocked ? "Đang hoạt động" : "Bị khóa"}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const images = user.businessLicense?.split(";") || [];
                          setSelectedImage(images);
                          setOpenImageDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          setSelectedUser(user);
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <Settings />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleEditUser(selectedUser)}>
            Chỉnh sửa người dùng
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleLockUnlockUser(selectedUser)}>
            Khóa/Mở khóa tài khoản
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleVerifyUser(selectedUser)}>
            Bật/Tắt xác thực tài khoản
          </MenuItem>
        </Menu>


      </Box>

      {!isLoading && (
        <TablePagination
          component="div"
          count={totalElementals}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            value={editedUser?.fullName || ""}
            onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editedUser?.email || ""}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditModal(false)} color="primary"
            disabled={isUpdating}>
            Đóng
          </Button>
          <Button
            onClick={() => handleSaveUserChanges(editedUser)}
            color="primary"
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Bằng chứng</DialogTitle>
        <DialogContent>
          {selectedImage && selectedImage.length > 0 ? (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
            >
              {selectedImage.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl.trim()} // Trim in case of extra spaces
                  alt={`Business License ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography>Không có hình ảnh.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default UserTable;
