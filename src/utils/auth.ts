import { siteConfigStore } from "@/store/cmsStore";

export async function saveCMSConfig() {
  const state = siteConfigStore.getState();

  const data = {
    pages: state.pages,
    products: state.products,
    settings: state.settings,
    blog: state.blog,
  };

  try {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al guardar los datos");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al guardar configuración CMS:", error);
    throw error;
  }
}
