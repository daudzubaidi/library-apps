import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import type { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { setCartCount } from '@/store/cartSlice';
import { getCart } from '@/api/cart';
import {
  ShoppingCart, User, LogOut, LayoutDashboard,
  Menu, X, BookOpen, ClipboardList, Star, Search,
} from 'lucide-react';
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

const DROPDOWN_NAV = [
  { label: 'My Profile', path: '/my-profile', icon: User },
  { label: 'My Loans', path: '/my-loans', icon: ClipboardList },
  { label: 'My Reviews', path: '/my-reviews', icon: Star },
];

export default function MainLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector((state: RootState) => state.cart.itemCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (cart) dispatch(setCartCount(cart.items.length));
  }, [cart, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/categories/all?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setMobileMenuOpen(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-neutral-25, #fff)' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-neutral-200)' }}
      >
        <div className="mx-auto flex h-[80px] max-w-[1200px] items-center justify-between gap-[16px] px-[24px]">

          {/* Left: Logo */}
          <Link to="/books" className="flex shrink-0 items-center gap-[10px]">
            <Logo />
            <span
              className="hidden font-bold sm:block"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', fontSize: '20px' }}
            >
              Booky
            </span>
          </Link>

          {/* Center: Search bar */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-[480px] md:flex">
            <div
              className="flex h-[44px] w-full items-center gap-[8px] rounded-[100px] border border-solid px-[16px]"
              style={{ borderColor: 'var(--color-neutral-300)', backgroundColor: 'var(--color-neutral-50)' }}
            >
              <Search className="h-[16px] w-[16px] shrink-0" style={{ color: 'var(--color-neutral-500)' }} />
              <input
                type="text"
                placeholder="Search book"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 border-none bg-transparent text-sm font-semibold outline-none"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
              />
            </div>
          </form>

          {/* Right: Cart + User dropdown + Mobile hamburger */}
          <div className="flex shrink-0 items-center gap-[8px]">
            {/* Cart */}
            <Link to="/cart" className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full transition-colors hover:bg-[var(--color-neutral-100)]">
              <ShoppingCart className="h-[22px] w-[22px]" style={{ color: 'var(--color-neutral-700)' }} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-[2px] -top-[2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-[3px] text-[10px] font-bold text-white"
                  style={{ backgroundColor: 'var(--color-accent-red)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-[8px] rounded-full px-[8px] py-[4px] transition-colors hover:bg-[var(--color-neutral-100)]">
                  <Avatar className="h-[32px] w-[32px]">
                    {user?.profilePhoto && <AvatarImage src={user.profilePhoto} alt={user.name} />}
                    <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span
                    className="hidden text-sm font-bold sm:block"
                    style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)' }}>{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {DROPDOWN_NAV.map(({ label, path, icon: Icon }) => (
                  <DropdownMenuItem key={path} onClick={() => navigate(path)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                {user?.role === 'ADMIN' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger */}
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

        {/* Mobile: Search + Nav */}
        {mobileMenuOpen && (
          <div className="border-t px-[24px] py-[16px] md:hidden" style={{ borderColor: 'var(--color-neutral-200)' }}>
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-[12px]">
              <div
                className="flex h-[44px] items-center gap-[8px] rounded-[100px] border border-solid px-[16px]"
                style={{ borderColor: 'var(--color-neutral-300)', backgroundColor: 'var(--color-neutral-50)' }}
              >
                <Search className="h-[16px] w-[16px] shrink-0" style={{ color: 'var(--color-neutral-500)' }} />
                <input
                  type="text"
                  placeholder="Search book"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-1 border-none bg-transparent text-sm font-semibold outline-none"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                />
              </div>
            </form>
            <nav className="flex flex-col gap-[4px]">
              {[{ label: 'Home', path: '/books', icon: BookOpen }, ...DROPDOWN_NAV].map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-[12px] rounded-[12px] px-[12px] py-[10px] text-sm font-semibold transition-colors"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    backgroundColor: location.pathname === path ? 'var(--color-primary-50, #EEF2FF)' : 'transparent',
                    color: location.pathname === path ? 'var(--color-primary-300)' : 'var(--color-neutral-700)',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-[1200px] px-[24px] py-[32px]">
        <Outlet />
      </main>
    </div>
  );
}
