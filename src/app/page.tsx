import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, BarChart, Zap, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const featureImage1 = PlaceHolderImages.find(p => p.id === 'feature1');
  const featureImage2 = PlaceHolderImages.find(p => p.id === 'feature2');


  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: 'For Professionals',
      description: 'Streamline your workflow and boost your productivity with our powerful tools.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Powerful Analytics',
      description: 'Gain valuable insights with our advanced analytics and reporting features.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Blazing Fast',
      description: 'Our platform is optimized for speed, ensuring a seamless user experience.',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Easy to Use',
      description: 'An intuitive interface that you can master in minutes, not months.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-2xl font-headline font-bold text-primary">SaaSApp</h1>
          </div>
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
                  Build Your Next Big Thing.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform provides the tools and infrastructure you need to launch and scale your business with confidence. Powerful, flexible, and easy to use.
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
                Everything You Need to Succeed
              </h3>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                From powerful features to a great user experience, we have you covered.
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
          <p>&copy; {new Date().getFullYear()} SaaSApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
