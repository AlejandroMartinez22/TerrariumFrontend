import supabase from './supabaseClient';

export const obtenerSiguienteIdTrayecto = async () => {
  try {
    // Realizamos una consulta para obtener el último ID de trayecto
    const { data, error } = await supabase
      .from('trayecto')
      .select('id')
      .order('id', { ascending: false })  // Ordenamos en orden descendente para obtener el último ID
      .limit(1);  // Tomamos solo el último

    if (error) {
      console.error("Error al obtener el último ID de trayecto:", error);
      return null;  // Si ocurre un error, retornamos null
    }

    if (data.length === 0) {
      // Si no hay trayectos en la base de datos, el primer ID será 'TR001'
      return 'TR001';
    }

    // Obtener el último ID de trayecto
    const ultimoId = data[0].id;

    // Extraer el número del ID (ejemplo: 'TR001' -> 1)
    const numero = parseInt(ultimoId.replace('TR', ''), 10);

    // Generar el siguiente número para el ID
    const siguienteNumero = numero + 1;
    const siguienteId = `TR${siguienteNumero.toString().padStart(3, '0')}`;

    return siguienteId;
  } catch (error) {
    console.error("Error al obtener el siguiente ID de trayecto:", error);
    return null;  // Si ocurre un error, retornamos null
  }
};
