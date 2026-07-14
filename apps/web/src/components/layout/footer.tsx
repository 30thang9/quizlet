import Link from 'next/link';
import { BookOpen, Github, Twitter } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const footerLinks = {
  product: [
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'For Teachers', href: '/teachers' },
  ],
  resources: [
    { name: 'Help Center', href: '/help' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
    { name: 'Flashcard Friday', href: '/flashcard-friday' },
  ],
  company: [
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`border-t border-gray-200 bg-gray-50 ${className || ''}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-sky-500" />
              <span className="text-xl font-bold">Quizlet</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Quizlet is a lightning-fast way to learn anything. 
              Create flashcards, study with friends, and track your progress.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-gray-600">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Quizlet. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
