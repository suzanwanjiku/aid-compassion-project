import { Button } from "@/components/ui/button";
import { Heart, Users, Home, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Connecting Donors to Needy Homes with Love and Care</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Food Donation Management Platform
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our mission to end hunger. Whether you want to donate food or manage distributions, 
              we make it simple, transparent, and impactful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Make a Donation</h3>
              <p className="text-muted-foreground">
                Donate money or food items easily through our platform. Track your impact in real-time.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Admin Management</h3>
              <p className="text-muted-foreground">
                Admins review donations, manage children's homes, and coordinate distributions efficiently.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Help Reaches Homes</h3>
              <p className="text-muted-foreground">
                Registered children's homes receive donations promptly with full transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div className="text-4xl font-bold">100%</div>
              </div>
              <p className="text-muted-foreground">Transparency</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <div className="text-4xl font-bold">24/7</div>
              </div>
              <p className="text-muted-foreground">Platform Access</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <div className="text-4xl font-bold">Secure</div>
              </div>
              <p className="text-muted-foreground">Payment Processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 to-accent/10 p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join us today and be part of the solution to end hunger in our communities.
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link to="/register">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}