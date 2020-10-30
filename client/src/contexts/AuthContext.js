import React, { createContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'django-react-boilerplate-token';
const USER_KEY = 'django-react-boilerplate-user';

const AuthContext = createContext({
    token: null,
    user: null,
});

const AuthProvider = (props) => {
    const [token, setToken] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        if (localStorage.getItem(TOKEN_KEY)) {
            setToken(localStorage.getItem(TOKEN_KEY));
        }
        if (localStorage.getItem(USER_KEY)) {
            setUser(JSON.parse(localStorage.getItem(USER_KEY)));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }, [token, user]);

    const onLoginSuccess = (data) => {
        setToken(data.token);
        setUser(data.user);
    };

    const onLogoutSuccess = () => {
        setToken(null);
        setUser(null);
    };

    const onUpdateSuccess = (data) => {
        setUser(data);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                onLoginSuccess,
                onLogoutSuccess,
                onUpdateSuccess,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
