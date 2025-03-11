import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const putChangePassword = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<Response> => {
  // Retorna Response
  try {
    const response = await fetch(`${API_URL}/auth/updatePasswordEmail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword, confirmNewPassword }),
    });

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        responseData.message || responseData || "Error al cambiar la contraseña"
      );
    }

    Swal.fire({
      icon: "success",
      title: "Contraseña restablecida",
      text: "Ahora puedes iniciar sesión con tu nueva contraseña.",
      confirmButtonColor: "#2ECC71",
    });

    return response; // 🔥 Devuelve la respuesta para manejarla en el formulario
  } catch (error: unknown) {
    let errorMessage =
      "Hubo un problema al cambiar la contraseña. Inténtalo nuevamente.";

    if (error instanceof Error) {
      console.error("Error al cambiar contraseña:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Error al cambiar contraseña:", error);
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonColor: "#FF4500",
    });

    throw error; // 🔥 Lanza el error para capturarlo en el formulario
  }
};
