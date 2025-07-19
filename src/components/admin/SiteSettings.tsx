import React, { useEffect, useState } from "react";
import { useCMSStore } from "@/store/cmsStore"; // CORREGIDO: antes era "@/stores/cms-store"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const SiteSettings: React.FC = () => {
  const {
    cmsData,
    fetchCMSData,
    updateCMSField,
    saveCMSData,
  } = useCMSStore();

  const [localCMSData, setLocalCMSData] = useState(cmsData);

  useEffect(() => {
    fetchCMSData();
  }, [fetchCMSData]);

  useEffect(() => {
    setLocalCMSData(cmsData);
  }, [cmsData]);

  const handleChange = (field: string, value: string) => {
    setLocalCMSData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      for (const field in localCMSData) {
        if (localCMSData[field] !== cmsData[field]) {
          updateCMSField(field, localCMSData[field]);
        }
      }
      await saveCMSData();
      toast({ title: "Configuración guardada con éxito." });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Configuración del Sitio</h1>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="siteTitle">Título del Sitio</Label>
          <Input
            id="siteTitle"
            value={localCMSData.siteTitle || ""}
            onChange={(e) => handleChange("siteTitle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="siteDescription">Descripción del Sitio</Label>
          <Input
            id="siteDescription"
            value={localCMSData.siteDescription || ""}
            onChange={(e) => handleChange("siteDescription", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="contactEmail">Email de Contacto</Label>
          <Input
            id="contactEmail"
            value={localCMSData.contactEmail || ""}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="footerText">Texto del Footer</Label>
          <Input
            id="footerText"
            value={localCMSData.footerText || ""}
            onChange={(e) => handleChange("footerText", e.target.value)}
          />
        </div>

        <Button onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </div>
  );
};

export default SiteSettings;
