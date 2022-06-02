import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Sidemenu } from "./shared/components";
import { AppThemeProvider, DrawerProvider } from "./shared/contexts";

function App() {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <Sidemenu>
            <AppRoutes/>
          </Sidemenu>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
}

export default App;
