import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { type GenreDataType } from "@pages/ProfilePage/hooks/useGenreBreakdown";
import { capitalizeString } from "@lib/string";

type CustomTooltipType = {
    active?: boolean;
    payload?: Array<{ payload: GenreDataType }>;
};

const CustomTooltip = ({ active, payload }: CustomTooltipType) => {
    if (!active || !payload?.length) return null;
    const { genre, count, fill } = payload[0].payload;
    return (
        <div className="genre-breakdown-chart__tooltip">
            <span
                className="genre-breakdown-chart__tooltip-dot"
                style={{ backgroundColor: fill }}
            />
            <span className="genre-breakdown-chart__tooltip-label">{capitalizeString(genre)}</span>
            <span className="genre-breakdown-chart__tooltip-count">
                {count} {count === 1 ? "game" : "games"}
            </span>
        </div>
    );
};

const CustomLegend = ({ data }: { data: GenreDataType[] }) => (
    <ul className="genre-breakdown-chart__legend">
        {data.map(({ genre, count, fill }) => (
            <li
                key={genre}
                className="genre-breakdown-chart__legend-item"
            >
                <span
                    className="genre-breakdown-chart__legend-dot"
                    style={{ backgroundColor: fill }}
                />
                <span className="genre-breakdown-chart__legend-label">
                    {capitalizeString(genre)}
                </span>
                <span className="genre-breakdown-chart__legend-count">{count}</span>
            </li>
        ))}
    </ul>
);

type GenreBreakdownChartProps = {
    data: GenreDataType[];
};

const GenreBreakdownChart = ({ data }: GenreBreakdownChartProps) => {
    if (!data.length) return null;
    return (
        <div className="genre-breakdown-chart">
            <h2 className="genre-breakdown-chart__title">Genre Breakdown</h2>
            <div className="genre-breakdown-chart__body">
                <ResponsiveContainer
                    width="100%"
                    height={220}
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="genre"
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

export default GenreBreakdownChart;
