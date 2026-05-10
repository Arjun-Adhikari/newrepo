import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HelloForm from '../components/hello.jsx'; // Fixed the lowercase 'f'
import App from "../App.jsx";
import Appdata from '../components/Adddata.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Appdata/>}/>
      <Route path="/hello" element={<HelloForm />} />
      
      <Route path="*" element={<div>Not Found</div>} />
    </Route>
  )
);

export default router;