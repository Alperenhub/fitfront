import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <div>
      {/* İstersen buraya Header ekleyebilirsin */}
            <ToastContainer position="top-right" autoClose={3000} />

      <Outlet /> {/* Router alt componentleri buraya render edilir */}
    </div>
  );
}
