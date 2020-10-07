import React from 'react';
import { Typography } from '@material-ui/core';

import Navbar from '../../components/Navbar';

export default function Home() {
    return (
        <>
            <Navbar />
            <Typography variant="h2" align="center">
                Home
            </Typography>
        </>
    );
}
