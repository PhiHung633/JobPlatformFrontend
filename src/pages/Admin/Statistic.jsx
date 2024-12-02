import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent } from '@mui/material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { messaging } from '../../utils/firebase.js'
import { getToken, onMessage } from "firebase/messaging";


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
import { getOverallStatistics, getTopApplicationsStatistics, getTopJobsStatistics, getCountStatusApplications } from '../../utils/ApiFunctions';

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



    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Job Applications Submitted",
                data: [10, 25, 15, 30, 40, 20, 50],
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)", // Area under the curve color
                tension: 0, // Curve smoothness
            },
            {
                label: "New Job Postings",
                data: [5, 15, 10, 20, 35, 25, 45],
                borderColor: "rgba(153,102,255,1)",
                backgroundColor: "rgba(153,102,255,0.2)",
                tension: 0.4,
            },
        ],
    };

    // Chart options
    const options = {
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
                bottom: 30, // Add padding to ensure space for labels
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: (value, index, values) => {
                        // This ensures long labels don't overlap
                        return value.length > 5 ? value.slice(0, 3) + "..." : value;
                    },
                },
                title: {
                    display: true,
                    text: "Months", // Add a title for the X-axis
                },
            },
        },
    };


    const loadOverallData = async (days) => {
        const { data, error } = await getOverallStatistics(days)
        if (data) {
            const updatedCardData = [
                { label: 'TIN TUYỂN DỤNG', value: data.numberOfJobs || 0 },
                { label: 'ĐƠN ỨNG TUYỂN', value: data.numberOfApplications || 0 },
                { label: 'NGƯỜI DÙNG MỚI', value: data.numberOfNewMembers || 0 },
                { label: '...', value: 0 }, // Placeholder for additional data
            ];
            setCardData(updatedCardData);
        }
        else {
            console.log(error)
        }
    }

    const loadTopJobsData = async (days) => {
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
    }

    const loadTopApplicationsData = async (days) => {
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
    }

    const loadApplicationStatusStatistics = async (days) => {
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
    }


    useEffect(() => {
        loadOverallData(timeRange)
        loadTopJobsData(timeRange)
        loadTopApplicationsData(timeRange)
        loadApplicationStatusStatistics(timeRange)

    }, [timeRange])


    const handleTimeRangeChange = (selectedRange) => {
        setTimeRange(selectedRange);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <TimeSelector onTimeRangeChange={handleTimeRangeChange} />
            {/* Header Cards */}
            <Grid container spacing={2}>
                {cardData.map((card, index) => (
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
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>

                {/* Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ngành được ứng tuyển nhiều nhất
                            </Typography>
                            <Bar data={topApplications} />
                        </CardContent>
                    </Card>
                </Grid>


                {/* Most Active Classes */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ngành được tuyển dụng nhiều nhất
                            </Typography>
                            <Bar
                                data={{
                                    labels: topJobs.labels,
                                    datasets: topJobs.datasets,
                                }}
                                options={{ indexAxis: 'y' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                {/* Progress Breakdown */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent >
                            <Typography variant="h6" gutterBottom>
                                Tỉ lệ tình trạng nộp đơn
                            </Typography>
                            <Doughnut data={applicationStatus} />
                        </CardContent>
                    </Card>
                </Grid>
                {/* Doughnut Chart */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent style={{ height: "518px", width: "100%" }}>
                            <Typography variant="h6" gutterBottom>
                                Time on Site Breakdown
                            </Typography>
                            {/* <Doughnut data={doughnutData} /> */}
                            <Line data={data} options={options} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
