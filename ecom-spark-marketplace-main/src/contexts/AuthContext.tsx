
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { mockUsers } from "../data/mockData";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: "seller" | "customer") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("ecomUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user in mock data (in a real app, this would be an API call)
      const foundUser = mockUsers.find((u) => u.email === email);
      
      if (foundUser) {
        // In a real app, you would verify the password here
        setUser(foundUser);
        localStorage.setItem("ecomUser", JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("Invalid credentials. Please try again.");
        return false;
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // Mock register function
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "seller" | "customer"
  ): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        toast.error("Email already in use. Please use a different email.");
        return false;
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser: User = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      
      // Add to mock users (this is just for demo purposes)
      // In a real app, the backend would handle this
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem("ecomUser", JSON.stringify(newUser));
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecomUser");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
