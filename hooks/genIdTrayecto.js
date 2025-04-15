export const generarTrayectoId = (trayectos) => {
    const numeros = trayectos
      .map((t) => {
        const match = t.idTrayecto && t.idTrayecto.match(/^T(\d{3})$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n) => n !== null);
  
    const max = numeros.length > 0 ? Math.max(...numeros) : 0;
    const next = (max + 1).toString().padStart(3, "0");
    return `T${next}`;
  };
  