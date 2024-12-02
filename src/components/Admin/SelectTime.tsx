import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

const TimeRangeSelector = ({ onTimeRangeChange }) => {
    const [timeRange, setTimeRange] = useState(30); // Default to "last 30 days"

    const handleChange = (event) => {
        const selectedRange = event.target.value;
        setTimeRange(selectedRange);
        if (onTimeRangeChange) {
            onTimeRangeChange(selectedRange);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
            p={2}
            sx={{
                borderBottom: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography variant="h6">Thống kê</Typography>
            <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel
                    id="time-range-label"
                    sx={{
                        backgroundColor: "#f9f9f9", 
                        px: 0.1, 
                    }}
                    shrink={true} 
                >Thống kê theo</InputLabel>
                <Select
                    labelId="time-range-label"
                    value={timeRange}
                    onChange={handleChange}
                    label="Time range"
                >
                    <MenuItem value={30}>30 ngày qua</MenuItem>
                    <MenuItem value={180}>6 tháng qua</MenuItem>
                    <MenuItem value={365}>Năm qua</MenuItem>
                    <MenuItem value={0}>Toàn bộ thời gian</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default TimeRangeSelector;
