import React, { useContext, useState } from 'react';
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

export default function Profile(props) {
    const notificationStatePrimary = {
        message: '',
        type: '',
    };

    const classes = useStyles();
    const [notification, setNotification] = useState(notificationStatePrimary);
    const { token, user, onUpdateSuccess } = useContext(AuthContext);

    const profileStatePrimary = {
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: null,
        mobile_number: user.mobile_number,
    };
    const [values, setValues] = useState(profileStatePrimary);

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
        let formData = new FormData();
        for (let prop in values) {
            if (prop === 'avatar') {
                if (values[prop]) formData.append(prop, values[prop]);
            } else {
                formData.append(prop, values[prop]);
            }
        }
        axios
            .patch(
                `http://localhost:8000/api/auth/users/${user.id}/`,
                formData,
                { headers: { Authorization: `Token ${token}` } }
            )
            .then((response) => {
                onUpdateSuccess(response.data);
                setNotification({
                    message: 'Update Successful!',
                    type: 'success',
                });
            })
            .catch((error) => {
                let message = 'Update failed';
                if (error.response.data) {
                    for (let prop in error.response.data) {
                        if (profileStatePrimary.hasOwnProperty(prop)) {
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
                <Typography variant="h5">Update Profile</Typography>
                <form onSubmit={onSubmit}>
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
                    <Button
                        className={classes.input}
                        fullWidth
                        type="submit"
                        color="secondary"
                        variant="contained"
                    >
                        Update
                    </Button>
                </form>
            </div>
        </>
    );
}
