import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { type StatusDataType } from "../../pages/DashboardPage/useStatusBreakdown";
import { capitalizeString } from "../../lib/string";

type CustomTooltipType = {
    active?: boolean;
    payload?: Array<{ payload: StatusDataType }>;
};

const CustomTooltip = ({ active, payload }: CustomTooltipType) => {
    if (!active || !payload?.length) return null;
    const { status, count, fill } = payload[0].payload;
    return (
        <div className="status-breakdown-chart__tooltip">
            <span
                className="status-breakdown-chart__tooltip-dot"
                style={{ backgroundColor: fill }}
            />
            <span className="status-breakdown-chart__tooltip-label">
                {capitalizeString(status)}
            </span>
            <span className="status-breakdown-chart__tooltip-count">
                {count} {count === 1 ? "game" : "games"}
            </span>
        </div>
    );
};

const CustomLegend = ({ data }: { data: StatusDataType[] }) => (
    <ul className="status-breakdown-chart__legend">
        {data.map(({ status, count, fill }) => (
            <li
                key={status}
                className="status-breakdown-chart__legend-item"
            >
                <span
                    className="status-breakdown-chart__legend-dot"
                    style={{ backgroundColor: fill }}
                />
                <span className="status-breakdown-chart__legend-label">
                    {capitalizeString(status)}
                </span>
                <span className="status-breakdown-chart__legend-count">{count}</span>
            </li>
        ))}
    </ul>
);

type StatusBreakdownChartProps = {
    data: StatusDataType[];
};

const StatusBreakdownChart = ({ data }: StatusBreakdownChartProps) => {
    return (
        <div className="status-breakdown-chart">
            <h2 className="status-breakdown-chart__title">Library Status Breakdown</h2>
            <div className="status-breakdown-chart__body">
                <ResponsiveContainer
                    width="100%"
                    height={220}
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="status"
                            innerRadius="65%"
                            outerRadius="100%"
                            paddingAngle={4}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <CustomLegend data={data} />
            </div>
        </div>
    );
};

export default StatusBreakdownChart;
