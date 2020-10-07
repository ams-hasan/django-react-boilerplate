import React, { createContext, useState } from 'react';

const TOKEN_KEY = 'django-react-boilerplate-token';
const ME_KEY = 'django-react-boilerplate-me';

const AuthContext = createContext({
    token: null,
    me: null,
});

const AuthProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
    const [me, setMe] = useState(localStorage.getItem(ME_KEY) || null);

    const onLoginSuccess = (data) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(ME_KEY, data.user);
        setToken(data.token);
        setMe(data.user);
    };

    const onLogoutSuccess = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ME_KEY);
        setToken(null);
        setMe(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                me,
                onLoginSuccess,
                onLogoutSuccess,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
