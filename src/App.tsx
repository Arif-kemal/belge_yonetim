// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/homepage/homepage';
import ChooseSigner from './pages/chooseSigner/chooseSigner';
import Wallet from './pages/wallet/wallet';
import SignIn from './pages/signIn/signIn';
import AdminPanel from './pages/admin/admin';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------
const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <SignIn /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'home', element: <Homepage /> },
      { path: 'chooseSigner', element: <ChooseSigner /> },
      { path: 'admin', element: <AdminPanel /> },
    ],
  },
]);

// -----------------------------------------------------------------------------
// App Root
// -----------------------------------------------------------------------------
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default App;
