import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        fontFamily:
            '"Roboto", "Noto Sans Bengali", "Helvetica", "Arial", sans-serif',
    },
    palette: {
        primary: {
            main: '#2d5d7b',
            contrastText: '#fff',
        },
        secondary: {
            main: '#d64045',
            contrastText: '#fff',
        },
    },
});

export default theme;
