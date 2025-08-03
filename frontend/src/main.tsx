import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      toastStyle={{
        fontSize: "1.1rem",
        padding: "14px 18px",
        borderRadius: "8px",
      }}
    />
  </>
);
