
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const categories = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Accessories",
  "Home & Kitchen",
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const userIsCustomer = user?.role === "customer";
  const userIsSeller = user?.role === "seller";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="ecom-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">EcomSpark</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <form onSubmit={handleSearch} className="w-full max-w-lg relative">
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link to={`/category/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                {userIsCustomer && (
                  <>
                    <Link to="/wishlist">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/cart">
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={userIsSeller ? "/seller/dashboard" : "/customer/dashboard"}>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {userIsSeller ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/products">My Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/orders">Orders</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/orders">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="mr-2">
              {userIsCustomer && (
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              )}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 space-y-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="space-y-1">
                    <div className="font-medium mb-2">Categories</div>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/category/${category.toLowerCase()}`}
                        className="block py-2 px-3 rounded-md hover:bg-muted"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1 pt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        <div className="font-medium mb-2">My Account</div>
                        <Link
                          to={userIsSeller ? "/seller/dashboard" : "/customer/dashboard"}
                          className="block py-2 px-3 rounded-md hover:bg-muted"
                        >
                          Dashboard
                        </Link>
                        {userIsSeller ? (
                          <>
                            <Link
                              to="/seller/products"
                              className="block py-2 px-3 rounded-md hover:bg-muted"
                            >
                              My Products
                            </Link>
                            <Link
                              to="/seller/orders"
                              className="block py-2 px-3 rounded-md hover:bg-muted"
                            >
                              Orders
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/wishlist"
                              className="block py-2 px-3 rounded-md hover:bg-muted"
                            >
                              Wishlist
                            </Link>
                            <Link
                              to="/orders"
                              className="block py-2 px-3 rounded-md hover:bg-muted"
                            >
                              My Orders
                            </Link>
                            <Link
                              to="/profile"
                              className="block py-2 px-3 rounded-md hover:bg-muted"
                            >
                              Profile
                            </Link>
                          </>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                          className="w-full text-left py-2 px-3 rounded-md hover:bg-muted text-red-500 flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Log Out
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Mobile Search - Displayed below navbar */}
      <div className="md:hidden bg-gray-50 py-2 px-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
