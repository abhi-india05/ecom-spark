
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert("Thanks for subscribing!");
  };

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="ecom-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">EcomSpark</h3>
            <p className="text-gray-600 mb-4">
              Your one-stop destination for all your shopping needs. Quality products,
              excellent service, and fast delivery.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 mb-6 text-gray-600">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>contact@ecomspark.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>123 Market St, San Francisco, CA</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EcomSpark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
