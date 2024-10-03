import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import store from './store.js';
import { Provider } from 'react-redux';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminLogin from './screens/AdminLogin.jsx';
import Dashboard from './screens/Dashboard.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public routes */}
            <Route path='/' element={<App />}>
                <Route path='' element={<PrivateRoute />}>
                    <Route index element={<HomeScreen />} />
                </Route>
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/register' element={<RegisterScreen />} />
                <Route path='' element={<PrivateRoute />}>
                    <Route path='/profile' element={<ProfileScreen />} />
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin/dashboard' element={<Dashboard />} />
        </>
    )
);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    </Provider>
);