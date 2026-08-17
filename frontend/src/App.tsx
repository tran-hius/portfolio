import { AppRouter } from "./routers/index.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import { ConfirmProvider } from "./context/ConfirmContext.js";
import { CustomCursor } from "./components/CustomCursor.js";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfirmProvider>
          <CustomCursor />
          <AppRouter />
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
