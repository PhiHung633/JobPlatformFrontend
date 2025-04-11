import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { addJob, fetchUserById, processMomoPayment, updateJob } from "../../utils/ApiFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faHouseFlag } from "@fortawesome/free-solid-svg-icons";
import { provinces } from "../../components/Province/Provinces";


const CreateJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { state } = location;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [requirement, setRequirement] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [workType, setWorkType] = useState("");
  const [numberOfRecruits, setNumberOfRecruits] = useState("");
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amountToDeposit, setAmountToDeposit] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          setUserId(userId);

          const { data, error } = await fetchUserById(userId);
          if (data) {
            setUserData(data);
          } else {
            setError(error);
          }
        } catch (err) {
          console.error("Error decoding token or fetching user:", err);
          setError("Failed to fetch user data.");
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (state) {
      setTitle(state.title);
      setDescription(state.description);
      setRequirement(state.requirement);
      setWorkExperience(state.workExperience);
      setBenefits(state.benefits);
      setIndustry(state.industry);
      setLevel(state.level);
      setWorkType(state.workType);
      setNumberOfRecruits(state.numberOfRecruits);
      setSalary(state.salary);
      const addressParts = state.address?.split(",").map(part => part.trim());
      if (addressParts && addressParts.length === 3) {
        const [address, selectedDistrict, selectedProvince] = addressParts;
        setAddress(address);
        setSelectedDistrict(selectedDistrict);
        setSelectedProvince(selectedProvince);
      }
      setDeadline(dayjs(state.deadline));
      setJobId(state.id);
    }
    console.log("DAYROI", state);
  }, [state]);


  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);

    const selected = provinces.find((province) => province.name === provinceName);
    setDistricts(selected ? selected.districts : []);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

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
    setLoading(true);


    const formattedSalary = salary ? salary.toString().replace(/\D/g, "") : "";
    const parsedSalary = parseFloat(formattedSalary);

    if (isNaN(parsedSalary)) {
      alert("Mức lương không hợp lệ.");
      setLoading(false);
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !requirement.trim() ||
      !industry ||
      !level ||
      !workType ||
      !numberOfRecruits ||
      !formattedSalary
    ) {
      alert("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      setLoading(false);
      return;
    }

    const deadlineISO = dayjs(deadline).format("YYYY-MM-DDTHH:mm:ss");

    const jobData = {
      title,
      description,
      requirement,
      workExperience,
      benefits,
      industry,
      level,
      workType,
      address: `${address}, ${selectedDistrict}, ${selectedProvince}`,
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
      if (userData.availableJobPosts === 0) {
        const confirm = window.confirm(
          "Bạn đã hết lượt đăng miễn phí. Bạn có muốn nạp tiền để tiếp tục không?"
        );
        if (confirm) {
          setShowModal(true);
        }
        setLoading(false);
        return;
      }

      response = await addJob(jobData);
      if (response && !response.error) {
        alert(`Đã tạo tin tuyển dụng: ${title}`);
        navigate("/dashboard/quan-li-cong-viec");
      } else {
        alert("Có lỗi xảy ra khi tạo tin tuyển dụng");
        setError(response.error);
        setLoading(false);
      }
    }
  };

  const handlePayment = async () => {
    if (!amountToDeposit || parseInt(amountToDeposit.replace(/\D/g, ""), 10) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    const paymentData = {
      amount: parseInt(amountToDeposit.replace(/\D/g, ""), 10),
      account: userData?.email,
    };

    try {
      const { data, error } = await processMomoPayment(paymentData);

      if (error) {
        alert(`Thanh toán thất bại: ${error.message || "Có lỗi xảy ra."}`);
        return;
      }

      if (data?.shortLink) {
        alert("Đang chuyển hướng đến cổng thanh toán...");
        window.location.href = data.shortLink;
        setShowModal(false);
      } else {
        alert("Không tìm thấy liên kết thanh toán.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Có lỗi xảy ra trong quá trình xử lý thanh toán.");
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return parseInt(value.replace(/\D/g, ""), 10).toLocaleString("vi-VN");
  };


  console.log("USERNE", userData)
  return (
    <div className="p-8 mt-5 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
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
                disabled={!!jobId}
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium mb-2">Ngành nghề</label>
              {/* <TextField
                id="industry"
                type="text"
                placeholder="Ngành nghề"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-3 border rounded-lg"
                disabled={!!jobId}
              /> */}
              <Select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                displayEmpty
                className="w-full"
                disabled={!!jobId}
                renderValue={(selected) => !selected ? <em>Chọn ngành nghề</em> : selected}
              >
                <MenuItem value="" disabled>
                  <span className="text-gray-400">Chọn ngành nghề</span>
                </MenuItem>
                <MenuItem value="Kỹ thuật">Kỹ thuật</MenuItem>
                <MenuItem value="Bất động sản">Bất động sản</MenuItem>
                <MenuItem value="Công nghệ thông tin">Công nghệ thông tin</MenuItem>
                <MenuItem value="Giáo dục">Giáo dục</MenuItem>
                <MenuItem value="Kế toán">Kế toán</MenuItem>
                <MenuItem value="Marketing / Truyền thông / Quảng cáo">Marketing / Truyền thông / Quảng cáo</MenuItem>
                <MenuItem value="Thời trang">Thời trang</MenuItem>
                <MenuItem value="Y tế">Y tế</MenuItem>
              </Select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Mô tả công việc</label>
              <textarea
                id="description"
                placeholder="Mô tả công việc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-1 border rounded-[5px] items-center"
                disabled={!!jobId}
              ></textarea>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2">Cấp bậc</label>
              {/* <TextField
                id="level"
                type="text"
                placeholder="Cấp bậc"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 border rounded-lg"
              /> */}
              <Select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                displayEmpty
                className="w-full"
                renderValue={(selected) => !selected ? <em>Chọn cấp bậc làm việc</em> : selected}
              >
                <MenuItem value="" disabled>
                  <span className="text-gray-400">Chọn cấp bậc làm việc</span>
                </MenuItem>
                <MenuItem value="Intern">Intern</MenuItem>
                <MenuItem value="Fresher">Fresher</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Middle">Middle</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </div>
            <div className="space-y-2">
              {/* Province */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faHospital}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="pl-10 p-3 px-10 border rounded-lg text-sm w-full"
                  disabled={!!jobId}
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faHouseFlag}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="pl-10 p-3 px-10 border rounded-lg text-sm w-full"
                  disabled={!selectedProvince || !!jobId}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">Địa chỉ cụ thể</label>
              <TextField
                id="address"
                type="text"
                placeholder="Địa chỉ cụ thể"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-lg"
                disabled={!!jobId}
              />
            </div>
          </div>
          {/* Yêu cầu công việc */}
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-4">Yêu cầu công việc</h3>
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
                  disabled={!!jobId}
                />
              </div>
              <div>
                <label htmlFor="numberOfRecruits" className="block text-sm font-medium mb-2">Số lượng tuyển</label>
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
                <label htmlFor="requirement" className="block text-sm font-medium mb-2">Yêu cầu công việc</label>
                <textarea
                  id="requirement"
                  placeholder="Yêu cầu công việc"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="w-full p-1 border rounded-[5px] items-center"
                ></textarea>
              </div>
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium mb-2">Phúc lợi</label>
                <TextField
                  id="benefits"
                  type="text"
                  placeholder="Phúc lợi"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  disabled={!!jobId}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-4">Chi tiết tuyển dụng</h3>
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
                  disabled={!!jobId}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết tuyển dụng */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium mb-2">Hạn nộp đơn</label>
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

        {/* Nút hành động */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              jobId ? "Cập nhật" : "Tạo mới"
            )}
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h3 className="text-xl font-semibold text-gray-800">Nạp tiền</h3>
            <p className="mt-4 text-sm font-semibold text-red-600">
              (*) Lưu ý: Với <span className="text-blue-500 font-bold">100.000 VNĐ</span>, bạn sẽ được một lần đăng tin
            </p>
            <p className="mt-4 text-gray-600">Nhập số tiền bạn muốn nạp:</p>
            <input
              type="text"
              value={amountToDeposit}
              onChange={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                setAmountToDeposit(formattedValue);
              }}
              placeholder="Số tiền"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                Thanh toán
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default CreateJob;
