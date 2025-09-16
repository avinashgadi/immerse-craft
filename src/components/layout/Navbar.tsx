import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Globe, Menu, User, Search, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Demo', href: '/demo' },
    { name: 'About', href: '#', disabled: true },
  ];

  const handleNavClick = (href: string, disabled?: boolean) => {
    if (disabled) return; // Don't navigate if disabled
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CloudVR Tours
              </h1>
              <p className="text-xs text-muted-foreground">Immersive Travel</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.disabled)}
                className={`transition-colors duration-300 font-medium ${
                  link.disabled 
                    ? 'text-muted-foreground cursor-not-allowed' 
                    : 'text-foreground hover:text-primary'
                }`}
                whileHover={link.disabled ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
                disabled={link.disabled}
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hover-scale" onClick={() => navigate('/destinations')}>
              <Search className="h-4 w-4" />
            </Button>
            
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hover-scale hidden sm:flex">
                  <Heart className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-tours')}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      My Tours
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" className="hover-scale" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3 mb-8">
                    <Globe className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold gradient-text">CloudVR Tours</span>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavClick(link.href, link.disabled)}
                        className={`text-lg font-medium transition-colors text-left ${
                          link.disabled 
                            ? 'text-muted-foreground cursor-not-allowed' 
                            : 'hover:text-primary'
                        }`}
                        disabled={link.disabled}
                      >
                        {link.name}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-auto space-y-4">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-muted-foreground">Member</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full" onClick={() => navigate('/auth')}>
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/destinations')}>
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;