import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, DesignerElement, DocType, PaperSize } from "@/types/designer";

interface DesignerStore extends AppState {
  // UI State
  selectedId: string | null;
  zoom: number;
  previewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;

  // Actions
  setDocType: (type: DocType) => void;
  setPaperSize: (size: PaperSize) => void;
  selectElement: (id: string | null) => void;
  addElement: (el: DesignerElement) => void;
  updateElement: (id: string, updates: Partial<DesignerElement>) => void;
  removeElement: (id: string) => void;
  setZoom: (zoom: number) => void;
  togglePreview: () => void;
  toggleGrid: () => void;
}

const initialState: AppState = {
  docType: "rx",
  sample: "short",
  currency: "SAR",
  docs: {
    rx: { paper: "A5", font: "Cairo", els: [] },
    invoice: { paper: "A4", font: "Cairo", els: [] },
  },
};

export const useDesignerStore = create<DesignerStore>()(
  persist(
    (set) => ({
      ...initialState,
      selectedId: null,
      zoom: 1,
      previewMode: false,
      showGrid: true,
      snapToGrid: true,

      setDocType: (type) => set({ docType: type, selectedId: null }),
      
      setPaperSize: (size) =>
        set((state) => ({
          docs: {
            ...state.docs,
            [state.docType]: { ...state.docs[state.docType], paper: size },
          },
        })),

      selectElement: (id) => set({ selectedId: id }),

      addElement: (el) =>
        set((state) => {
          const currentDoc = state.docs[state.docType];
          return {
            docs: {
              ...state.docs,
              [state.docType]: {
                ...currentDoc,
                els: [...currentDoc.els, el],
              },
            },
          };
        }),

      updateElement: (id, updates) =>
        set((state) => {
          const currentDoc = state.docs[state.docType];
          return {
            docs: {
              ...state.docs,
              [state.docType]: {
                ...currentDoc,
                els: currentDoc.els.map((el) =>
                  el.id === id ? { ...el, ...updates } : el
                ),
              },
            },
          };
        }),

      removeElement: (id) =>
        set((state) => {
          const currentDoc = state.docs[state.docType];
          return {
            docs: {
              ...state.docs,
              [state.docType]: {
                ...currentDoc,
                els: currentDoc.els.filter((el) => el.id !== id),
              },
            },
            selectedId: state.selectedId === id ? null : state.selectedId,
          };
        }),

      setZoom: (zoom) => set({ zoom }),
      togglePreview: () => set((state) => ({ previewMode: !state.previewMode, selectedId: null })),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    }),
    {
      name: "dental-designer-storage",
      partialize: (state) => ({ docs: state.docs, docType: state.docType, currency: state.currency }),
    }
  )
);
