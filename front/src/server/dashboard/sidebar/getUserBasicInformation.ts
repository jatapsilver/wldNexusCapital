const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserBasicInformation = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const response = await fetch(
      `${API_URL}/users/userBasicInformacion/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la información del usuario");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};
