import { createTheme } from '@mui/material';
import { blue, green } from '@mui/material/colors';

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[500],
            dark: blue[600],
            light: blue[400],
            contrastText: '#ffffff',
        },
        secondary: {
            main: green[600],
            dark: green[900],
            light: green[300],
            contrastText: '#ffffff',
        },
        background: {
            default: '#202124',
            paper: '#303134',
        },
    },
    typography: {
        allVariants: {
            color: 'white',
        }   
    }
});