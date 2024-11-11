
const TopCompanies = () => {
    const companies = [
        {
            id: 1,
            banner: 'https://example.com/fpt-banner.jpg', // URL for the banner image
            name: 'TẬP ĐOÀN FPT',
            description: 'FPT tự hào là tập đoàn công nghệ hàng đầu Việt Nam. FPT sở hữu hạ tầng viễn thông phủ khắp cả nước và nhiều thành tựu khác...',
        },
        {
            id: 2,
            banner: 'https://example.com/vuihoc-banner.jpg',
            name: 'VUIHOC.VN',
            description: 'VUIHOC là trường học trực tuyến cho học sinh từ lớp 1 đến lớp 12 với chất lượng giáo dục cao...',
        },
        {
            id: 3,
            banner: 'https://example.com/sapo-banner.jpg',
            name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ SAPO',
            description: 'Sapo là nền tảng quản lý và bán hàng đa kênh được tin dùng bởi hàng ngàn nhà bán hàng trên cả nước...',
        },
        {
            id: 4,
            banner: 'https://example.com/sapo-banner.jpg',
            name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ SAPO',
            description: 'Sapo là nền tảng quản lý và bán hàng đa kênh được tin dùng bởi hàng ngàn nhà bán hàng trên cả nước...',
        },
        {
            id: 5,
            banner: 'https://example.com/sapo-banner.jpg',
            name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ SAPO',
            description: 'Sapo là nền tảng quản lý và bán hàng đa kênh được tin dùng bởi hàng ngàn nhà bán hàng trên cả nước...',
        },
    ];

    return (
        <div className="py-10">
            <h2 className="text-3xl font-bold text-center mb-10">DANH SÁCH CÁC TOP CÔNG TY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"> {/* Sử dụng CSS Grid */}
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-white rounded-xl border w-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <img
                            src={company.banner}
                            alt={`${company.name} banner`}
                            className="w-full h-[200px] object-cover rounded-t-xl"
                        />
                        <div className="p-5">
                            <div className="flex items-center mb-3">
                                <h3 className="text-lg font-semibold">{company.name}</h3>
                            </div>
                            <p className="text-gray-600 text-sm break-words">
                                {company.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCompanies;
