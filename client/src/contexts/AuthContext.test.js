import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';

const tokenKey = 'django-react-boilerplate-token';
const userKey = 'django-react-boilerplate-user';

const data = {
    user: {
        id: 9,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@mail.com',
    },
    token: 'test token',
};

test('AuthProvider gets user data from localStorage', async () => {
    localStorage.setItem(tokenKey, data.token);
    localStorage.setUser(userKey, data.user);
    const { container } = render(
        <AuthProvider>
            <AuthContext.Consumer>
                {({ token, user }) => <div>{`${token}-${user.email}`}</div>}
            </AuthContext.Consumer>
        </AuthProvider>
    );
    expect(container.innerHTML).toMatch(`${data.token}-${data.user.email}`);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
});

test('AuthProvider sets localStorage after login', async () => {
    const { container } = render(
        <AuthProvider>
            <AuthContext.Consumer>
                {({ token, user, onLoginSuccess }) => {
                    onLoginSuccess(data);
                    if (token)
                        return (
                            <div>
                                `${token}-${user.email}`
                            </div>
                        );
                    return <div>No token</div>;
                }}
            </AuthContext.Consumer>
        </AuthProvider>
    );
    expect(container.innerHTML).toMatch(`${data.token}-${data.user.email}`);
    expect(localStorage.getItem(tokenKey)).toBe(data.token);
    expect(localStorage.getItem(userKey).id).toBe(data.user.id);
    expect(localStorage.getItem(userKey).email).toBe(data.user.email);
    expect(localStorage.getItem(userKey).first_name).toBe(data.user.first_name);
    expect(localStorage.getItem(userKey).last_name).toBe(data.user.last_name);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
});

test('AuthProvider should remove user data after logout', async () => {
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(userKey, data.user);
    expect(localStorage.getItem(tokenKey)).toBe(data.token);
    const { container } = render(
        <AuthProvider>
            <AuthContext.Consumer>
                {({ token, user, onLogoutSuccess }) => {
                    onLogoutSuccess();
                    if (token)
                        return (
                            <div>
                                `${token}-${user.email}`
                            </div>
                        );
                    return <div>No token</div>;
                }}
            </AuthContext.Consumer>
        </AuthProvider>
    );
    expect(container.innerHTML).toMatch('No token');
    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(localStorage.getItem(userKey)).toBeNull();
});
