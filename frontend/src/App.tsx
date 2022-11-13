import { BrowserRouter } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'

import './shared/forms/TraducoesYup';
import 'react-toastify/dist/ReactToastify.css';

import { AppRoutes } from "./routes";
import { Sidemenu } from "./shared/components";
import { AppThemeProvider, DrawerProvider } from "./shared/contexts";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer/>
      <AppThemeProvider>
        <DrawerProvider>
          <BrowserRouter>
            <Sidemenu>
              <AppRoutes/>
            </Sidemenu>
          </BrowserRouter>
        </DrawerProvider>
      </AppThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
