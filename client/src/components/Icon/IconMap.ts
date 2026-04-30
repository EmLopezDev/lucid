import {
    type LucideIcon,
    Trash2,
    Plus,
    ArrowRight,
    ArrowLeft,
    Search,
    X,
    Check,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export const iconRegistry = {
    trash: Trash2,
    plus: Plus,
    "arrow-right": ArrowRight,
    "arrow-left": ArrowLeft,
    search: Search,
    close: X,
    check: Check,
    alert: AlertCircle,
    info: Info,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
