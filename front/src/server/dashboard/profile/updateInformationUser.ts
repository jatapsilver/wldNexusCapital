import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UpdateInformationUser {
  birthdate: string;
  country: string;
  celphone: string;
  walletPublica: string;
}

export const updateUserInformation = async (
  userId: string,
  updatedData: UpdateInformationUser
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay token disponible",
      });
      throw new Error("No hay token disponible");
    }

    const response = await fetch(
      `${API_URL}/users/updateInformationUser/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text:
          errorResponse.message ||
          "Error al actualizar la información del usuario",
      });
      throw new Error("Error al actualizar la información del usuario");
    }

    const data = await response.json();
    Swal.fire({
      icon: "success",
      title: "Actualización exitosa",
      text: data.message || "Información actualizada correctamente",
    });

    return data;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};
