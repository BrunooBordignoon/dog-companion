// ============================================================================
// CÓDIGO ANTERIOR - COMENTADO PARA PRESERVAÇÃO
// ============================================================================
// 'use client';
//
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import DebugButton from './DebugButton';
//
// export default function Home() {
//   const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [pendingCharacterId, setPendingCharacterId] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//
//   // Check if user has already selected a character
//   useEffect(() => {
//     const saved = localStorage.getItem('selected-character');
//     if (saved) {
//       setSelectedCharacter(saved);
//       // Redirect to their character sheet
//       router.push(`/${saved}`);
//     } else {
//       setIsLoading(false);
//     }
//   }, [router]);
//
//   const handleCharacterClick = (characterId: string) => {
//     setPendingCharacterId(characterId);
//     setShowConfirmModal(true);
//   };
//
//   const confirmSelection = () => {
//     if (pendingCharacterId) {
//       localStorage.setItem('selected-character', pendingCharacterId);
//       setSelectedCharacter(pendingCharacterId);
//       setShowConfirmModal(false);
//       router.push(`/${pendingCharacterId}`);
//     }
//   };
//
//   const cancelSelection = () => {
//     setPendingCharacterId(null);
//     setShowConfirmModal(false);
//   };
//
//   const characters = [
//     {
//       id: 'detetive',
//       name: 'José',
//       icon: '🔍',
//       color: 'from-amber-900/40 to-amber-950/40',
//       borderColor: 'border-amber-700/50',
//       available: true,
//     },
//     {
//       id: 'soldado',
//       name: 'Moyza',
//       icon: '⚔️',
//       color: 'from-red-900/40 to-red-950/40',
//       borderColor: 'border-red-700/50',
//       available: true,
//     },
//     {
//       id: 'feiticeiro',
//       name: 'Welliton',
//       icon: '🌾',
//       color: 'from-purple-900/40 to-purple-950/40',
//       borderColor: 'border-purple-700/50',
//       available: true,
//     },
//     {
//       id: 'personagem4',
//       name: 'Em Breve',
//       icon: '❓',
//       color: 'from-neutral-800/40 to-neutral-900/40',
//       borderColor: 'border-neutral-700/50',
//       available: false,
//     },
//   ];
//
//   const pendingCharacter = characters.find(c => c.id === pendingCharacterId);
//
//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-neutral-950">
//         <DebugButton />
//         <p className="text-neutral-400">Carregando...</p>
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen bg-neutral-950 text-neutral-100">
//       <DebugButton />
//
//       <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
//
//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h1 className="mb-4 font-serif text-5xl font-bold text-amber-100 sm:text-6xl">
//             Fichas de Personagem
//           </h1>
//           <p className="text-lg text-neutral-400">
//             Escolha seu personagem para gerenciar sua ficha
//           </p>
//           <div className="mt-4 flex items-center justify-center gap-2">
//             <div className="h-px w-16 bg-amber-700/50"></div>
//             <span className="text-amber-600">⚔️</span>
//             <div className="h-px w-16 bg-amber-700/50"></div>
//           </div>
//         </div>
//
//         {/* Character Cards */}
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
//           {characters.map((character) => (
//             <div
//               key={character.id}
//               onClick={() => character.available && handleCharacterClick(character.id)}
//               className={`group relative overflow-hidden rounded-lg border-2 ${character.borderColor} bg-gradient-to-br ${character.color} p-6 shadow-xl transition-all ${
//                 character.available
//                   ? 'hover:scale-105 hover:shadow-2xl cursor-pointer'
//                   : 'opacity-60 cursor-not-allowed'
//               }`}
//             >
//               {/* Icon */}
//               <div className="mb-4 flex items-center justify-center">
//                 <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 ${character.borderColor} bg-neutral-900/50 text-5xl transition-transform ${
//                   character.available ? 'group-hover:scale-110' : ''
//                 }`}>
//                   {character.icon}
//                 </div>
//               </div>
//
//               {/* Content */}
//               <div className="text-center">
//                 <h2 className="mb-4 font-serif text-2xl font-bold text-amber-100">
//                   {character.name}
//                 </h2>
//
//                 {/* Status Badge */}
//                 {character.available ? (
//                   <span className="inline-block rounded-full bg-green-900/50 border border-green-700/50 px-3 py-1 text-xs font-semibold text-green-300">
//                     Disponível
//                   </span>
//                 ) : (
//                   <span className="inline-block rounded-full bg-neutral-800/50 border border-neutral-700/50 px-3 py-1 text-xs font-semibold text-neutral-500">
//                     Em Desenvolvimento
//                   </span>
//                 )}
//               </div>
//
//               {/* Hover Effect Border */}
//               {character.available && (
//                 <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-600/0 via-amber-600/0 to-amber-600/0 opacity-0 transition-opacity group-hover:from-amber-600/10 group-hover:via-amber-600/5 group-hover:to-amber-600/10 group-hover:opacity-100"></div>
//               )}
//             </div>
//           ))}
//         </div>
//
//         {/* Footer */}
//         <div className="mt-12 text-center text-sm text-neutral-500">
//           <p>Sistema de fichas para campanha de RPG</p>
//         </div>
//       </div>
//
//       {/* Confirmation Modal */}
//       {showConfirmModal && pendingCharacter && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
//           <div className="w-full max-w-md rounded-lg border-2 border-amber-700/50 bg-neutral-900 p-6 shadow-2xl">
//             <div className="mb-4 flex justify-center">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-700/50 bg-neutral-950/50 text-3xl">
//                 ⚠️
//               </div>
//             </div>
//
//             <h2 className="mb-4 text-center font-serif text-2xl font-bold text-amber-100">
//               Confirmar Seleção de Personagem
//             </h2>
//
//             <div className="mb-6 rounded-lg border border-amber-700/30 bg-amber-950/20 p-4">
//               <p className="mb-3 text-center text-lg font-semibold text-amber-200">
//                 {pendingCharacter.icon} {pendingCharacter.name}
//               </p>
//               <p className="text-sm text-neutral-300">
//                 Você está prestes a selecionar <span className="font-bold text-amber-300">{pendingCharacter.name}</span> como seu personagem.
//               </p>
//             </div>
//
//             <div className="mb-6 rounded-lg border border-red-700/50 bg-red-950/20 p-4">
//               <p className="text-sm font-semibold text-red-300">⚠️ ATENÇÃO:</p>
//               <p className="mt-2 text-sm text-neutral-300">
//                 Esta é uma escolha <span className="font-bold text-red-400">permanente</span> e <span className="font-bold text-red-400">não pode ser revertida</span>.
//                 Certifique-se de que este é realmente o seu personagem antes de confirmar.
//               </p>
//             </div>
//
//             <div className="flex gap-3">
//               <button
//                 onClick={cancelSelection}
//                 className="flex-1 rounded-lg border-2 border-neutral-700 bg-neutral-800 px-4 py-3 font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={confirmSelection}
//                 className="flex-1 rounded-lg border-2 border-amber-700 bg-amber-900/50 px-4 py-3 font-semibold text-amber-100 transition-colors hover:bg-amber-900/70"
//               >
//                 Confirmar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ============================================================================
// FIM DO CÓDIGO ANTERIOR
// ============================================================================

