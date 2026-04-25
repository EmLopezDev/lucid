import { type Dispatch, type ReactNode, type SetStateAction, useState } from "react";
import { UserContext } from "./useUserContext";
import { type UserType } from "../../../../packages/types";

export interface UserContextType {
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    isUserAuthenticated: boolean;
}

// TODO: Remove demoUser and set user state to null, this is just to avoid having to signin all the time
// const demoUser: UserType = {
//     _id: "12345",
//     first_name: "Emmanuel",
//     last_name: "Lopez",
//     email: "elopez1@gmail.com",
//     created_at: new Date(),
//     updated_at: null,
//     deleted_at: null,
// };

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);

    const isUserAuthenticated = !!user;

    const contextValue = {
        user,
        setUser,
        isUserAuthenticated,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
