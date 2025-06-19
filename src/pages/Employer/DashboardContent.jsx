import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const DashboardContent = () => {
    const {
        jobsPerMonthData,
        applicationsPerMonthData,
        applicationsByJobData,
        formatXAxisTick,
        isLoading,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        loadApplicationsPerMonth,
        userId
    } = useOutletContext();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleMonthChange = (e) => {
        const month = e.target.value === "" ? null : parseInt(e.target.value, 10);
        setSelectedMonth(month);
    };

    const handleYearChange = (e) => {
        const year = e.target.value === "" ? null : parseInt(e.target.value, 10);
        setSelectedYear(year);
    };



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Đang tải dữ liệu biểu đồ...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md col-span-full">
                <h2 className="text-lg font-semibold mb-4">Số lượng đơn ứng tuyển theo tháng</h2>

                <div className="flex gap-4 mb-4">
                    <select
                        value={selectedMonth === null ? "" : selectedMonth}
                        onChange={handleMonthChange}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Tất cả tháng</option>
                        {months.map((month) => (
                            <option key={month} value={month}>
                                Tháng {month}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear === null ? "" : selectedYear}
                        onChange={handleYearChange}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Tất cả năm</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                Năm {year}
                            </option>
                        ))}
                    </select>
                </div>

                {applicationsPerMonthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={applicationsPerMonthData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="object" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" name="Số đơn ứng tuyển" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500">
                        Không có dữ liệu đơn ứng tuyển cho lựa chọn này.
                    </p>
                )}
            </div>

            {/* Applications by Job Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md col-span-full">
                <h2 className="text-lg font-semibold mb-4">Số lượng đơn ứng tuyển theo công việc</h2>
                {applicationsByJobData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={applicationsByJobData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="object"
                                type="category"
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                                tickFormatter={formatXAxisTick}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#ffc658" name="Số đơn ứng tuyển" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500">Không có dữ liệu đơn ứng tuyển theo công việc.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardContent;