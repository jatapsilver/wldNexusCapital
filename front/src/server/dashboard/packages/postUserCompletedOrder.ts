// userCompletedOrder.ts
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userCompletedOrder = async (userId: string, hash: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token de autenticación no encontrado.",
      });
      return null;
    }

    const response = await fetch(
      `${API_URL}/purchase-order/userCompletedOrder/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hash }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    const data = await response.json();

    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: data.message || "Orden completada exitosamente",
    });

    return data;
  } catch (error: unknown) {
    console.error("Error al completar la orden:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al completar la orden.",
    });
    return null;
  }
};
