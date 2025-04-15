export const generarSiguienteId = (puntos) => {
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