import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Books from '@/pages/Books';
import BookDetail from '@/pages/BookDetail';
import MyLoans from '@/pages/MyLoans';
import MyProfile from '@/pages/MyProfile';
import MyReviews from '@/pages/MyReviews';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Dashboard from '@/pages/admin/Dashboard';
import AdminBooks from '@/pages/admin/AdminBooks';
import AdminLoans from '@/pages/admin/AdminLoans';
import AdminUsers from '@/pages/admin/AdminUsers';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/loans" element={<AdminLoans />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      {/* Redirect root to books */}
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}
