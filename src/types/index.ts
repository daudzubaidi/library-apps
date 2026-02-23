// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  profilePhoto?: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Books
export interface Book {
  id: number;
  title: string;
  isbn: string;
  coverImage?: string;
  description?: string;
  stock: number;
  availableStock: number;
  averageRating: number;
  totalReviews: number;
  author: Author;
  category: Category;
  createdAt: string;
}

export interface BookListResponse {
  data: Book[];
  meta: PaginationMeta;
}

// Authors
export interface Author {
  id: number;
  name: string;
  bio?: string;
  photoUrl?: string;
}

// Categories
export interface Category {
  id: number;
  name: string;
}

// Loans
export type LoanStatus = 'BORROWED' | 'RETURNED' | 'LATE';

export interface Loan {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  book: Book;
  user?: User;
  createdAt: string;
}

// Reviews
export interface Review {
  id: number;
  userId: number;
  bookId: number;
  star: number;
  comment?: string;
  user: Pick<User, 'id' | 'name' | 'profilePhoto'>;
  book?: Pick<Book, 'id' | 'title' | 'coverImage'>;
  createdAt: string;
}

// Cart
export interface CartItem {
  id: number;
  bookId: number;
  book: Book;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Admin
export interface AdminOverview {
  totalBooks: number;
  totalUsers: number;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
  returnedLoans: number;
}

// Profile with stats
export interface UserProfile extends User {
  loanStats: {
    total: number;
    active: number;
    returned: number;
    overdue: number;
  };
}
