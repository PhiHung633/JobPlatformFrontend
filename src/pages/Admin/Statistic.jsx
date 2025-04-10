import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, CircularProgress  } from '@mui/material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import TimeSelector from '../../components/Admin/SelectTime'
import {
    getOverallStatistics, getTopApplicationsStatistics,
    getTopJobsStatistics, getCountStatusApplications, getDataThroughTime
} from '../../utils/ApiFunctions';

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement, LineElement,
);
ChartJS.register(ArcElement);


const Dashboard = () => {
    // Loading states
    const [loadingOverall, setLoadingOverall] = useState(true);
    const [loadingTopJobs, setLoadingTopJobs] = useState(true);
    const [loadingTopApplications, setLoadingTopApplications] = useState(true);
    const [loadingApplicationStatus, setLoadingApplicationStatus] = useState(true);
    const [loadingThroughTime, setLoadingThroughTime] = useState(true);

    const [timeRange, setTimeRange] = useState(30);
    const [cardData, setCardData] = useState([
        { label: 'TIN TUYỂN DỤNG', value: 0 },
        { label: 'ĐƠN ỨNG TUYỂN', value: 0 },
        { label: 'NGƯỜI DÙNG MỚI', value: 0 },
        { label: '...', value: 0 },
    ]);
    const [topJobs, setTopJobs] = useState({
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [
            {
                label: 'Số tin tuyển dụng',
                data: [50, 40, 30, 20, 10],
                backgroundColor: '#8884D8',
            },
        ],
    });
    const [topApplications, setTopApplications] = useState({
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [
            {
                label: 'Số lượng ứng viên',
                data: [60, 80, 70, 90, 180],
                backgroundColor: '#FFC107',
            },
        ],
    });
    const [applicationStatus, setApplicationStatus] = useState({
        labels: ['Đang chờ', 'Bị từ chối', 'Được phỏng vấn', 'Được chấp nhận'],
        datasets: [
            {
                data: [20, 10, 30, 25],
                backgroundColor: ['#FFBB28', '#00C49F', '#8884D8', '#36A2EB'],
            },
        ],
    });
    const [dataThroughTime, setDataThroughTime] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Số đơn ứng tuyển",
                data: [10, 25, 15, 30, 40, 20, 50],
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.2,
            },
            {
                label: "Số tin tuyển dụng",
                data: [5, 15, 10, 20, 35, 25, 45],
                borderColor: "rgba(153,102,255,1)",
                backgroundColor: "rgba(153,102,255,0.2)",
                tension: 0.2,
            },
        ],
    }
    );
    const [options, setOptions] = useState({
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "top",
            },

        },
        layout: {
            padding: {
                top: 10,
                bottom: 30,
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: (value, index) => {
                        const array = ["1", "2", "3", "4", "5", "6", "7"]
                        return array[index];
                    },
                },
                title: {
                    display: true,
                    text: "Thời gian", // Add a title for the X-axis
                },
            },
        },
    });

    const loadOverallData = async (days) => {
        setLoadingOverall(true);
        const { data, error } = await getOverallStatistics(days)
        if (data) {
            const updatedCardData = [
                { label: 'TIN TUYỂN DỤNG', value: data.numberOfJobs || 0 },
                { label: 'ĐƠN ỨNG TUYỂN', value: data.numberOfApplications || 0 },
                { label: 'NHÀ TUYỂN DỤNG', value: data.numberOfJobSeekers || 0 },
                { label: 'NGƯỜI TÌM VIỆC', value: data.numberOfRecruiters || 0 },
            ];
            setCardData(updatedCardData);
        }
        else {
            console.log(error)
        }
        setLoadingOverall(false);
    }

    const loadTopJobsData = async (days) => {
        setLoadingTopJobs(true);
        const { data, error } = await getTopJobsStatistics(days)
        if (data) {
            const updatedData = {
                labels: data.map((item) => item.object),
                datasets: [
                    {
                        label: 'Số tin tuyển dụng',
                        data: data.map((item) => item.count),
                        backgroundColor: '#8884D8',
                    },
                ],
            };

            setTopJobs(updatedData);
        }
        else {
            console.log(error)
        }
        setLoadingTopJobs(false);

    }

    const loadTopApplicationsData = async (days) => {
        setLoadingTopApplications(true);
        const { data, error } = await getTopApplicationsStatistics(days)
        if (data) {
            const updatedData = {
                labels: data.map((item) => item.object),
                datasets: [
                    {
                        label: 'Số lượng ứng viên',
                        data: data.map((item) => item.count),
                        backgroundColor: '#FFC107',
                    },
                ],
            };

            setTopApplications(updatedData);
        }
        else {
            console.log(error)
        }
        setLoadingTopApplications(false);
    }

    const loadApplicationStatusStatistics = async (days) => {
        setLoadingApplicationStatus(true);
        const labelMap = {
            PENDING: 'Đang chờ',
            REJECTED: 'Bị từ chối',
            INTERVIEWING: 'Được phỏng vấn',
            ACCEPTED: 'Được chấp nhận',
        };

        const dataValue = {
            PENDING: 0,
            REJECTED: 0,
            INTERVIEWING: 0,
            ACCEPTED: 0,
        };

        const { data, error } = await getCountStatusApplications(days)
        if (data) {

            data.forEach(({ object, count }) => {
                dataValue[object] = count;
            });

            const updatedData = {
                labels: Object.values(labelMap),
                datasets: [
                    {
                        label: 'Số lượng ứng viên',
                        data: Object.keys(labelMap).map((key) => dataValue[key]),
                        backgroundColor: ['#36A2EB', '#D2042D', '#8884D8', '#00C49F'],
                    },
                ],
            };

            setApplicationStatus(updatedData);
        }
        else {
            console.log(error)
        }
        setLoadingApplicationStatus(false);
    }

    const loadDataThroughTime = async (days) => {
        setLoadingThroughTime(true);
        const { data, error } = await getDataThroughTime(days)

        if (data) {
            const applications = data[0].map(item => item.count);
            const jobs = data[1].map(item => item.count);


            console.log(applications)

            const label = data[0].map(item => item.object);

            const dataK = {
                labels: label,
                datasets: [
                    {
                        label: "Số đơn ứng tuyển",
                        data: [...applications],
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        tension: 0.2
                    },
                    {
                        label: "Số tin tuyển dụng",
                        data: [...jobs],
                        borderColor: "rgba(153,102,255,1)",
                        backgroundColor: "rgba(153,102,255,0.2)",
                        tension: 0.2
                    }
                ]
            };

            const newOptions = {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "top",
                    },

                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 30,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            callback: (value, index) => {
                                const array = label
                                return array[index];
                            },
                        },
                        title: {
                            display: true,
                            text: "Thời gian",
                        },
                    },
                },
            };

            setDataThroughTime(dataK);
            setOptions(newOptions);
        }
        else {
            console.log(error)
        }
        setLoadingThroughTime(false);

    }



    useEffect(() => {
        loadOverallData(timeRange)
        loadTopJobsData(timeRange)
        loadTopApplicationsData(timeRange)
        loadApplicationStatusStatistics(timeRange)
        loadDataThroughTime(timeRange)

    }, [timeRange])


    const handleTimeRangeChange = (selectedRange) => {
        setTimeRange(selectedRange);
    };

    // console.log(dataThroughTime)
    return (
        <Box sx={{ padding: 2 }}>
            <TimeSelector onTimeRangeChange={handleTimeRangeChange} />
            <Grid container spacing={2}>
                {/* Overall Stats */}
                {loadingOverall ? (
                    <CircularProgress />
                ) : (
                    cardData.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" align="center">
                                        {card.value}
                                    </Typography>
                                    <Typography variant="subtitle1" align="center" color="textSecondary">
                                        {card.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Top Applications */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ngành được ứng tuyển nhiều nhất
                            </Typography>
                            {loadingTopApplications ? <CircularProgress /> : <Bar data={topApplications} />}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Jobs */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ngành được tuyển dụng nhiều nhất
                            </Typography>
                            {loadingTopJobs ? <CircularProgress /> : <Bar data={topJobs} options={{ indexAxis: 'y' }} />}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Application Status */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tỉ lệ tình trạng nộp đơn
                            </Typography>
                            {loadingApplicationStatus ? <CircularProgress /> : <Doughnut data={applicationStatus} />}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Data Through Time */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Xu hướng tuyển dụng và việc làm
                            </Typography>
                            {loadingThroughTime ? <CircularProgress /> : <Line data={dataThroughTime} options={options} />}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
