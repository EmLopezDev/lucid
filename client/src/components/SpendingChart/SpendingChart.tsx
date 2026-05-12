import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import {
    type TimePeriodType,
    type SpendingDataType,
} from "../../pages/DashboardPage/useSpendingChart";

const PERIODS: { label: string; value: TimePeriodType }[] = [
    { label: "All time", value: "all" },
    { label: "12 months", value: "12m" },
    { label: "6 months", value: "6m" },
    { label: "3 months", value: "3m" },
    { label: "30 days", value: "30d" },
];

type SpendingChartType = {
    data: SpendingDataType[];
    period: TimePeriodType;
    onPeriodChange: (period: TimePeriodType) => void;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="spending-chart__tooltip">
            <span className="spending-chart__tooltip-month">{label}</span>
            <span className="spending-chart__tooltip-spent">Spent: ${payload[0]?.value}</span>
            <span className="spending-chart__tooltip-cumulative">Total: ${payload[1]?.value}</span>
        </div>
    );
};

const SpendingChart = ({ data, period, onPeriodChange }: SpendingChartType) => {
    return (
        <div className="spending-chart">
            <div className="spending-chart__header">
                <h2 className="spending-chart__title">Money Spent</h2>
                <div className="spending-chart__filters">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            className={`spending-chart__filter${
                                period === p.value ? " spending-chart__filter--active" : ""
                            }`}
                            onClick={() => onPeriodChange(p.value)}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <ComposedChart
                    data={data}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(127, 119, 221, 0.1)"
                    />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                        tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="spent"
                        fill="var(--color-teal)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Line
                        dataKey="cumulative"
                        stroke="var(--color-brand)"
                        strokeWidth={2}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingChart;
