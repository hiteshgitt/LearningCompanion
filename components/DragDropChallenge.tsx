import React, { useState, useEffect } from 'react';
import { DragDropChallenge as DragDropType } from '@/lib/types';

interface DragDropChallengeProps {
  challenge: DragDropType;
  onChange: (answers: string) => void;
  disabled?: boolean;
}

const DragDropChallengeComponent: React.FC<DragDropChallengeProps> = ({ challenge, onChange, disabled }) => {
  // Count how many drop zones there are
  const numZones = challenge.droppableZones.filter(z => z === '___').length;
  
  // State for what is currently placed in each slot
  const [slots, setSlots] = useState<(string | null)[]>(Array(numZones).fill(null));
  
  // Available items in the bank (start with all items, remove when placed in a slot)
  const availableItems = challenge.draggableItems.filter(item => !slots.includes(item));

  useEffect(() => {
    // Notify parent of current answers (pass stringified array)
    onChange(JSON.stringify(slots.map(s => s || '')));
  }, [slots, onChange]);

  const handleDragStart = (e: React.DragEvent, item: string, sourceSlotIndex: number | null = null) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, sourceSlotIndex }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDropOnSlot = (e: React.DragEvent, targetSlotIndex: number) => {
    e.preventDefault();
    if (disabled) return;

    try {
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      const { item, sourceSlotIndex } = JSON.parse(data);

      setSlots(prev => {
        const newSlots = [...prev];
        // If moving from one slot to another
        if (sourceSlotIndex !== null) {
          const temp = newSlots[targetSlotIndex];
          newSlots[targetSlotIndex] = item;
          newSlots[sourceSlotIndex] = temp;
        } else {
          // If moving from bank to slot
          // If target slot is full, do we swap it back to bank? The bank is auto-calculated.
          newSlots[targetSlotIndex] = item;
        }
        return newSlots;
      });
    } catch (err) {
      console.error("Drop error", err);
    }
  };

  const handleDropOnBank = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      const { sourceSlotIndex } = JSON.parse(data);

      if (sourceSlotIndex !== null) {
        setSlots(prev => {
          const newSlots = [...prev];
          newSlots[sourceSlotIndex] = null;
          return newSlots;
        });
      }
    } catch (err) {
      console.error("Drop error", err);
    }
  };

  let slotCounter = 0;

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col gap-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 p-6">
      
      {/* Code Editor Area with Drop Zones */}
      <div
        className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700 font-mono text-slate-300 fira-code whitespace-pre-wrap leading-10"
        role="region"
        aria-label="Code assembly area — drop snippets into the blanks"
      >
        {challenge.droppableZones.map((zone, idx) => {
          if (zone === '___') {
            const currentSlotIndex = slotCounter++;
            const currentItem = slots[currentSlotIndex];
            
            return (
              <span
                key={idx}
                className={`inline-block min-w-[120px] h-10 align-middle mx-2 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${currentItem ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-slate-600 bg-slate-900'}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, currentSlotIndex)}
                draggable={!!currentItem && !disabled}
                onDragStart={(e) => currentItem ? handleDragStart(e, currentItem, currentSlotIndex) : e.preventDefault()}
              >
                {currentItem ? currentItem : <span className="text-slate-600 text-sm italic">Drop here</span>}
              </span>
            );
          }
          return <span key={idx}>{zone}</span>;
        })}
      </div>

      {/* Draggable Items Bank */}
      <div 
        className="min-h-[100px] bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-wrap gap-3 items-center"
        onDragOver={handleDragOver}
        onDrop={handleDropOnBank}
      >
        <div className="w-full text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Code Snippets</div>
        {availableItems.map((item, idx) => (
          <div
            key={idx}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item, null)}
            className={`px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-lg shadow-sm font-mono text-sm cursor-grab active:cursor-grabbing hover:bg-slate-700 hover:border-violet-400 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {item}
          </div>
        ))}
        {availableItems.length === 0 && (
          <div className="text-slate-600 text-sm italic w-full text-center">All snippets placed</div>
        )}
      </div>

    </div>
  );
};

export const DragDropChallenge = React.memo(DragDropChallengeComponent);
