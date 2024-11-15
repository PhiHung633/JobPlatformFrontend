import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CompanyOutstanding from '../../components/OutstandingCompanies/OutstandingCompanies';
import TopCompanies from '../../components/TopCompanies/TopCompanies';

const Company = () => {
    const [activeTab, setActiveTab] = useState('list'); // Default to the company list tab

    return (
        <>
            <div className="px-20 py-10 bg-gradient-to-b from-green-100 to-white min-h-screen">
                {/* Tab navigation */}
                <div className="flex mb-6">
                    <button
                        className={`mx-4 py-2 font-semibold ${activeTab === 'list' ? 'border-b-4 border-green-600 text-black' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Danh sách công ty
                    </button>
                    <button
                        className={`mx-4 py-2 font-semibold ${activeTab === 'top' ? 'border-b-4 border-green-600 text-black' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('top')}
                    >
                        Top công ty
                    </button>
                </div>
                <div className="ml-4">
                    <h2 className="text-2xl font-bold mb-4 text-green-600">Khám phá 100.000+ công ty nổi bật</h2>
                    <p className="text-gray-600 mb-6">
                        Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn
                    </p>

                    {/* Search input */}
                    <div className="flex justify-between items-center mb-10 bg-white w-[40%] rounded-3xl px-5 hover:border hover:border-green-500 transition duration-200">
                        <div className="relative w-full">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nhập tên công ty"
                                className="p-3 w-full border-none outline-none rounded-3xl pl-10"
                            />
                        </div>
                        <button className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 whitespace-nowrap">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div>
                    {activeTab === 'list' && (
                        <div>
                            <CompanyOutstanding/>
                        </div>
                    )}
                    {activeTab === 'top' && (
                        <div>
                            <TopCompanies/>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default Company;
