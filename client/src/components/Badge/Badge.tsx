import { capitalizeString } from "../../lib/string";
import { type StatusType } from "../../../../packages/types";

type BadgeType = {
    status: StatusType;
};

const Badge = ({ status }: BadgeType) => {
    return status && <span className={`badge badge__${status}`}>{capitalizeString(status)}</span>;
};

export default Badge;
