const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserTrasictionHistory = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No hay token disponible");

    const response = await fetch(
      `${API_URL}/transaction-history/createUserTrasictionHistory/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el historial de transacciones");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};
