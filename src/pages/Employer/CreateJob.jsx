import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { addJob, updateJob } from "../../utils/ApiFunctions";

const CreateJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [workType, setWorkType] = useState("");
  const [numberOfRecruits, setNumberOfRecruits] = useState("");
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (state) {
      setTitle(state.title);
      setDescription(state.description);
      setWorkExperience(state.workExperience);
      setBenefits(state.benefits);
      setIndustry(state.industry);
      setLevel(state.level);
      setWorkType(state.workType);
      setNumberOfRecruits(state.numberOfRecruits);
      setSalary(state.salary);
      setDeadline(dayjs(state.deadline));
      setJobId(state.id);
    }
  }, [state]);

  const formatSalary = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    setSalary(value ? value.toString().replace(/\D/g, "") : "");
  };

  const handleCreateOrUpdateJob = async (e) => {
    e.preventDefault();
    setError("");

    const formattedSalary = salary ? salary.toString().replace(/\D/g, "") : "";
    const parsedSalary = parseFloat(formattedSalary);

    if (isNaN(parsedSalary)) {
      alert("Mức lương không hợp lệ.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !industry ||
      !level ||
      !workType ||
      !numberOfRecruits ||
      !formattedSalary
    ) {
      alert("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      return;
    }

    const deadlineISO = dayjs(deadline).format("YYYY-MM-DDTHH:mm:ss");

    const jobData = {
      title,
      description,
      workExperience,
      benefits,
      industry,
      level,
      workType,
      numberOfRecruits: parseInt(numberOfRecruits, 10),
      salary: parsedSalary,
      deadline: deadlineISO,
    };

    let response;
    if (jobId) {
      response = await updateJob(jobId, jobData);
      if (response && !response.error) {
        alert(`Cập nhật tin tuyển dụng: ${title}`);
        navigate("/dashboard/quan-li-cong-viec");
      } else {
        alert("Có lỗi xảy ra khi cập nhật tin tuyển dụng");
        setError(response.error);
      }
    } else {
      response = await addJob(jobData);
      if (response && !response.error) {
        alert(`Đã tạo tin tuyển dụng: ${title}`);
        navigate("/dashboard/quan-li-cong-viec");
      } else {
        alert("Có lỗi xảy ra khi tạo tin tuyển dụng");
        setError(response.error);
      }
    }
  };

  return (
    <div className="p-8 mt-10 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {error && (
        <div className="text-red-500 mb-4">
          {error.error?.title && <p>- {error.error.title}</p>}
          {error.error?.description && <p>- {error.error.description}</p>}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">
        {jobId ? "Cập nhật tin tuyển dụng" : "Tạo tin tuyển dụng mới"}
      </h2>
      <form onSubmit={handleCreateOrUpdateJob} className="space-y-6">
        {/* Thông tin công việc */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Thông tin công việc</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Tiêu đề công việc</label>
              <TextField
                id="title"
                type="text"
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium mb-2">Ngành nghề</label>
              <TextField
                id="industry"
                type="text"
                placeholder="Ngành nghề"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Mô tả công việc
              </label>
              <textarea
                id="description"
                placeholder="Mô tả công việc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-1 border rounded-[5px]"
              ></textarea>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2">Cấp bậc</label>
              <TextField
                id="level"
                type="text"
                placeholder="Cấp bậc"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Yêu cầu công việc */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Yêu cầu công việc</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="workExperience" className="block text-sm font-medium mb-2">Kinh nghiệm làm việc</label>
              <TextField
                id="workExperience"
                type="text"
                placeholder="Kinh nghiệm làm việc"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="numberOfRecruits" className="block text-sm font-medium mb-2">
                Số lượng tuyển
              </label>
              <TextField
                id="numberOfRecruits"
                type="number"
                placeholder="Số lượng tuyển"
                value={numberOfRecruits}
                onChange={(e) => setNumberOfRecruits(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="benefits" className="block text-sm font-medium mb-2">
                Phúc lợi
              </label>
              <TextField
                id="benefits"
                type="text"
                placeholder="Phúc lợi"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Chi tiết tuyển dụng */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chi tiết tuyển dụng</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="workType" className="block text-sm font-medium mb-2">Hình thức làm việc</label>
              <Select
                id="workType"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                displayEmpty
                className="w-full"
                renderValue={(selected) => !selected ? <em>Chọn hình thức làm việc</em> : selected}
              >
                <MenuItem value="" disabled>
                  <span className="text-gray-400">Chọn hình thức làm việc</span>
                </MenuItem>
                <MenuItem value="Toàn thời gian">Toàn thời gian</MenuItem>
                <MenuItem value="Bán thời gian">Bán thời gian</MenuItem>
              </Select>
            </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium mb-2">Mức lương</label>
              <TextField
                id="salary"
                type="text"
                placeholder="Mức lương"
                value={formatSalary(salary)}
                onChange={handleSalaryChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium mb-2">
                Hạn nộp đơn
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={dayjs(deadline)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDeadline(newValue);
                    }
                  }}
                  format="DD/MM/YYYY hh:mm A"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "16px",
                        },
                      }}
                    />
                  )}
                  sx={{
                    width: "1090px",
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            {jobId ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
