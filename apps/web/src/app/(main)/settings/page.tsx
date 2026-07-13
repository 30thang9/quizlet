'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', description: 'Update your name, email, and password' },
      { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
      { icon: Shield, label: 'Privacy', description: 'Control who can see your profile and sets' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Palette, label: 'Appearance', description: 'Customize the look of Quizlet' },
      { icon: Globe, label: 'Language', description: 'Choose your preferred language' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', description: 'Get help with using Quizlet' },
    ],
  },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-sky-500">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <button className="text-sky-500 font-medium hover:underline">
            Change photo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </section>

      {settingsSections.map((section) => (
        <section key={section.title} className="bg-white border border-gray-200 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold text-gray-800 px-6 py-4 border-b">
            {section.title}
          </h2>
          <div className="divide-y">
            {section.items.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-white border border-red-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Sign Out</p>
            <p className="text-sm text-gray-500">Sign out of your account on this device</p>
          </div>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </section>

      <div className="text-center text-sm text-gray-500">
        <p>Quizlet Clone v1.0.0</p>
        <p className="mt-1">Made with Next.js and NestJS</p>
      </div>
    </div>
  );
}
