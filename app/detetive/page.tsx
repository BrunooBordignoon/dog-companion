'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EquipmentTabs from '../components/EquipmentTabs';
import { DETETIVE_EQUIPMENTS } from '@/types/equipment';
import DebugButton from './DebugButton';
import CaoPage from './cao/page';

export default function DetetivePage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('cao');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Check if user has selected a character
  useEffect(() => {
    const selectedCharacter = localStorage.getItem('selected-character');
    if (selectedCharacter !== 'detetive') {
      // Redirect to character selection if not detetive
      router.push('/');
      return;
    }

    // Load selected equipment from localStorage
    const savedEquipment = localStorage.getItem('selected-equipment-detetive');
    if (savedEquipment) {
      setSelectedEquipment(savedEquipment);
    }

    setIsLoaded(true);
  }, [router]);

  // Save selected equipment to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('selected-equipment-detetive', selectedEquipment);
    }
  }, [selectedEquipment, isLoaded]);

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipment(id);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <DebugButton />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Character Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-4xl font-bold text-amber-100">José</h1>
          <p className="text-lg text-neutral-400">Detetive Paranormal</p>
        </div>

        {/* Equipment Tabs */}
        <EquipmentTabs
          equipments={DETETIVE_EQUIPMENTS}
          selectedId={selectedEquipment}
          onSelect={handleEquipmentSelect}
        />

        {/* Equipment Content */}
        <div className="mt-8">
          {selectedEquipment === 'cao' && <CaoPage />}
          {selectedEquipment === 'item2' && (
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-8 text-center">
              <p className="text-neutral-400">Este equipamento ainda não está disponível.</p>
            </div>
          )}
          {selectedEquipment === 'item3' && (
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-8 text-center">
              <p className="text-neutral-400">Este equipamento ainda não está disponível.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
