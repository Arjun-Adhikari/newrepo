import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App.jsx";
import Appdata from "../components/Adddata.jsx";
import ManageData from "../components/ManageData.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        <Route index element={<Appdata />} />
        <Route path="/manage" element={<ManageData />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </>
  )
);

export default router;