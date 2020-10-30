import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typography, Button, TextField, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
    container: {
        width: '40%',
        margin: '0 auto',
        padding: theme.spacing(2),
    },
    input: {
        marginTop: theme.spacing(2),
    },
}));

export default function Login(props) {
    const loginStatePrimary = {
        email: '',
        password: '',
    };

    const notificationStatePrimary = {
        message: '',
        type: '',
    };

    const classes = useStyles();
    const [values, setValues] = useState(loginStatePrimary);
    const [notification, setNotification] = useState(notificationStatePrimary);
    const { token, onLoginSuccess } = useContext(AuthContext);

    if (token) {
        return <Redirect to="/" />;
    }

    const onInputChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const clearNotifications = () => {
        setNotification(notificationStatePrimary);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:8000/api/auth/login/', values)
            .then((response) => {
                onLoginSuccess(response.data);
                setValues(loginStatePrimary);
            })
            .catch((error) => {
                if (
                    error.response.data &&
                    error.response.data.non_field_errors
                ) {
                    setNotification({
                        message: error.response.data.non_field_errors[0],
                        type: 'error',
                    });
                } else {
                    setNotification({
                        message: "Can't log in with the provided credentials",
                        type: 'error',
                    });
                }
            });
    };

    return (
        <>
            <Navbar />
            {notification.message === '' ? null : (
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={true}
                    autoHideDuration={3000}
                    onClose={clearNotifications}
                >
                    <Alert
                        onClose={clearNotifications}
                        severity={notification.type}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
            <div className={classes.container}>
                <Typography variant="h5">Log in to continue</Typography>
                <form onSubmit={onSubmit}>
                    <TextField
                        className={classes.input}
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={values.email}
                        onChange={onInputChange}
                    />
                    <TextField
                        className={classes.input}
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={values.password}
                        onChange={onInputChange}
                    />
                    <Button
                        className={classes.input}
                        fullWidth
                        type="submit"
                        color="secondary"
                        variant="contained"
                    >
                        Log In
                    </Button>
                    <Typography variant="subtitle1" align="right">
                        Don't have an account?{' '}
                        <Link to="/register">Register</Link>
                    </Typography>
                </form>
            </div>
        </>
    );
}
