'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EquipmentTabs from '../components/EquipmentTabs';
import CharacterHeader from '../components/CharacterHeader';
import LevelUpModal from '../components/LevelUpModal';
import { SOLDADO_EQUIPMENTS, getEffectiveLevel } from '@/types/equipment';
import { LevelUpRequirement, LevelUpData } from '@/types/levelup';
import DebugButton from './DebugButton';
import EspadaPage, { EspadaPageRef } from './espada/page';

interface SoldadoPageProps {
  readOnly?: boolean;
  initialData?: Record<string, string>;
}

export default function SoldadoPage({ readOnly = false, initialData }: SoldadoPageProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('espada');
  const [isLoaded, setIsLoaded] = useState(false);
  const [characterName, setCharacterName] = useState('Moyza');
  const [characterDescription, setCharacterDescription] = useState('Soldado Desertor');
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpRequirements, setLevelUpRequirements] = useState<LevelUpRequirement[]>([]);
  const [pendingLevel, setPendingLevel] = useState<number | null>(null);
  const router = useRouter();

  // Refs for equipment pages
  const espadaPageRef = useRef<EspadaPageRef>(null);

  // Check if user has selected a character
  useEffect(() => {
    // Se readOnly, carregar dados do initialData ao invés do localStorage
    if (readOnly && initialData) {
      // Load from initialData
      const savedEquipment = initialData['selected-equipment-soldado'];
      if (savedEquipment) setSelectedEquipment(savedEquipment);

      const savedName = initialData['soldado-character-name'];
      const savedDesc = initialData['soldado-character-description'];
      const savedLevel = initialData['soldado-character-level'];
      const savedImage = initialData['soldado-character-image'];

      if (savedName) setCharacterName(savedName);
      if (savedDesc) setCharacterDescription(savedDesc);
      if (savedImage) setCharacterImage(savedImage);
      if (savedLevel) setCharacterLevel(parseInt(savedLevel));

      setIsLoaded(true);
      return;
    }

    // Modo normal: carregar do localStorage
    const selectedCharacter = localStorage.getItem('selected-character');
    if (selectedCharacter !== 'soldado') {
      // Redirect to character selection if not soldado
      router.push('/');
      return;
    }

    // Load selected equipment from localStorage
    const savedEquipment = localStorage.getItem('selected-equipment-soldado');
    if (savedEquipment) {
      setSelectedEquipment(savedEquipment);
    }

    // Load character name, description, image and level
    const savedName = localStorage.getItem('soldado-character-name');
    const savedDesc = localStorage.getItem('soldado-character-description');
    const savedLevel = localStorage.getItem('soldado-character-level');
    const savedImage = localStorage.getItem('soldado-character-image');

    if (savedName) setCharacterName(savedName);
    if (savedDesc) setCharacterDescription(savedDesc);
    if (savedImage) setCharacterImage(savedImage);
    if (savedLevel) setCharacterLevel(parseInt(savedLevel));

    setIsLoaded(true);
  }, [router, readOnly, initialData]);

  // Save selected equipment to localStorage (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('selected-equipment-soldado', selectedEquipment);
    }
  }, [selectedEquipment, isLoaded, readOnly]);

  // Save character name, description and image (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('soldado-character-name', characterName);
      localStorage.setItem('soldado-character-description', characterDescription);
      if (characterImage) {
        localStorage.setItem('soldado-character-image', characterImage);
      }
    }
  }, [characterName, characterDescription, characterImage, isLoaded, readOnly]);

  // Save character level (only if not readOnly)
  useEffect(() => {
    if (isLoaded && !readOnly) {
      localStorage.setItem('soldado-character-level', characterLevel.toString());
    }
  }, [characterLevel, isLoaded, readOnly]);

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

    const oldLevel = characterLevel;

    // Level-up: Collect requirements from all equipment
    if (newLevel > oldLevel) {
      setPendingLevel(newLevel);
      const requirements: LevelUpRequirement[] = [];

      // Collect from Espada
      if (SOLDADO_EQUIPMENTS.find(e => e.id === 'espada' && e.enabled)) {
        const espadaReq = espadaPageRef.current?.getLevelUpRequirement(newLevel);
        if (espadaReq) requirements.push(espadaReq);
      }

      // TODO: Collect from other equipment when they exist

      // If there are requirements, show modal
      if (requirements.length > 0) {
        setLevelUpRequirements(requirements);
        setShowLevelUpModal(true);
      } else {
        // No requirements, just update level directly
        setCharacterLevel(newLevel);
        // Also update equipment levels that don't need modal
        if (SOLDADO_EQUIPMENTS.find(e => e.id === 'espada' && e.enabled)) {
          espadaPageRef.current?.confirmLevelUp({
            equipmentId: 'espada',
            level: newLevel,
          });
        }
      }
    } else {
      // Level-down: Just update level (equipment pages will handle cleanup)
      setCharacterLevel(newLevel);
    }
  };

  const handleLevelUpConfirm = (allData: LevelUpData[]) => {
    // Distribute data to each equipment
    allData.forEach((data) => {
      if (data.equipmentId === 'espada') {
        espadaPageRef.current?.confirmLevelUp(data);
      }
      // TODO: Handle other equipment
    });

    // Update character level
    if (pendingLevel) {
      setCharacterLevel(pendingLevel);
    }

    // Close modal
    setShowLevelUpModal(false);
    setLevelUpRequirements([]);
    setPendingLevel(null);
  };

  const handleLevelUpCancel = () => {
    // Don't update level, just close modal
    setShowLevelUpModal(false);
    setLevelUpRequirements([]);
    setPendingLevel(null);
  };

  const handleImageChange = (image: string | null) => {
    setCharacterImage(image);
    if (image === null) {
      localStorage.removeItem('soldado-character-image');
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
          themeColor="red"
          defaultIcon="⚔️"
          onNameChange={handleNameChange}
          onDescriptionChange={handleDescriptionChange}
          onLevelChange={handleLevelChange}
          onImageChange={handleImageChange}
          readOnly={readOnly}
          characterType="soldado"
        />

        {/* Equipment Tabs */}
        <EquipmentTabs
          equipments={SOLDADO_EQUIPMENTS}
          selectedId={selectedEquipment}
          onSelect={handleEquipmentSelect}
        />

        {/* Equipment Content */}
        <div className="mt-8">
          {selectedEquipment === 'espada' && (
            <EspadaPage
              ref={espadaPageRef}
              level={effectiveLevel}
              readOnly={readOnly}
              initialData={initialData}
            />
          )}
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

      {/* Level Up Modal */}
      {showLevelUpModal && (
        <LevelUpModal
          requirements={levelUpRequirements}
          onConfirm={handleLevelUpConfirm}
          onCancel={handleLevelUpCancel}
          themeColor="red"
        />
      )}
    </div>
  );
}
