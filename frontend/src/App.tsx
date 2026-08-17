import { AppRouter } from "./routers/index.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import { CustomCursor } from "./components/CustomCursor.js";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomCursor />
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
