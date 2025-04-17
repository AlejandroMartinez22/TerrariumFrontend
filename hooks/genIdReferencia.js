// Importa la función desde el archivo correspondiente
import { obtenerSiguienteId } from '../supabase/getUltimoIdReferencia';

export const generarReferenciaId = (puntos) => {
  const numeros = puntos
    .map((p) => {
      const match = p.id && p.id.match(/^PR(\d{3})$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n) => n !== null);

  const max = numeros.length > 0 ? Math.max(...numeros) : 0;
  const next = (max + 1).toString().padStart(3, "0");
  return `PR${next}`;
};

// Ejemplo de cómo usar la función obtenerSiguienteId
const obtenerYGenerarId = async () => {
  const siguienteId = await obtenerSiguienteId();
  console.log(siguienteId); // Esto te dará el siguiente ID, como PR002 o el primero si no hay datos.
};

obtenerYGenerarId();
