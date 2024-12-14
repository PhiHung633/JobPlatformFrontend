import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const updateRole = (role) => {
        setCurrentUserRole(role);
        localStorage.setItem("currentUserRole", role);
    };
    console.log("PHAIDUNGCHU",currentUserRole)

    return (
        <AuthContext.Provider value={{ currentUserRole, updateRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
