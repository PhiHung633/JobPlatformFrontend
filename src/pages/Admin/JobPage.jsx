import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import { fetchAllJobs } from '../../utils/ApiFunctions';

import { JobTable } from '../../components/Admin/Job/job-table';

export default function Page() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElementals, setTotalEmelementals] = useState(0);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');



  // Function to fetch jobs
  const loadJob = async (page, rowsPerPage) => {
    setLoading(true);
    const { data, error, status, headers } = await fetchAllJobs(page, rowsPerPage, null, null, 'PENDING_APPROVAL');
    if (data) {
      setJobs(data);
      console.log(data)
      setTotalEmelementals(headers.get("x-total-elements"))
      setFilteredJobs(data)
    } else {
      setError(error);
      console.error(`Error fetching job: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobs(jobs); // Show all jobs if the search query is empty
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, jobs]);

  useEffect(() => {
    loadJob(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refreshJobs = () => {
    setPage(0);
    loadJob(0, rowsPerPage);
  };

  return (
    <Stack spacing={3} className="mr-5 mt-5">
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{
            background: 'linear-gradient(to right, #007BFF, #00C6FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Phê duyệt tin tuyển dụng
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          size="small"
          sx={{ width: 300 }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Stack>

      {/* Loading or JobTable */}
      {loading ? (
        <Stack justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
          <CircularProgress size={50} />
        </Stack>
      ) : error ? (
        <Typography color="error" align="center">
          {`Error loading jobs: ${error}`}
        </Typography>
      ) : (
        <JobTable
          count={filteredJobs.length}
          page={page}
          rows={filteredJobs}
          rowsPerPage={rowsPerPage}
          onRefresh={refreshJobs}
        />
      )}

      {!loading ? (
        <TablePagination
          component="div"
          count={totalElementals}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />) : <></>}
    </Stack>
  );
}
