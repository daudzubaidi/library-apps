import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, BookOpen, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Books', path: '/books', icon: BookOpen },
  { label: 'My Loans', path: '/my-loans', icon: ClipboardList },
];

export default function MainLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector((state: RootState) => state.cart.itemCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link to="/books" className="flex items-center gap-2 font-semibold">
              <div className="scale-75"><Logo /></div>
              <span
                className="hidden sm:block font-bold"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
              >
                Booky
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="font-semibold transition-colors"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    color: location.pathname.startsWith(path)
                      ? 'var(--color-primary-300)'
                      : 'var(--color-neutral-600)',
                  }}
                >
                  {label}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="font-semibold transition-colors"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    color: location.pathname.startsWith('/admin')
                      ? 'var(--color-primary-300)'
                      : 'var(--color-neutral-600)',
                  }}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Cart + User + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.profilePhoto && <AvatarImage src={user.profilePhoto} alt={user.name} />}
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="border-t bg-background px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-[12px] px-[12px] py-[10px] text-sm font-semibold transition-colors"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    backgroundColor: location.pathname.startsWith(path)
                      ? 'var(--color-primary-100)'
                      : 'transparent',
                    color: location.pathname.startsWith(path)
                      ? 'var(--color-primary-300)'
                      : 'var(--color-neutral-700)',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-[12px] px-[12px] py-[10px] text-sm font-semibold transition-colors"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    backgroundColor: location.pathname.startsWith('/admin')
                      ? 'var(--color-primary-100)'
                      : 'transparent',
                    color: location.pathname.startsWith('/admin')
                      ? 'var(--color-primary-300)'
                      : 'var(--color-neutral-700)',
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