// NOVA PÁGINA ESTÁTICA - Diagrama do Turno de Combate D&D 2024

// Dados das ações
const actions = [
  {
    title: "Ataque",
    description:
      "Faça ataques com arma ou desarmado. Se tiver Ataque Extra, os golpes extras entram dentro desta mesma Ação.",
  },
  {
    title: "Magia",
    description:
      'Conjure uma magia com tempo de conjuração "Ação", ou ative um item/efeito mágico que exija a Ação de Magia.',
  },
  {
    title: "Disparada (Dash)",
    description:
      "Ganha movimento extra igual à sua Velocidade neste turno. Ótimo para perseguir ou fugir.",
  },
  {
    title: "Desengajar",
    description:
      "Seu movimento deixa de provocar Ataques de Oportunidade pelo resto do turno.",
  },
  {
    title: "Esquiva (Dodge)",
    description:
      "Até seu próximo turno: ataques contra você têm Desvantagem, e certos testes de Dex ganham vantagem.",
  },
  {
    title: "Ajudar (Help)",
    description:
      "Concede Vantagem a um aliado no próximo teste ou ataque dele, ou presta uma ajuda rápida (critério do Mestre).",
  },
  {
    title: "Esconder",
    description:
      "Faça um teste de Furtividade para ficar Oculto — você precisa de cobertura ou algo para se esconder atrás.",
  },
  {
    title: "Preparar (Ready)",
    description:
      "Defina um gatilho e segure uma ação. Quando o gatilho acontecer, você gasta sua Reação para agir.",
  },
  {
    title: "Procurar / Estudar",
    description:
      "Procurar: encontrar coisas/perigos (Percepção). Estudar: lembrar ou deduzir informações (testes de Inteligência).",
  },
  {
    title: "Influenciar",
    description:
      "Tente mudar a atitude ou decisão de uma criatura durante o combate usando perícias sociais.",
  },
  {
    title: "Utilizar",
    description:
      'Use um objeto não-mágico quando for complexo demais para uma "interação grátis" (Mestre decide).',
  },
];

