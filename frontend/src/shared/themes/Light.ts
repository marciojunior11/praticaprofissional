import { createTheme } from '@mui/material';
import { blue, green } from '@mui/material/colors';
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const LightTheme = createTheme({
    palette: {
        primary: {
            main: blue[800],
            dark: blue[900],
            light: blue[700],
            contrastText: '#ffffff',
        },
        secondary: {
            main: green[600],
            dark: green[900],
            light: green[300],
            contrastText: '#ffffff',
        },
        background: {
            default: '#f7f6f3',
            paper: '#ffffff',
        }
    },
    components: {
        MuiDatePicker: {
            styleOverrides: {
                root: {
                    backgroundColor: blue[700]
                }
            }
        }
    }
});