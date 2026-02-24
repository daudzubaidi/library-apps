import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { useProfile } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
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

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] as const } },
};

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
            <Route element={<AdminRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route path="/admin/loans" element={<AdminLoans />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { refetch } = useProfile();

  // Auto-fetch profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  return <AnimatedOutlet />;
}
