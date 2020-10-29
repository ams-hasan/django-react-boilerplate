import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typography, Button, TextField, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'absolute',
        width: '30%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: theme.spacing(2),
    },
    input: {
        marginTop: theme.spacing(2),
    },
}));

export default function Register(props) {
    const registerStatePrimary = {
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
    };

    const notificationStatePrimary = {
        message: '',
        type: '',
    };

    const classes = useStyles();
    const [values, setValues] = useState(registerStatePrimary);
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
        if (values.password !== values.confirm_password) {
            setNotification({
                message: "Passwords don't match",
                type: 'error',
            });
            return;
        }
        axios
            .post('http://localhost:8000/api/auth/register/', values)
            .then((response) => {
                onLoginSuccess(response.data);
            })
            .catch((error) => {
                if (error.response.data) {
                    console.log(error.response.data);
                    let message = '';
                    if (error.response.data.hasOwnProperty('email')) {
                        message = error.response.data.email[0];
                    } else if (error.response.data.hasOwnProperty('password')) {
                        message = error.response.data.password[0];
                    }
                    if (message === '') message = 'Registration failed!';
                    if (message !== '') {
                        setNotification({ message, type: 'error' });
                    }
                } else {
                    setNotification({
                        message: 'Registration failed!',
                        type: 'error',
                    });
                }
            });
    };

    return (
        <>
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
                <Typography variant="h4">Create New Account</Typography>
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
                        name="first_name"
                        label="First Name"
                        type="text"
                        variant="outlined"
                        value={values.first_name}
                        onChange={onInputChange}
                    />
                    <TextField
                        className={classes.input}
                        required
                        fullWidth
                        name="last_name"
                        label="Last Name"
                        type="text"
                        variant="outlined"
                        value={values.last_name}
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
                    <TextField
                        className={classes.input}
                        required
                        fullWidth
                        name="confirm_password"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={values.confirm_password}
                        onChange={onInputChange}
                    />
                    <Button
                        className={classes.input}
                        fullWidth
                        type="submit"
                        color="secondary"
                        variant="contained"
                    >
                        Register
                    </Button>
                    <Typography variant="subtitle1" align="right">
                        Already have an account? <Link to="/login">Log in</Link>
                    </Typography>
                </form>
            </div>
        </>
    );
}
