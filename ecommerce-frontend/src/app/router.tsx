import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/customer/HomePage'
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import LoginPage from '../pages/auth/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', Component: MainLayout, children: [{ index: true, Component: HomePage }] },
  { path: '/seller', Component: SellerLayout, children: [{ index: true, Component: SellerDashboardPage }] },
  { path: '/admin', Component: AdminLayout, children: [{ index: true, Component: AdminDashboardPage }] },
  { path: '/login', Component: LoginPage },
  { path: '*', Component: NotFoundPage },
])
