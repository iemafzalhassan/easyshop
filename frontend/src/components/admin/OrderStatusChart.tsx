import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface OrderStatusChartProps {
    data: {
        status: string;
        count: number;
    }[];
}

export const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
    const theme = useTheme();

    const COLORS = {
        confirmed: theme.palette.info.main,
        processing: theme.palette.warning.main,
        shipped: theme.palette.primary.main,
        delivered: theme.palette.success.main,
        cancelled: theme.palette.error.main
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        p: 1,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1
                    }}
                >
                    <Typography variant="body2" color="text.primary">
                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Count: {data.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.percentage.toFixed(1)}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    // Calculate percentages and total
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const dataWithPercentage = data.map(item => ({
        ...item,
        percentage: (item.count / total) * 100
    }));

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={dataWithPercentage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                    >
                        {dataWithPercentage.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.status as keyof typeof COLORS]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) =>
                            value.charAt(0).toUpperCase() + value.slice(1)
                        }
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};
