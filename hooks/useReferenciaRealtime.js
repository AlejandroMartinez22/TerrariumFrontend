// hooks/useReferenciaRealtime.js


/*CORREGIR*/

import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

export const useReferenciaRealtime = () => {
  const [ultimoId, setUltimoId] = useState(null);

  const fetchUltimoId = async () => {
    const { data, error } = await supabase
      .from("punto_referencia")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (!error && data.length > 0) {
      setUltimoId(data[0].id);
    } else if (!error) {
      setUltimoId(null);
    } else {
      console.error("Error obteniendo último ID:", error);
    }
  };

  useEffect(() => {
    fetchUltimoId(); // Inicial

    const canal = supabase
      .channel("referencia-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "punto_referencia" },
        (payload) => {
          const nuevoId = payload.new.id;
          const nuevoNum = parseInt(nuevoId.replace("PR", ""));
          const actualNum = parseInt((ultimoId || "PR000").replace("PR", ""));

          if (nuevoNum > actualNum) {
            setUltimoId(nuevoId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  return { ultimoId }; // Solo usamos esto para mostrar, NO para generar el nuevo
};
