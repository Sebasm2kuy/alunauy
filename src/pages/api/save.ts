import type { NextApiRequest, NextApiResponse } from "next";

let fakeDatabase: any = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      fakeDatabase = data;

      console.log("Datos guardados en el CMS (ficticio):", fakeDatabase);

      return res.status(200).json({ success: true, message: "Configuración guardada correctamente" });
    } catch (error) {
      console.error("Error al guardar datos:", error);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }
}
