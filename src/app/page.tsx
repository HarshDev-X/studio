import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, IndianRupee, PieChart, Users } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featureImage1 = PlaceHolderImages.find(p => p.id === 'feature1');
  const featureImage2 = PlaceHolderImages.find(p => p.id === 'feature2');


  const features = [
    {
      icon: <IndianRupee className="h-8 w-8 text-primary" />,
      title: 'INR-Focused Tracking',
      description: 'Track all your income and expenses in Indian Rupees, tailored for the Indian user.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Hostel & Daily Categories',
      description: 'Special categories like "Hostel" to manage student-specific expenses effortlessly.',
    },
    {
      icon: <PieChart className="h-8 w-8 text-primary" />,
      title: 'Visual Insights',
      description: 'Interactive charts and graphs to help you visualize your spending patterns at a glance.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Summaries',
      description: 'Get smart summaries of your spending habits and identify potential savings with our AI tool.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <h1 className="text-2xl font-headline font-bold text-primary">ExpenseWise</h1>
          <nav className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-foreground">
                  Master Your Money, the Indian Way.
                </h2>
                <p className="text-lg text-muted-foreground">
                  ExpenseWise is a modern expense tracker designed for students and professionals in India. Track, analyze, and optimize your spending in INR with powerful, easy-to-use tools.
                </p>
                <div className="flex space-x-4">
                  <Button size="lg" asChild>
                    <Link href="/signup">Get Started for Free</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                 {heroImage && <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-105"
                />}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                Everything You Need for Financial Clarity
              </h3>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                From tracking every rupee to getting AI-driven insights, we've got you covered.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-card">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ExpenseWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
