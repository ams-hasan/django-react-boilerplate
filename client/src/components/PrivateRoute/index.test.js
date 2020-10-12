import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './index';
import { renderWithRouter } from '../../utils/testUtils';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => <div>Log in</div>;
const Home = () => <div>Welcome Home</div>;

test('Private Route takes to login page if not logged in', () => {
    const { container } = renderWithRouter(
        <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
        </Switch>
    );
    expect(container.innerHTML).toMatch('Log in');
});

test('Private Route takes to private page if logged in', () => {
    const { container } = renderWithRouter(
        <AuthContext.Provider value={{ token: 'test token' }}>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
        </AuthContext.Provider>
    );
    expect(container.innerHTML).toMatch('Welcome Home');
});
