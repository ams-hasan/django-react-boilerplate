import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext } from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        cursor: 'default',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

export default function Navbar() {
    const classes = useStyles();
    const { token, onLogoutSuccess } = useContext(AuthContext);
    const [anchor, setAnchor] = useState(null);

    const onMenuClick = (event) => {
        setAnchor(event.currentTarget);
    };

    const onMenuClose = () => {
        setAnchor(null);
    };

    const onLogoutClick = () => {
        onMenuClose();
        axios
            .post('/api/auth/logout/', null, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
                onLogoutSuccess();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    React Django Boilerplate
                </Typography>
                <IconButton aria-haspopup onClick={onMenuClick}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchor}
                    onClose={onMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchor)}
                >
                    <MenuItem>Profile</MenuItem>
                    <Divider />
                    <MenuItem onClick={onLogoutClick}>Log out</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
