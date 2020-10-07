import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Home} />
                </Switch>
            </AuthProvider>
        </BrowserRouter>
    );
}
