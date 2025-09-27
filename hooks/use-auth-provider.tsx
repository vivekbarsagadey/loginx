
import React from 'react';

export const AuthContext = React.createContext<{user: any, setUser: any}>({user: null, setUser: () => {}});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = React.useState(null);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
