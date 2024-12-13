import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faPhone, faBuilding, faHospital, faHouseFlag, faIndustry, faGlobe, faInfoCircle, faImage, faLocationArrow, faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { provinces } from "../../components/Province/Provinces";
import { addCompany, getCompanies, signUpUser, uploadImage } from "../../utils/ApiFunctions";

const EmployerRegistrationForm = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [images, setImages] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState("")
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const selectRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [companyProofPreview, setCompanyProofPreview] = useState(null);
  const [imagesCompany, setImageCompany] = useState("");

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'ROLE_RECRUITER',
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    description: '',
    province: '',
    district: '',
    companyLogo: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data, error } = await getCompanies();
      console.log("DATADAYNE", data)
      if (data) {
        const filteredCompanies = data.filter((company) => company.status === true);
        setCompanies(filteredCompanies);
      } else {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      }
    } catch (error) {
      console.error("Unexpected error fetching companies:", error);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCompany(selectedValue);

    if (selectedValue === "Khác") {
      setShowAddCompanyForm(true);
      setSelectedCompany("");
    } else {
      setShowAddCompanyForm(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("You must agree to the terms to continue.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    if (!selectedCompany) {
      alert("Vui lòng chọn hoặc thêm một công ty!");
      return;
    }

    const dataToSubmit = {
      email: formData.email,
      fullName: formData.fullName,
      password: formData.password,
      phone: formData.phone,
      role: "ROLE_RECRUITER",
      companyId: selectedCompany,
      businessLicense: imagesCompany
    };

    try {
      const result = await signUpUser(dataToSubmit);
      alert("Đăng ký thành công!");
      selectRef.current.disabled = false;
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'ROLE_RECRUITER',
        companyName: '',
        companySize: '',
        industry: '',
        website: '',
        description: '',
        province: '',
        district: '',
        companyLogo: '',
      });
      console.log("Response:", result);
    } catch (error) {
      console.error("Error:", error);
      alert(`Đăng ký thất bại: ${error.message || error}`);
    }
  };

  const handleAddCompany = async () => {
    if (!companyName || !selectedProvince || !selectedDistrict || !industry) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const newCompany = {
        name: companyName,
        location: `${address}, ${selectedDistrict},${selectedProvince}`,
        images,
        description,
        website,
        industry,
        companySize,
      };

      const response = await addCompany(newCompany);
      alert("Thêm công ty thành công!");
      setShowAddCompanyForm(false)
      const createdCompanyId = response.data.id;
      setSelectedCompany(createdCompanyId);
      if (selectRef.current) {
        selectRef.current.disabled = true;
      }
      setCompanyName("")
      setSelectedProvince("")
      setDistricts("")
      setImages("")
      setDescription("")
      setWebsite("")
      setIndustry("")
      setCompanySize("")
      setAddress("")
    } catch (error) {
      console.error("Lỗi khi thêm công ty:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };


  const handleUpload = async (e) => {
    const file = (e.target.files[0]);
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    try {
      const result = await uploadImage(file);
      if (result.error) {
        alert(`Upload failed: ${result.error}`);
      } else {
        setImages(result.data);
        alert("Upload successfull!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  const handleUploadCompanyProof = async (e) => {
    const file = (e.target.files[0]);
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setCompanyProofPreview(previewUrl);
    try {
      const result = await uploadImage(file);
      if (result.error) {
        alert(`Upload failed: ${result.error}`);
      } else {
        setImageCompany(result.data);
        alert("Upload successfull!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  console.log("COMPANY", companies)
  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex flex-col justify-start items-center w-full md:w-2/3 lg:w-2/3 bg-white p-8 pt-12 overflow-y-auto">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Đăng ký tài khoản Nhà tuyển dụng
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng.
        </p>

        <div className="w-3/4 bg-green-100 border border-green-500 p-4 rounded-lg mb-6">
          <h2 className="text-green-700 font-semibold mb-2">Quy định</h2>
          <p className="text-sm text-gray-700">
            Để đảm bảo chất lượng dịch vụ, chúng tôi không cho phép một người dùng tạo nhiều tài khoản khác nhau.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-3/4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tài khoản</h3>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={() => setAgreedToTerms(!agreedToTerms)}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">
              Tôi đã đọc và đồng ý với{" "}
              <span className="text-blue-500 underline cursor-pointer">Điều khoản dịch vụ</span>{" "}
              và <span className="text-blue-500 underline cursor-pointer">Chính sách bảo mật</span>.
            </label>
          </div>

          {/* <button
            type="button"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
          >
            Đăng ký bằng Google
          </button> */}
          {/* <p className="text-center text-sm text-gray-500 mb-4">Hoặc bằng email</p> */}

          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email đăng nhập"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 border rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu ít nhất 6 kí tự"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 border rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 border rounded-lg text-sm"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-6">Thông tin nhà tuyển dụng</h3>
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 border rounded-lg text-sm"
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Số điện thoại cá nhân"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 border rounded-lg text-sm"
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon
              icon={faBuilding}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              ref={selectRef}
              className="w-full pl-10 p-3 border rounded-lg text-sm bg-white"
              disabled={loadingCompanies}
            >
              <option value="">
                {loadingCompanies ? "Đang tải danh sách công ty..." : "Chọn công ty"}
              </option>
              {companies.map((company, index) => (
                <option key={index} value={company.id}>
                  {company.name}
                </option>
              ))}
              <option value="Khác">Khác</option>
            </select>
          </div>
          {showAddCompanyForm && (
            <div className="flex flex-col gap-4 mt-4">
              <label
                htmlFor="file-upload"
                className="left-10 transform text-gray-400 text-sm"
              >
                Minh chứng công ty
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCompanyProof}
                  className="pl-10 p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                {companyProofPreview && (
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm mb-2">Minh chứng công ty:</p>
                    <img
                      src={companyProofPreview}
                      alt="Company Proof Preview"
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {showAddCompanyForm && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={!selectedProvince}
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
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ cụ thể"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                  required
                />
              </div>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Tên công ty"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  className="left-10 transform text-gray-400 text-sm"
                >
                  Logo công ty
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="pl-10 p-3 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm mb-2">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <textarea
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                />
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                  pattern="^(https?|ftp)://.+$"
                />
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faIndustry}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Ngành nghề"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                  required
                />
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="number"
                  placeholder="Quy mô công ty (số lượng nhân viên)"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="pl-10 p-3 border rounded-lg text-sm w-full"
                />
              </div>

              <button
                onClick={handleAddCompany}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                disabled={
                  !companyName ||
                  !selectedProvince ||
                  !selectedDistrict ||
                  !industry ||
                  loading
                }
              >
                {loading ? "Đang thêm..." : "Thêm công ty"}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-6"
          >
            Hoàn tất
          </button>
          <div className="mt-6 text-center">
            Bạn đã có tài khoản ?
            <Link to={"/dang-nhap"} className="text-green-600"> Đăng nhập ngay</Link>
          </div>
        </form>
      </div>
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center min-h-screen"
        style={{ backgroundImage: "url('register.webp')" }}
      ></div>
    </div>
  );
};

export default EmployerRegistrationForm;
