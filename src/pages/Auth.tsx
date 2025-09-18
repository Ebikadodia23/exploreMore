import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Compass, Sparkles, MapPin, Shield } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-smart p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Compass className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-extra-bold text-white font-display">ExploreMore</h1>
          </div>
          
          <h2 className="text-3xl font-extra-bold text-white mb-6 leading-tight">
            Your Smart Travel Companion Awaits
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-white/80" />
              <p className="text-white/90 font-medium">AI-powered destination recommendations</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-white/80" />
              <p className="text-white/90 font-medium">Smart trip planning and organization</p>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-white/80" />
              <p className="text-white/90 font-medium">Never forget travel essentials</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-white/90 font-medium italic">
              "ExploreMore helped me discover hidden gems I never would have found on my own. 
              The smart recommendations were spot-on!"
            </p>
            <p className="text-white/70 font-medium mt-2">- Sarah, Travel Enthusiast</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-smart rounded-xl">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-extra-bold text-black font-display">ExploreMore</h1>
            </div>
            <p className="text-gray-600 font-medium">Your smart travel journey starts here</p>
          </div>

          <Card className="country-card border-2 border-gray-100">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-extra-bold text-black">Welcome</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Sign in to your account or create a new one to start exploring smart destinations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="font-bold">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="font-bold">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="font-bold text-black">Email</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="font-bold text-black">Password</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="font-medium"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full smart-button text-lg py-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="font-bold text-black">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="font-bold text-black">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="font-bold text-black">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="font-medium"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg py-6 shadow-bold" 
                      disabled={isLoading || formData.password !== formData.confirmPassword}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 font-medium">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;