// Componente Tag para os exemplos
function Tag({
  variant,
  children,
}: {
  variant: "move" | "action" | "bonus" | "react";
  children: React.ReactNode;
}) {
  const colors = {
    move: "bg-[hsla(200,50%,50%,0.20)] text-[hsl(200,55%,55%)]",
    action: "bg-[hsla(4,50%,50%,0.20)] text-[hsl(4,65%,60%)]",
    bonus: "bg-[hsla(42,55%,50%,0.20)] text-[hsl(42,70%,58%)]",
    react: "bg-[hsla(275,45%,50%,0.20)] text-[hsl(275,50%,65%)]",
  };

  return (
    <span
      className={`inline-block px-[7px] py-[1px] rounded-full text-[10px] font-bold tracking-[0.2px] align-[1px] ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

// Componente Tip (chip de dica)
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-xs leading-tight border border-white/[0.08] bg-black/25 text-[#b8ad96]">
      {children}
    </span>
  );
}

// Componente Connector (seta entre fases)
function Connector() {
  return (
    <div className="flex items-center justify-center h-[18px] text-[rgba(240,210,139,0.35)] text-sm tracking-[2px] select-none">
      ▼
    </div>
  );
}

export default function Home() {
  return (
    <div
      className="min-h-screen text-[#eee5d0] font-[var(--font-nunito-sans)] leading-relaxed p-4 sm:p-6"
      style={{
        background: `
          radial-gradient(ellipse 1100px 600px at 20% 8%, hsla(200, 50%, 40%, 0.10), transparent),
          radial-gradient(ellipse 900px 500px at 80% 15%, hsla(4, 50%, 40%, 0.08), transparent),
          radial-gradient(ellipse 800px 500px at 50% 90%, hsla(275, 40%, 35%, 0.08), transparent),
          #0e0b08
        `,
      }}
    >
      <div className="max-w-[1080px] mx-auto">
        {/* Header */}
        <header
          className="text-center mb-7 px-5 py-7 rounded-2xl border border-[rgba(240,210,139,0.18)]"
          style={{
            background: `
              radial-gradient(ellipse 500px 200px at 50% 0%, hsla(42, 60%, 50%, 0.12), transparent),
              linear-gradient(180deg, rgba(255, 244, 214, 0.06), rgba(255, 244, 214, 0.02))
            `,
          }}
        >
          <h1 className="font-[var(--font-cinzel)] text-[clamp(20px,3.5vw,30px)] font-black tracking-[1.5px] uppercase text-[#f0d28b] drop-shadow-[0_2px_20px_rgba(212,168,75,0.25)]">
            Diagrama do Turno de Combate — D&D 2024
          </h1>
          <p className="mt-2.5 text-sm text-[#b8ad96] max-w-[68ch] mx-auto">
            Seu turno é um kit: combine <strong className="text-[#eee5d0] font-bold">Movimento</strong>,{" "}
            <strong className="text-[#eee5d0] font-bold">1 Ação</strong>, às vezes{" "}
            <strong className="text-[#eee5d0] font-bold">1 Ação Bônus</strong>, talvez{" "}
            <strong className="text-[#eee5d0] font-bold">1 Reação</strong> (quando um gatilho
            acontecer), além de pequenos extras grátis como uma fala curta e uma interação com
            objeto.
          </p>

          {/* Legend */}
          <div className="flex justify-center flex-wrap gap-2.5 gap-x-4 mt-4">
            <span className="flex items-center gap-[7px] text-xs font-semibold tracking-[0.3px] uppercase">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: "hsl(200, 55%, 55%)" }}
              />
              Movimento
            </span>
            <span className="flex items-center gap-[7px] text-xs font-semibold tracking-[0.3px] uppercase">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: "hsl(4, 65%, 60%)" }}
              />
              Ação
            </span>
            <span className="flex items-center gap-[7px] text-xs font-semibold tracking-[0.3px] uppercase">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: "hsl(42, 70%, 58%)" }}
              />
              Ação Bônus
            </span>
            <span className="flex items-center gap-[7px] text-xs font-semibold tracking-[0.3px] uppercase">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: "hsl(275, 50%, 65%)" }}
              />
              Reação
            </span>
            <span className="flex items-center gap-[7px] text-xs font-semibold tracking-[0.3px] uppercase">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: "hsl(145, 40%, 55%)" }}
              />
              Grátis
            </span>
          </div>
        </header>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Flow principal */}
          <div className="flex flex-col gap-1.5">
            {/* 1 · MOVIMENTO */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[hsla(200,50%,55%,0.30)]"
              style={{
                background: "hsla(200, 50%, 45%, 0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 400px 120px at 5% 20%, hsla(200, 60%, 50%, 0.15), transparent)",
                }}
              />
              <div className="relative flex items-center gap-3 flex-wrap mb-3">
                <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg flex-shrink-0 bg-[hsla(200,50%,50%,0.22)] border border-[hsla(200,50%,55%,0.30)]">
                  ⇢
                </div>
                <span className="font-[var(--font-cinzel)] text-base font-bold tracking-[0.6px] uppercase text-[hsl(200,55%,55%)]">
                  Movimento
                </span>
                <span className="ml-auto text-[11px] font-bold tracking-[0.3px] px-3 py-[5px] rounded-full whitespace-nowrap bg-[hsla(200,45%,45%,0.18)] border border-dashed border-[hsla(200,50%,55%,0.30)] text-[hsl(200,55%,55%)]">
                  Até sua Velocidade · pode dividir
                </span>
              </div>
              <p className="relative text-[13px] text-[#b8ad96] mb-3.5 leading-relaxed">
                Você tem um <strong className="text-[#eee5d0]">pool de pés/metros</strong> igual à
                sua Velocidade. Gaste tudo de uma vez ou divida: mova um pouco, faça outra coisa,
                mova o resto.
              </p>
              <div className="relative flex flex-wrap gap-2">
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Dividir:</strong> mover → agir → mover
                  de novo
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Terreno difícil:</strong> cada 1,5m
                  custa 3m de movimento
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Se jogar no chão (Prone):</strong>{" "}
                  custa 0 (grátis!)
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Levantar:</strong> custa metade da sua
                  Velocidade
                </Tip>
              </div>
            </div>

            <Connector />

            {/* 2 · AÇÃO */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[hsla(4,55%,55%,0.30)]"
              style={{
                background: "hsla(4, 55%, 45%, 0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 400px 120px at 5% 20%, hsla(4, 65%, 50%, 0.15), transparent)",
                }}
              />
              <div className="relative flex items-center gap-3 flex-wrap mb-3">
                <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg flex-shrink-0 bg-[hsla(4,50%,50%,0.22)] border border-[hsla(4,55%,55%,0.30)]">
                  ⚔
                </div>
                <span className="font-[var(--font-cinzel)] text-base font-bold tracking-[0.6px] uppercase text-[hsl(4,65%,60%)]">
                  Ação — Escolha Uma
                </span>
                <span className="ml-auto text-[11px] font-bold tracking-[0.3px] px-3 py-[5px] rounded-full whitespace-nowrap bg-[hsla(4,45%,45%,0.18)] border border-dashed border-[hsla(4,55%,55%,0.30)] text-[hsl(4,65%,60%)]">
                  A grande escolha do turno
                </span>
              </div>
              <p className="relative text-[13px] text-[#b8ad96] mb-3.5 leading-relaxed">
                Todo turno você ganha <strong className="text-[#eee5d0]">exatamente 1 Ação</strong>.
                É aqui que acontece a maior parte das coisas legais. Escolha uma das opções abaixo
                (ou algo que o Mestre permita):
              </p>

              {/* Action grid */}
              <div className="relative grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 mb-3.5">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="p-3 px-3.5 rounded-xl bg-black/[0.28] border border-[hsla(4,40%,50%,0.16)]"
                  >
                    <h3 className="font-[var(--font-cinzel)] text-xs font-bold uppercase tracking-[0.4px] text-[hsl(4,65%,60%)] mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-[1.4] text-[#b8ad96]">{action.description}</p>
                  </div>
                ))}
                {/* Wild card */}
                <div className="p-3 px-3.5 rounded-xl bg-black/[0.28] border border-dashed border-[hsla(4,40%,50%,0.16)]">
                  <h3 className="font-[var(--font-cinzel)] text-xs font-bold uppercase tracking-[0.4px] text-[hsl(4,65%,60%)] mb-1">
                    …ou pergunte ao Mestre
                  </h3>
                  <p className="text-xs leading-[1.4] text-[#b8ad96]">
                    A lista cobre o comum, mas o Mestre pode permitir ações criativas que façam
                    sentido na situação.
                  </p>
                </div>
              </div>

              {/* Callout */}
              <div className="relative mt-3.5 p-3.5 px-4 rounded-xl bg-black/[0.22] border border-[rgba(240,210,139,0.14)] text-xs text-[#b8ad96] leading-relaxed">
                <div className="font-[var(--font-cinzel)] font-bold text-[11px] uppercase tracking-[0.4px] text-[#d4a84b] mb-1">
                  ⚠ Regra de Slot de Magia (2024 / SRD 5.2)
                </div>
                Normalmente você só pode gastar{" "}
                <strong className="text-[#eee5d0]">1 slot de magia por turno</strong>. Então, se
                conjurar uma magia que gasta slot como Ação Bônus, sua Ação não pode ser outra magia
                que gaste slot (cantrips continuam liberados). Isso impede "duas magias grandes" no
                mesmo turno.
              </div>
            </div>

            <Connector />

            {/* 3 · AÇÃO BÔNUS */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[hsla(42,60%,55%,0.30)]"
              style={{
                background: "hsla(42, 60%, 45%, 0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 400px 120px at 5% 20%, hsla(42, 70%, 50%, 0.15), transparent)",
                }}
              />
              <div className="relative flex items-center gap-3 flex-wrap mb-3">
                <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg flex-shrink-0 bg-[hsla(42,55%,50%,0.22)] border border-[hsla(42,60%,55%,0.30)]">
                  ✦
                </div>
                <span className="font-[var(--font-cinzel)] text-base font-bold tracking-[0.6px] uppercase text-[hsl(42,70%,58%)]">
                  Ação Bônus
                </span>
                <span className="ml-auto text-[11px] font-bold tracking-[0.3px] px-3 py-[5px] rounded-full whitespace-nowrap bg-[hsla(42,50%,45%,0.18)] border border-dashed border-[hsla(42,60%,55%,0.30)] text-[hsl(42,70%,58%)]">
                  Só se algo conceder uma
                </span>
              </div>
              <p className="relative text-[13px] text-[#b8ad96] mb-3.5 leading-relaxed">
                Você <strong className="text-[#eee5d0]">não ganha uma Ação Bônus automaticamente</strong>.
                Você só tem uma se alguma habilidade de classe, magia ou item disser explicitamente.
                Jogadores novos: se nada na sua ficha diz "ação bônus", pule esta etapa.
              </p>
              <div className="relative flex flex-wrap gap-2">
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Limite:</strong> 1 por turno, no
                  máximo
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Exemplos:</strong> Ação Ardilosa do
                  Ladino, certas magias, ataque com arma secundária
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Momento:</strong> qualquer ponto do
                  seu turno (salvo se a habilidade diga o contrário)
                </Tip>
              </div>
            </div>

            <Connector />

            {/* 4 · REAÇÃO */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[hsla(275,45%,55%,0.30)]"
              style={{
                background: "hsla(275, 45%, 45%, 0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 400px 120px at 5% 20%, hsla(275, 55%, 50%, 0.15), transparent)",
                }}
              />
              <div className="relative flex items-center gap-3 flex-wrap mb-3">
                <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg flex-shrink-0 bg-[hsla(275,45%,50%,0.22)] border border-[hsla(275,45%,55%,0.30)]">
                  ⟲
                </div>
                <span className="font-[var(--font-cinzel)] text-base font-bold tracking-[0.6px] uppercase text-[hsl(275,50%,65%)]">
                  Reação
                </span>
                <span className="ml-auto text-[11px] font-bold tracking-[0.3px] px-3 py-[5px] rounded-full whitespace-nowrap bg-[hsla(275,40%,45%,0.18)] border border-dashed border-[hsla(275,45%,55%,0.30)] text-[hsl(275,50%,65%)]">
                  Baseada em gatilho · qualquer turno
                </span>
              </div>
              <p className="relative text-[13px] text-[#b8ad96] mb-3.5 leading-relaxed">
                Uma Reação acontece{" "}
                <strong className="text-[#eee5d0]">em resposta a um gatilho</strong> — pode disparar
                no seu turno ou no de outra pessoa. Depois de usá-la, você não pode reagir de novo
                até o início do seu próximo turno.
              </p>
              <div className="relative flex flex-wrap gap-2">
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Limite:</strong> 1 por rodada (reseta
                  no início do seu turno)
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Mais comum:</strong> Ataque de
                  Oportunidade (inimigo sai do seu alcance)
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Magias:</strong> Escudo (Shield),
                  Contramágica (Counterspell), Absorver Elementos…
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Preparar:</strong> gasta sua Reação
                  quando o gatilho disparar
                </Tip>
              </div>
            </div>

            <Connector />

            {/* 5 · COISAS GRÁTIS */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[hsla(145,35%,50%,0.25)]"
              style={{
                background: "hsla(145, 35%, 40%, 0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 400px 120px at 5% 20%, hsla(145, 45%, 45%, 0.12), transparent)",
                }}
              />
              <div className="relative flex items-center gap-3 flex-wrap mb-3">
                <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg flex-shrink-0 bg-[hsla(145,40%,45%,0.22)] border border-[hsla(145,35%,50%,0.25)]">
                  ☍
                </div>
                <span className="font-[var(--font-cinzel)] text-base font-bold tracking-[0.6px] uppercase text-[hsl(145,40%,55%)]">
                  Extras Grátis
                </span>
                <span className="ml-auto text-[11px] font-bold tracking-[0.3px] px-3 py-[5px] rounded-full whitespace-nowrap bg-[hsla(145,35%,40%,0.18)] border border-dashed border-[hsla(145,35%,50%,0.25)] text-[hsl(145,40%,55%)]">
                  Rápido e simples
                </span>
              </div>
              <p className="relative text-[13px] text-[#b8ad96] mb-3.5 leading-relaxed">
                Pequenas coisas que não custam Ação, Ação Bônus nem Reação. Mantenha-as{" "}
                <strong className="text-[#eee5d0]">curtas e simples</strong> — qualquer coisa
                complexa vira a ação Utilizar.
              </p>
              <div className="relative flex flex-wrap gap-2">
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Falar:</strong> poucas palavras ou um
                  gesto
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">1 interação com objeto:</strong>{" "}
                  sacar/guardar arma, abrir porta, puxar alavanca
                </Tip>
                <Tip>
                  <strong className="text-[#eee5d0] font-bold">Quer mais?</strong> provavelmente
                  precisará da ação Utilizar
                </Tip>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Como Ler Este Diagrama */}
            <div
              className="p-[18px] rounded-2xl border border-[rgba(240,210,139,0.14)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 244, 214, 0.05), rgba(255, 244, 214, 0.02))",
              }}
            >
              <h2 className="font-[var(--font-cinzel)] text-[13px] font-bold uppercase tracking-[0.5px] text-[#f0d28b] mb-3">
                Como Ler Este Diagrama
              </h2>
              <ul className="p-0">
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[hsl(200,55%,55%)]">Movimento</strong> é um pool — gaste
                  tudo de uma vez ou divida entre outras ações.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[hsl(4,65%,60%)]">Ação</strong> é a grande decisão do turno
                  — escolha exatamente uma.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[hsl(42,70%,58%)]">Ação Bônus</strong> é opcional — você só
                  tem se alguma habilidade conceder.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[hsl(275,50%,65%)]">Reação</strong> é "poder fora do turno"
                  — espera um gatilho e pode acontecer no turno de qualquer um.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[hsl(145,40%,55%)]">Extras grátis</strong> são coisinhas
                  rápidas; qualquer coisa maior vira uma Ação.
                </li>
              </ul>
            </div>

            {/* Exemplos de Turnos */}
            <div
              className="p-[18px] rounded-2xl border border-[rgba(240,210,139,0.14)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 244, 214, 0.05), rgba(255, 244, 214, 0.02))",
              }}
            >
              <h2 className="font-[var(--font-cinzel)] text-[13px] font-bold uppercase tracking-[0.5px] text-[#f0d28b] mb-3">
                Exemplos de Turnos
              </h2>

              <div className="p-3 px-3.5 rounded-xl bg-black/[0.22] border border-[rgba(240,210,139,0.10)] mb-2.5">
                <div className="font-[var(--font-cinzel)] text-[11px] font-bold uppercase tracking-[0.5px] text-[#d4a84b] mb-[5px]">
                  ⚔ Guerreiro
                </div>
                <p className="text-xs text-[#b8ad96] leading-[1.45]">
                  <Tag variant="move">Mover</Tag> 9m até o orc →{" "}
                  <Tag variant="action">Ação: Ataque</Tag> (dois golpes com Ataque Extra) →{" "}
                  <Tag variant="bonus">Ação Bônus</Tag> Retomar Fôlego para se curar → depois,{" "}
                  <Tag variant="react">Reação</Tag> Ataque de Oportunidade quando o orc fugir.
                </p>
              </div>

              <div className="p-3 px-3.5 rounded-xl bg-black/[0.22] border border-[rgba(240,210,139,0.10)] mb-2.5">
                <div className="font-[var(--font-cinzel)] text-[11px] font-bold uppercase tracking-[0.5px] text-[#d4a84b] mb-[5px]">
                  🗡 Ladino
                </div>
                <p className="text-xs text-[#b8ad96] leading-[1.45]">
                  <Tag variant="move">Mover</Tag> 4,5m → <Tag variant="action">Ação: Ataque</Tag>{" "}
                  (Ataque Furtivo!) → <Tag variant="bonus">Ação Bônus</Tag> Ação Ardilosa: Desengajar
                  → <Tag variant="move">Mover</Tag> 4,5m para longe em segurança.
                </p>
              </div>

              <div className="p-3 px-3.5 rounded-xl bg-black/[0.22] border border-[rgba(240,210,139,0.10)]">
                <div className="font-[var(--font-cinzel)] text-[11px] font-bold uppercase tracking-[0.5px] text-[#d4a84b] mb-[5px]">
                  🔮 Mago
                </div>
                <p className="text-xs text-[#b8ad96] leading-[1.45]">
                  <Tag variant="move">Mover</Tag> 1,5m atrás de cobertura →{" "}
                  <Tag variant="action">Ação: Magia</Tag> (conjurar Bola de Fogo) → sem ação bônus
                  disponível → <Tag variant="react">Reação</Tag> conjurar Escudo ao ser atacado
                  depois.
                </p>
              </div>
            </div>

            {/* Erros Comuns */}
            <div
              className="p-[18px] rounded-2xl border border-[rgba(240,210,139,0.14)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 244, 214, 0.05), rgba(255, 244, 214, 0.02))",
              }}
            >
              <h2 className="font-[var(--font-cinzel)] text-[13px] font-bold uppercase tracking-[0.5px] text-[#f0d28b] mb-3">
                Erros Comuns
              </h2>
              <ul className="p-0">
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  Achar que você <strong className="text-[#eee5d0]">sempre</strong> tem uma Ação
                  Bônus — não tem. Precisa de algo que conceda.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  Esquecer que dá para{" "}
                  <strong className="text-[#eee5d0]">dividir o movimento</strong> antes e depois da
                  Ação.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  Gastar a Reação e tentar usar <strong className="text-[#eee5d0]">outra</strong>{" "}
                  antes do início do seu próximo turno.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  Tentar conjurar{" "}
                  <strong className="text-[#eee5d0]">duas magias com slot</strong> no mesmo turno —
                  as regras 2024 geralmente bloqueiam isso.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  Confundir <strong className="text-[#eee5d0]">Desengajar</strong> (sem Ataques de
                  Oportunidade) com simplesmente sair andando (provoca um!).
                </li>
              </ul>
            </div>

            {/* Glossário Rápido */}
            <div
              className="p-[18px] rounded-2xl border border-[rgba(240,210,139,0.14)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 244, 214, 0.05), rgba(255, 244, 214, 0.02))",
              }}
            >
              <h2 className="font-[var(--font-cinzel)] text-[13px] font-bold uppercase tracking-[0.5px] text-[#f0d28b] mb-3">
                Glossário Rápido
              </h2>
              <ul className="p-0">
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[#eee5d0]">Ataque de Oportunidade</strong> — um ataque
                  corpo a corpo grátis (Reação) quando um inimigo sai do seu alcance.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[#eee5d0]">Vantagem / Desvantagem</strong> — role 2d20 e
                  pegue o maior / menor resultado.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[#eee5d0]">Prone (Caído)</strong> — no chão: ataques corpo
                  a corpo contra você têm Vantagem, à distância têm Desvantagem. Levantar custa
                  metade da Velocidade.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[#eee5d0]">Terreno Difícil</strong> — cada 1,5m de
                  movimento custa 3m.
                </li>
                <li className="text-[13px] text-[#b8ad96] my-2 leading-[1.45] list-none relative pl-[18px] before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[5px] before:text-[#d4a84b]">
                  <strong className="text-[#eee5d0]">Cantrip (Truque)</strong> — magia que pode ser
                  usada à vontade, sem gastar slot.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-3.5 border-t border-[rgba(240,210,139,0.12)] text-[11px] text-[rgba(184,173,150,0.6)] text-center">
          Terminologia baseada no SRD 5.2 / regras D&D 2024. Ações: Ataque, Disparada, Desengajar,
          Esquiva, Ajudar, Esconder, Influenciar, Magia, Preparar, Procurar, Estudar, Utilizar.
        </footer>
      </div>
    </div>
  );
}
