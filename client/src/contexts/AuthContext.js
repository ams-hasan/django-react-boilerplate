import React, { createContext, useState } from 'react';

const TOKEN_KEY = 'django-react-boilerplate-token';
const USER_KEY = 'django-react-boilerplate-user';

const AuthContext = createContext({
    token: null,
    user: null,
});

const AuthProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
    const [user, setUser] = useState(localStorage.getItem(USER_KEY) || null);

    const onLoginSuccess = (data) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, data.user);
        setToken(data.token);
        setUser(data.user);
    };

    const onLogoutSuccess = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                onLoginSuccess,
                onLogoutSuccess,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
