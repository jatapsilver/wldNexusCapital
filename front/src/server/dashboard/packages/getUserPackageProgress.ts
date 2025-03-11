const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserPackageProgress = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) console.error("Error al obtener el token:");

    const response = await fetch(
      `${API_URL}/progress-packages/getUserPackageProgress/${userId}`,
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
    console.error("Error al obtener la información del usuario:", error);
    return null;
  }
};
