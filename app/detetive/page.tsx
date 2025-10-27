'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EquipmentTabs from '../components/EquipmentTabs';
import CharacterHeader from '../components/CharacterHeader';
import { DETETIVE_EQUIPMENTS, getEffectiveLevel } from '@/types/equipment';
import DebugButton from './DebugButton';
import CaoPage from './cao/page';

export default function DetetivePage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('cao');
  const [isLoaded, setIsLoaded] = useState(false);
  const [characterName, setCharacterName] = useState('José');
  const [characterDescription, setCharacterDescription] = useState('Detetive Paranormal');
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
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

    // Load character name, description, image and level
    const savedName = localStorage.getItem('detetive-character-name');
    const savedDesc = localStorage.getItem('detetive-character-description');
    const savedLevel = localStorage.getItem('detetive-character-level');
    const savedImage = localStorage.getItem('detetive-character-image');

    if (savedName) setCharacterName(savedName);
    if (savedDesc) setCharacterDescription(savedDesc);
    if (savedImage) setCharacterImage(savedImage);
    if (savedLevel) {
      setCharacterLevel(parseInt(savedLevel));
    } else {
      // Migração: tentar ler nível do item antigo
      const oldCompanionData = localStorage.getItem('dogCompanion');
      if (oldCompanionData) {
        try {
          const data = JSON.parse(oldCompanionData);
          if (data.level) {
            setCharacterLevel(data.level);
          }
        } catch (e) {
          console.error('Error migrating level:', e);
        }
      }
    }

    setIsLoaded(true);
  }, [router]);

  // Save selected equipment to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('selected-equipment-detetive', selectedEquipment);
    }
  }, [selectedEquipment, isLoaded]);

  // Save character name, description and image
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('detetive-character-name', characterName);
      localStorage.setItem('detetive-character-description', characterDescription);
      if (characterImage) {
        localStorage.setItem('detetive-character-image', characterImage);
      }
    }
  }, [characterName, characterDescription, characterImage, isLoaded]);

  // Save character level
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('detetive-character-level', characterLevel.toString());
    }
  }, [characterLevel, isLoaded]);

  const handleEquipmentSelect = (id: string) => {
    setSelectedEquipment(id);
  };

  const handleNameChange = (name: string) => {
    setCharacterName(name);
  };

  const handleDescriptionChange = (description: string) => {
    setCharacterDescription(description);
  };

  const handleLevelChange = (newLevel: number) => {
    if (newLevel < 1 || newLevel > 20) return;
    setCharacterLevel(newLevel);
  };

  const handleImageChange = (image: string | null) => {
    setCharacterImage(image);
    if (image === null) {
      localStorage.removeItem('detetive-character-image');
    }
  };

  // Calcular nível efetivo para o equipamento selecionado
  const effectiveLevel = getEffectiveLevel(characterLevel, selectedEquipment);

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
        <CharacterHeader
          characterName={characterName}
          characterDescription={characterDescription}
          characterLevel={characterLevel}
          characterImage={characterImage}
          themeColor="amber"
          defaultIcon="🕵️"
          onNameChange={handleNameChange}
          onDescriptionChange={handleDescriptionChange}
          onLevelChange={handleLevelChange}
          onImageChange={handleImageChange}
        />

        {/* Equipment Tabs */}
        <EquipmentTabs
          equipments={DETETIVE_EQUIPMENTS}
          selectedId={selectedEquipment}
          onSelect={handleEquipmentSelect}
        />

        {/* Equipment Content */}
        <div className="mt-8">
          {selectedEquipment === 'cao' && <CaoPage level={effectiveLevel} onLevelChange={handleLevelChange} />}
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
