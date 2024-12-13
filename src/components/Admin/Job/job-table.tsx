'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useSelection } from '../../../pages/Admin/use-selection';
import { updateStatusJobs, deleteJobs } from '../../../utils/ApiFunctions';

function noop(): void {
  // do nothing
}

export interface Job {
  benefits: string;
  companyImages: string;
  companyLocation: string;
  companyName: string;
  createAt: Date;
  deadline: Date;
  description: string;
  id: number;
  salary: number;
  title: string;
  industry: string;
  workExperience: string;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Job[];
  rowsPerPage?: number;
  onRefresh?: () => void;
}

export function JobTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onRefresh = () => {},
}: CustomersTableProps): React.JSX.Element {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [sortField, setSortField] = React.useState<string>('createAt'); 
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const sortedRows = React.useMemo(() => {
    if (!sortField) return rows;

    return [...rows].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selected || selected.size === 0) {
      await MySwal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: `Vui lòng chọn ít nhất một công việc để thao tác.`,
      });
      return;
    }

    const selectedRowIds = Array.from(selected);

    // Show loading dialog
    Swal.fire({
      title: 'Vui lòng chờ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      if (action === 'approve') {
        await updateStatusJobs(selectedRowIds, 'SHOW');
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Phê duyệt tin tuyển dụng thành công!',
        });
      } else if (action === 'reject') {
        await updateStatusJobs(selectedRowIds, 'DISQUALIFIED');
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã từ chối tin tuyển dụng',
        });
      }
      onRefresh(); // Refresh the table
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã có lỗi xảy ra trong quá trình thực hiện. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell onClick={() => handleSort('companyName')} sx={{ cursor: 'pointer' }}>
                <b>Công Ty</b> {sortField === 'companyName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                <b>Công việc</b> {sortField === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('industry')} sx={{ cursor: 'pointer' }}>
                <b>Ngành</b> {sortField === 'industry' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('createAt')} sx={{ cursor: 'pointer' }}>
                <b>Thời gian tạo</b> {sortField === 'createAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('deadline')} sx={{ cursor: 'pointer' }}>
                <b>Hạn chót CV</b> {sortField === 'deadline' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isSelected}
                  onClick={() => navigate(`/viec-lam/${row.id}`)} // Navigate on row click
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent checkbox click from triggering row click
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.companyImages} />
                      <Typography variant="subtitle2">{row.companyName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.industry}</TableCell>
                  <TableCell>{dayjs(row.createAt).format('DD-MM-YYYY hh:mm')}</TableCell>
                  <TableCell>{dayjs(row.deadline).format('DD-MM-YYYY hh:mm')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleAction('approve')}
          >
            Phê duyệt
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleAction('reject')}
          >
            Từ chối
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
