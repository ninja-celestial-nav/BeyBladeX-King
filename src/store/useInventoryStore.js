import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInventoryStore = create(
  persist(
    (set, get) => ({
      // 武器庫: { partId: quantity }
      inventory: {},
      // 已儲存的牌組
      savedDecks: [],
      // 當前編輯中的牌組
      currentDeck: {
        slot1: { blade: null, ratchet: null, bit: null, role: '先鋒' },
        slot2: { blade: null, ratchet: null, bit: null, role: '中堅' },
        slot3: { blade: null, ratchet: null, bit: null, role: '大將' },
      },

      // === 武器庫操作 ===
      addPart: (partId, qty = 1) => set(state => ({
        inventory: {
          ...state.inventory,
          [partId]: (state.inventory[partId] || 0) + qty,
        }
      })),

      removePart: (partId) => set(state => {
        const next = { ...state.inventory };
        delete next[partId];
        return { inventory: next };
      }),

      updateQuantity: (partId, qty) => set(state => {
        if (qty <= 0) {
          const next = { ...state.inventory };
          delete next[partId];
          return { inventory: next };
        }
        return { inventory: { ...state.inventory, [partId]: qty } };
      }),

      clearInventory: () => set({ inventory: {} }),

      bulkAddParts: (partIds) => set(state => {
        const next = { ...state.inventory };
        partIds.forEach(id => { next[id] = (next[id] || 0) + 1; });
        return { inventory: next };
      }),

      getPartCount: (partId) => get().inventory[partId] || 0,

      // === 牌組操作 ===
      setSlotPart: (slotKey, partType, partId) => set(state => ({
        currentDeck: {
          ...state.currentDeck,
          [slotKey]: { ...state.currentDeck[slotKey], [partType]: partId },
        }
      })),

      setSlotRole: (slotKey, role) => set(state => ({
        currentDeck: {
          ...state.currentDeck,
          [slotKey]: { ...state.currentDeck[slotKey], role },
        }
      })),

      clearSlot: (slotKey) => set(state => ({
        currentDeck: {
          ...state.currentDeck,
          [slotKey]: { blade: null, ratchet: null, bit: null, role: state.currentDeck[slotKey].role },
        }
      })),

      clearDeck: () => set({
        currentDeck: {
          slot1: { blade: null, ratchet: null, bit: null, role: '先鋒' },
          slot2: { blade: null, ratchet: null, bit: null, role: '中堅' },
          slot3: { blade: null, ratchet: null, bit: null, role: '大將' },
        }
      }),

      saveDeck: (name) => set(state => ({
        savedDecks: [...state.savedDecks, { name, deck: { ...state.currentDeck }, date: new Date().toISOString() }]
      })),

      loadDeck: (index) => set(state => ({
        currentDeck: { ...state.savedDecks[index].deck }
      })),

      deleteSavedDeck: (index) => set(state => ({
        savedDecks: state.savedDecks.filter((_, i) => i !== index)
      })),

      applyRecommendation: (rec) => set({
        currentDeck: {
          slot1: { blade: rec[0].blade, ratchet: rec[0].ratchet, bit: rec[0].bit, role: rec[0].role },
          slot2: { blade: rec[1].blade, ratchet: rec[1].ratchet, bit: rec[1].bit, role: rec[1].role },
          slot3: { blade: rec[2].blade, ratchet: rec[2].ratchet, bit: rec[2].bit, role: rec[2].role },
        }
      }),

      // === 衝突檢測 ===
      getUsedParts: (excludeSlot) => {
        const deck = get().currentDeck;
        const used = new Set();
        Object.entries(deck).forEach(([key, slot]) => {
          if (key !== excludeSlot) {
            if (slot.blade) used.add(slot.blade);
            if (slot.ratchet) used.add(slot.ratchet);
            if (slot.bit) used.add(slot.bit);
          }
        });
        return used;
      },

      isDeckValid: () => {
        const deck = get().currentDeck;
        const allParts = [];
        Object.values(deck).forEach(slot => {
          if (slot.blade) allParts.push(slot.blade);
          if (slot.ratchet) allParts.push(slot.ratchet);
          if (slot.bit) allParts.push(slot.bit);
        });
        const isComplete = allParts.length === 9;
        const isUnique = new Set(allParts).size === allParts.length;
        return { isComplete, isUnique, isValid: isComplete && isUnique };
      },
    }),
    { name: 'beyblade-x-king-storage' }
  )
);

export default useInventoryStore;
