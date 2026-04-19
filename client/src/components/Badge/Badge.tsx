import { capitalizeString } from "../../lib/string";
import { type Status } from "../../../../packages/types/UserLibrary";

type BadgeType = {
    status: Status;
};

const Badge = ({ status }: BadgeType) => {
    return status && <span className={`badge badge__${status}`}>{capitalizeString(status)}</span>;
};

export default Badge;
