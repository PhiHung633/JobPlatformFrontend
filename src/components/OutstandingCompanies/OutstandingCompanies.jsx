import { useNavigate } from 'react-router-dom';

const CompanyOutstanding = ({companies}) => {
    const navigate = useNavigate();
    console.log("COMPANYNE",companies)
    

    const navigateToDetails = (companyId) => {
        navigate(`/cong-ti/${companyId}`);
    };

    return (
        <div className="py-10">
            <h2 className="text-3xl font-bold text-center mb-10">DANH SÁCH CÁC CÔNG TY NỔI BẬT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-white rounded-xl border w-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        onClick={() => navigateToDetails(company.id)}
                    >
                        <img
                            src={"/banner_company.webp"}
                            alt={`${company.name} banner`}
                            className="w-full h-[200px] object-cover rounded-t-xl"
                        />
                        <div className="p-5">
                            <div className="flex items-center mb-3">
                                <img
                                    src={company.images}
                                    alt={`${company.name} logo`}
                                    className="w-12 h-12 mr-3 rounded-full object-contain"
                                />
                                <h3 className="text-lg font-semibold">{company.name}</h3>
                            </div>
                            <p className="text-gray-600 text-sm break-words">{company.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyOutstanding;
