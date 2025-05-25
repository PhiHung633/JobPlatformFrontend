import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CompanyOutstanding from '../../components/OutstandingCompanies/OutstandingCompanies';
import { fetchAllCompanies } from '../../utils/ApiFunctions';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Company = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch companies
    const loadCompanies = async (searchTerm = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await fetchAllCompanies(searchTerm, 1);
            if (error) {
                setError(error);
            } else {
                setCompanies(data);
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(`Lỗi: ${error}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [error]);

    const handleSearch = () => {
        loadCompanies(searchTerm);
    };
    return (
        <div className="px-20 py-10 bg-gradient-to-b from-green-100 to-white min-h-screen">
            {/* Tab navigation */}
            <div className="flex mb-6">
                <button
                    className={`mx-4 py-2 font-semibold ${activeTab === 'list' ? 'border-b-4 border-green-600 text-black' : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('list')}
                >
                    Danh sách công ty
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập tên công ty"
                            className="p-3 w-full border-none outline-none rounded-3xl pl-10"
                        />
                    </div>
                    <button
                        className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 whitespace-nowrap"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>
            <div>
                {activeTab === 'list' && (
                    <div>
                        <CompanyOutstanding companies={companies} isLoading={isLoading} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Company;
