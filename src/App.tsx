import { createTheme, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', 'Montserrat', sans-serif`,
  },
});


export default function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
      {/* İstersen buraya Header ekleyebilirsin */}
            <ToastContainer position="top-right" autoClose={3000} />

      <Outlet /> {/* Router alt componentleri buraya render edilir */}
      </ThemeProvider>
    </div>
  );
}
