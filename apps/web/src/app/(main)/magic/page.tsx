'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MagicNotes } from '@/features/ai/components';

export default function MagicNotesPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Magic Notes */}
      <MagicNotes />
    </div>
  );
}
