import {
    createContext
} from "react";

import { User } from "@/schemas/user";

const userDataContext = createContext<User | undefined>(undefined);

export default userDataContext;
