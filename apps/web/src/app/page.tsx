import Link from 'next/link';
import { BookOpen, Brain, Trophy, Users, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Quizlet
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/library" className="text-sm font-medium hover:text-primary">
              Library
            </Link>
            <Link href="/sets" className="text-sm font-medium hover:text-primary">
              Study Sets
            </Link>
            <Link href="/classes" className="text-sm font-medium hover:text-primary">
              Classes
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition"
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn smarter, not harder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create flashcards, play study games, and access AI-powered learning tools.
            Join millions of students who are already studying smarter with Quizlet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary/90 transition"
            >
              Get started free
            </Link>
            <Link
              href="/sets"
              className="px-8 py-4 border border-input text-lg font-medium rounded-lg hover:bg-accent transition"
            >
              Browse study sets
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to ace your classes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              title="Flashcards"
              description="Create custom flashcards with text, images, and audio. Perfect for any subject."
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-primary" />}
              title="Learn Mode"
              description="Our smart algorithm adapts to your learning pace, helping you remember more."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Test Mode"
              description="Track your progress with quizzes that identify your strengths and weaknesses."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-primary" />}
              title="Match Game"
              description="Race against the clock in our fun matching game. Learning has never been this exciting."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Classes"
              description="Teachers can create classes, assign work, and track student progress."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="AI-Powered"
              description="Get instant explanations and personalized study recommendations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start studying smarter?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join over 50 million learners who use Quizlet to study smarter every day.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary/90 transition"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-primary">Quizlet</div>
            <p className="text-sm text-muted-foreground">
              © 2024 Quizlet Clone. Built with Next.js and NestJS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-card rounded-xl border shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
