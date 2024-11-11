import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartLine, faCircle, faCircleCheck, faClock, faDollar, faHeart, faLocationDot, faMagnifyingGlass, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'

import './ITJobs.css'
import { useState } from 'react'

const ITJobs = () => {
  const options = [
    'Tất cả lĩnh vực',
    'Agency(Design / Development)',
    'Agency(Marketing / Advertising)',
    'Bán lẻ - Hàng tiêu dùng - FMCG',
    'Bảo hiểm',
    'Bảo trì / Sửa chữa',
    'Bất động sản',
    'Chứng khoán',
    'Cơ khí',
    'Cơ quan nhà nước',
    'Du lịch',
    'Dược phẩm / Y tế / Công nghệ',
    'Điện tử / Điện lạnh',
    'Giải trí',
    'Giáo dục / Đào tạo',
    'In ấn / Xuất bản',
    'Internet / Online',
    'IT - Phần cứng',
    'IT - Phần mềm',
    'Kế toán / Kiểm toán',
    'Khác',
    'Logistics - Vận tải',
    'Luật',
    'Marketing / Truyền thông / Quảng cáo',
    'Môi trường',
    'Năng lượng',
    'Ngân hàng',
    'Nhà hàng / Khách sạn',
    'Nhân sự',
    'Nông Lâm Ngư Nghiệp',
    'Sản xuất',
    'Tài chính',
    'Thiết kế / kiến trúc',
    'Thời trang',
    'Thương mại điện tử',
    'Tổ chức phi lợi nhuận',
    'Tự động hóa',
    'Tư vấn',
    'Viễn thông',
    'Xây dựng',
    'Xuất nhập khẩu',
  ]
  const options2 = [
    'Tất cả cấp bậc',
    'Nhân viên',
    'Trưởng nhóm',
    'Trưởng/Phó phòng',
    'Quản lý / Giám sát',
    'Trưởng chi nhánh',
    'Phó giám đốc',
    'Giám đốc',
    'Thực tập sinh'
  ]
  const options3 = [
    'Tất cả mức lương',
    'Dưới 10 triệu',
    '10 - 15 triệu',
    '15 - 20 triệu',
    '20 - 25 triệu',
    '25 - 30 triệu',
    '30 - 50 triệu',
    'Trên 50 triệu',
    'Thỏa thuận'
  ]
  const [selectedOption, setSelectedOption] = useState({
    category: options[0],
    level: options2[0],
    salary: options3[0]
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    category: false,
    level: false,
    salary: false
  });
  const [sortOption, setSortOption] = useState('Tin mới nhất');
  const sortOptions = ['Tin mới nhất', 'Cần tuyển gấp', 'Lương cao nhất'];
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [dropdown]: !prevState[dropdown]
    }))
  };
  const handleOptionClick = (dropdown, option) => {
    setSelectedOption(prevState => ({
      ...prevState,
      [dropdown]: option
    }));
    setDropdownOpen(prevState => ({
      ...prevState,
      [dropdown]: false
    }))
  };
  return (
    <div className='it-jobs'>
      <div className='it-jobs-banner'>
        <div className='it-jobs-banner-content'>
          <h1 className='content-title'>Việc làm IT</h1>
          <p className='content-description'>Việc làm IT xịn dành cho Developer</p>
        </div>
        <div className='it-jobs-banner-label-tag'>
          <label className='label-tag-label-remote'>
            <FontAwesomeIcon icon={faCircleCheck} />
            Backend
          </label>
          <label className='label-tag-label-remote'>
            <FontAwesomeIcon icon={faCircleCheck} />
            Frontend
          </label>
          <label className='label-tag-label-remote'>
            <FontAwesomeIcon icon={faCircleCheck} />
            Tester
          </label>
          <label className='label-tag-label-remote'>
            <FontAwesomeIcon icon={faCircleCheck} />
            Business Analyst
          </label>
        </div>
      </div>
      <div className='it-jobs-box-search'>
        <form id='it-jobs-box-search-job' className='it-jobs-box-search-job'>
          <div className='box-search-job-input-data'>
            <span className='input-data-icon'>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input className='input-data-text' type='text' placeholder='Tên công việc, vị trí bạn muốn ứng tuyển...' />
          </div>
          <div className='box-search-job-input-category'>
            <span className='input-category-icon'>
              <FontAwesomeIcon icon={faBuilding} />
            </span>
            <div className={`input-category-dropdown ${dropdownOpen.category ? 'open' : ''}`} onClick={() => toggleDropdown('category')}>
              {selectedOption.category}
            </div>
            {dropdownOpen.category && (
              <div className='dropdown-options'>
                {options.map(option => (
                  <div key={option} className='dropdown-option' onClick={() => handleOptionClick('category', option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='box-search-job-input-category'>
            <span className='input-category-icon'>
              <FontAwesomeIcon icon={faChartLine} />
            </span>
            <div className={`input-category-dropdown ${dropdownOpen.level ? 'open' : ''}`} onClick={() => toggleDropdown('level')}>
              {selectedOption.level}
            </div>
            {dropdownOpen.level && (
              <div className='dropdown-options'>
                {options2.map(option => (
                  <div key={option} className='dropdown-option' onClick={() => handleOptionClick('level', option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='box-search-job-input-category'>
            <span className='input-category-icon'>
              <FontAwesomeIcon icon={faMoneyCheckDollar} />
            </span>
            <div className={`input-category-dropdown ${dropdownOpen.salary ? 'open' : ''}`} onClick={() => toggleDropdown('salary')}>
              {selectedOption.salary}
            </div>
            {dropdownOpen.salary && (
              <div className='dropdown-options'>
                {options3.map(option => (
                  <div key={option} className='dropdown-option' onClick={() => handleOptionClick('salary', option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='box-search-job-btn'>
            <button type='submit' className='btn-search-job'>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
      <div className='it-jobs-list-job'>
        <div className='list-job-top-skill'>
          <button className='top-skill-change-skill'>
            Java
            <label className='change-skill-total'>
              136
            </label>
          </button>
          <button className='top-skill-change-skill'>
            Javascript
            <label className='change-skill-total'>
              90
            </label>
          </button>
          <button className='top-skill-change-skill'>
            Python
            <label className='change-skill-total'>
              90
            </label>
          </button>
          <button className='top-skill-change-skill'>
            ReactJS
            <label className='change-skill-total'>
              136
            </label>
          </button>
          <button className='top-skill-change-skill'>
            English
            <label className='change-skill-total'>
              87
            </label>
          </button>
          <button className='top-skill-change-skill'>
            Khác
            <label className='change-skill-total'>
              2656
            </label>
          </button>
        </div>
        <div className='list-job-header'>
          <h2>
            Tìm thấy
            <b className='text-highlight'> 3,3038 </b>
            việc làm phù hợp với yêu cầu của bạn.
          </h2>
        </div>
        <div className='list-job-show-important'>
          <span>Ưu tiên hiển thị:</span>
          {sortOptions.map((option, index) => (
            <div key={index} className='show-important-option-item-sort' onClick={() => handleSortChange(option)}>
              <FontAwesomeIcon icon={sortOption === option ? faCircleCheck : faCircle} className='option-item-sort-icon' />
              <span className='option-item-sort-name-sort'>{option}</span>
            </div>
          ))}
        </div>
        <div className='list-job-body'>
          <div className='job-body-left'>
            <div className='job-body-left-item'>
              <div className='item-box-header'>
                <div className='box-header-avatar'>
                  <a href=''>
                    <img src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/TookgFfkXGVGSlPM3ZImR07Uz4UDNz5U_1681297674____f10a3ab84434a4d2e12e0e24b30090ba.png"
                      alt='' />
                  </a>
                </div>
                <div className='box-header-body'>
                  <div className='body-box-label-top'>
                    <label>TUYỂN SỐ LƯỢNG LỚN</label>
                  </div>
                  <div className='body-title-block'>
                    <h3 className='title'>
                      <a href=''>
                        <span>DevOps Engineer</span>
                      </a>
                    </h3>
                    <label className='title-salary'>16 -19 triệu</label>
                  </div>
                  <a className='body-company'>
                    Công ty TNHH LG CNS VIỆT NAM
                  </a>
                  <label className='body-deadline'> Cập nhật 25 phút trước </label>
                  <div className='body-skill'>
                    <label className='body-skill-item'>Linux</label>
                    <label className='body-skill-item'>CI/CD</label>
                  </div>
                  <div className='body-box-info'>
                    <div className='box-info-label-content'>
                      <label className='label-content-address'>
                        <FontAwesomeIcon className='address-icon' icon={faLocationDot} />
                        Hà Nội
                      </label>
                      <label className='label-content-time'>
                        <FontAwesomeIcon className='address-icon' icon={faClock} />
                        Còn
                        <strong>&nbsp;20&nbsp;</strong>
                        ngày để ứng tuyển
                      </label>
                    </div>
                    <div className='box-info-icon-save'>
                      <button className='btn-apply-now'>
                        <span>Ứng tuyển</span>
                      </button>
                      <div className='box-save-job'>
                        <FontAwesomeIcon icon={faHeart} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='job-body-right'>
            <div className='job-body-right-box'>
              <div className='right-box-interested'>
                <div className='box-maybe-interested'>
                  <h3 className='box-maybe-interested-title'>
                    Có thể bạn quan tâm
                  </h3>
                  <div className='box-maybe-interested-company'>
                    <div className='box-maybe-interested-company-image'>
                      <a href=''>
                        <img src='https://cdn-new.topcv.vn/unsafe/500x/https://static.topcv.vn/company_covers/gWUh7odIskHo6RtZ1xT7.jpg'
                          alt='' />
                      </a>
                    </div>
                    <div className='box-maybe-interested-company-content'>
                      <div className='company-content-info'>
                        <div className='content-info-logo'>
                          <a href=''>
                            <img src='https://static.topcv.vn/company_logos/cong-ty-cho-thue-tai-chinh-tnhh-mtv-quoc-te-chailease-5dc39f3d07275.jpg'
                              alt=''
                            />
                          </a>
                        </div>
                        <div className='content-info-name'>
                          <a href=''>Công ty cho thuê tài chính TNHH MTV Quốc tế Chailease</a>
                        </div>
                      </div>
                      <div className='company-content-job'>
                        <div className='company-content-job-item'>
                          <a href='' className='job-item-name'>Chuyên viên quan hệ khách hàng doanh nghiệp</a>
                          <div className='job-item-info'>
                            <div className='job-item-info-salary'>
                              <FontAwesomeIcon className='job-item-info-salary-icon' icon={faDollar} />
                              <span>Thỏa thuận</span>
                            </div>
                            <div className='job-item-info-address'>
                              <FontAwesomeIcon className='job-item-info-address-icon' icon={faLocationDot} />
                              <span>Cần Thơ & 3 nơi khác</span>
                            </div>
                          </div>
                        </div>
                        <div className='company-content-job-item'>
                          <a href='' className='job-item-name'>Chuyên viên quan hệ khách hàng doanh nghiệp</a>
                          <div className='job-item-info'>
                            <div className='job-item-info-salary'>
                              <FontAwesomeIcon className='job-item-info-salary-icon' icon={faDollar} />
                              <span>Thỏa thuận</span>
                            </div>
                            <div className='job-item-info-address'>
                              <FontAwesomeIcon className='job-item-info-address-icon' icon={faLocationDot} />
                              <span>Cần Thơ & 3 nơi khác</span>
                            </div>
                          </div>
                        </div>
                        <div className='company-content-job-item'>
                          <a href='' className='job-item-name'>Chuyên viên quan hệ khách hàng doanh nghiệp</a>
                          <div className='job-item-info'>
                            <div className='job-item-info-salary'>
                              <FontAwesomeIcon className='job-item-info-salary-icon' icon={faDollar} />
                              <span>Thỏa thuận</span>
                            </div>
                            <div className='job-item-info-address'>
                              <FontAwesomeIcon className='job-item-info-address-icon' icon={faLocationDot} />
                              <span>Cần Thơ & 3 nơi khác</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='company-content-link'>
                        <a href=''>Tìm hiểu ngay</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='job-body-right-top-company-highlight'>
              <hr/>
              <h3 className='top-company-highlight-title'>Top công ty nổi bật</h3>
              <div className='top-company-highlight-list'>
                <div className='list-item'>
                  <a href='' className='list-item-logo'>
                    <img src='https://cdn-new.topcv.vn/unsafe/48x/https://static.topcv.vn/company_logos/fpt-software-6073b38a10cb4.jpg'
                      alt=''
                    />
                  </a>
                  <div className='list-item-info'>
                    <a className='item-info-title' href=''>
                      FPT Software
                    </a>
                    <p className='item-info-count'>72 việc làm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ITJobs
