import { RouterProvider } from "react-router-dom";
import { router } from "./routers/index.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import { CustomCursor } from "./components/CustomCursor.js";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomCursor />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
