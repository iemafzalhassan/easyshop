import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { formatCurrency } from '../../utils/format';

interface RevenueChartProps {
    data: {
        date: string;
        revenue: number;
        orders: number;
    }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const theme = useTheme();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(1),
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius
                }}>
                    <p style={{ margin: 0, color: theme.palette.text.primary }}>{label}</p>
                    <p style={{ margin: 0, color: theme.palette.primary.main }}>
                        Revenue: {formatCurrency(payload[0].value)}
                    </p>
                    <p style={{ margin: 0, color: theme.palette.secondary.main }}>
                        Orders: {payload[1].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                    dataKey="date"
                    stroke={theme.palette.text.secondary}
                    style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                    yAxisId="left"
                    stroke={theme.palette.primary.main}
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={theme.palette.secondary.main}
                    style={{ fontSize: '0.75rem' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                    dot={false}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke={theme.palette.secondary.main}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
