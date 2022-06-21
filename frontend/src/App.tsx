import { BrowserRouter } from "react-router-dom";

import './shared/forms/TraducoesYup';
import 'react-toastify/dist/ReactToastify.css';

import { AppRoutes } from "./routes";
import { Sidemenu } from "./shared/components";
import { AppThemeProvider, DrawerProvider } from "./shared/contexts";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
