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
        width: '40%',
        margin: '0 auto',
        padding: theme.spacing(2),
    },
    input: {
        marginTop: theme.spacing(2),
    },
    avatar: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        display: 'inline-block',
        verticalAlign: 'middle',
    },
}));

export default function Register(props) {
    const registerStatePrimary = {
        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
        mobile_number: '',
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
        const files = event.target.files;
        if (files) {
            setValues({ ...values, [event.target.name]: files[0] });
        } else {
            setValues({ ...values, [event.target.name]: event.target.value });
        }
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
        let formData = new FormData();
        for (let prop in values) {
            if (prop === 'avatar') {
                if (values[prop]) formData.append(prop, values[prop]);
            } else {
                formData.append(prop, values[prop]);
            }
        }
        axios
            .post('http://localhost:8000/api/auth/register/', formData)
            .then((response) => {
                onLoginSuccess(response.data);
            })
            .catch((error) => {
                let message = 'Registration failed!';
                if (error.response.data) {
                    for (let prop in error.response.data) {
                        if (registerStatePrimary.hasOwnProperty(prop)) {
                            message = error.response.data[prop][0];
                            break;
                        }
                    }
                    setNotification({ message, type: 'error' });
                } else {
                    setNotification({ message, type: 'error' });
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
                <Typography variant="h5">Create New Account</Typography>
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
                        fullWidth
                        name="mobile_number"
                        label="Mobile Number"
                        type="tel"
                        variant="outlined"
                        value={values.mobile_number}
                        onChange={onInputChange}
                    />
                    <Button
                        className={classes.input}
                        variant="contained"
                        component="label"
                    >
                        Upload Avatar
                        <input
                            name="avatar"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={onInputChange}
                        />
                    </Button>
                    {values.avatar ? (
                        <Typography className={classes.avatar} variant="body1">
                            {values.avatar.name}
                        </Typography>
                    ) : null}
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
