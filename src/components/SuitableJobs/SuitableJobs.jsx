import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';

const SuitableJobs = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-3xl ml-24">
        <div className='flex items-center mb-5'>
          <div className='text-lg font-bold'>
            <h1 className='bg-gradient-to-r from-[#263238] to-[#00b14f] text-transparent bg-clip-text font-semibold'>
              Việc làm phù hợp với bạn
            </h1>
            <p className='bg-gradient-to-r from-[#263238] to-[#00b14f] text-transparent bg-clip-text text-green-500 font-normal'>
              Khám phá cơ hội việc làm được gợi ý dựa trên mong muốn, kỹ năng và kinh nghiệm của bạn. Hãy đón lấy cơ hội thành công với công việc phù hợp nhất dành cho bạn!
            </p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md mb-4 p-4 group hover:bg-gray-100'>
          <div className='flex'>
            <div className='flex-shrink-0 bg-white rounded-lg h-24 w-24 border border-gray-200 p-2'>
              <img src='https://cdn-new.topcv.vn/unsafe/48x/https://static.topcv.vn/company_logos/knEoM532Wnaz5Cqrr9zdXH3EXv7pKjcz_1640936878____28aa7699c978d978e6fdea04c7e10d89.png' alt='Company Logo' className='h-full w-full object-contain' />
            </div>
            <div className='ml-5 flex-1'>
              <div className='flex items-center justify-between mb-2'>
                <a href='#' className='text-base font-semibold text-gray-900 hover:underline group-hover:text-green-500'>
                  Java/.Net Fresher Developer
                </a>
                <label className='text-green-600 font-semibold text-base'>
                  Tới 35 triệu
                </label>
              </div>
              <div className='text-gray-600 mb-2'>
                <a href='#' className='text-gray-600 hover:underline'>
                  CÔNG TY CỔ PHẦN FUJINET SYSTEMS
                </a>
              </div>
              <div className='text-sm text-gray-500 mb-2'>
                Cập nhật 2 tuần trước
              </div>
              <div className='flex items-center space-x-6'>
                <label className='bg-gray-200 rounded-md text-sm text-gray-600 py-1 px-2'>
                  Hồ Chí Minh
                </label>
                <label className='bg-gray-200 rounded-md text-sm text-gray-600 py-1 px-2'>
                  Còn<strong>&nbsp;12 ngày&nbsp;</strong>để ứng tuyển
                </label>
              </div>
              <div className='ml-auto space-x-3 mt-3 flex justify-end'>
                <button className='bg-green-500 text-white font-bold text-sm h-8 px-4 rounded-md'>
                  Ứng tuyển
                </button>
                <button className='bg-green-100 h-8 w-8 flex items-center justify-center rounded-md'>
                  <FontAwesomeIcon icon={faHeart} className='text-green-500' />
                </button>
                <button className='bg-green-100 h-8 w-8 flex items-center justify-center rounded-md'>
                  <FontAwesomeIcon icon={faTrash} className='text-green-500' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <a href='#' className='bg-green-500 border-green-500 rounded-md text-white py-2.5 px-5 no-underline hover:bg-green-600'>
            Xem tất cả việc làm phù hợp
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuitableJobs;
