import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/customer/HomePage'
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import {
  AdminLoginPage,
  CustomerLoginPage,
  CustomerRegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SellerLoginPage,
  SellerRegisterPage,
} from '../pages/auth/AuthPages'
import NotFoundPage from '../pages/NotFoundPage'
import RequireRole from './RequireRole'

export const router = createBrowserRouter([
  // Customer app
  { path: '/', Component: MainLayout, children: [{ index: true, Component: HomePage }] },
  { path: '/login', Component: CustomerLoginPage },
  { path: '/register', Component: CustomerRegisterPage },
  { path: '/forgot-password', element: <ForgotPasswordPage role="customer" /> },
  // identity.password-reset.link-base points here: /reset-password?token=…
  { path: '/reset-password', element: <ResetPasswordPage role="customer" /> },

  // Seller app
  {
    path: '/seller',
    element: (
      <RequireRole role="seller">
        <SellerLayout />
      </RequireRole>
    ),
    children: [{ index: true, Component: SellerDashboardPage }],
  },
  { path: '/seller/login', Component: SellerLoginPage },
  { path: '/seller/register', Component: SellerRegisterPage },
  { path: '/seller/forgot-password', element: <ForgotPasswordPage role="seller" /> },
  { path: '/seller/reset-password', element: <ResetPasswordPage role="seller" /> },

  // Admin app (no self sign-up)
  {
    path: '/admin',
    element: (
      <RequireRole role="admin">
        <AdminLayout />
      </RequireRole>
    ),
    children: [{ index: true, Component: AdminDashboardPage }],
  },
  { path: '/admin/login', Component: AdminLoginPage },
  { path: '/admin/forgot-password', element: <ForgotPasswordPage role="admin" /> },
  { path: '/admin/reset-password', element: <ResetPasswordPage role="admin" /> },

  { path: '*', Component: NotFoundPage },
])
