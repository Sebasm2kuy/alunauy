import { create } from "zustand";
import { saveSettings } from "@/lib/save-settings";

type SiteSettings = {
  siteTitle: string;
  themeColor: string;
};

type CMSStore = {
  settings: SiteSettings;
  updateSiteSettings: (newSettings: SiteSettings) => Promise<void>;
};

export const useCMSStore = create<CMSStore>((set) => ({
  settings: {
    siteTitle: "Mi sitio",
    themeColor: "#000000",
  },
  updateSiteSettings: async (newSettings) => {
    try {
      await saveSettings(newSettings); // Llama al backend (src/pages/api/save.ts)
      set({ settings: newSettings });  // Actualiza en memoria
      console.log("Configuración guardada con éxito");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  },
}));
