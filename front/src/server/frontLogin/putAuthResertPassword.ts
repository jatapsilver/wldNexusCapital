import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const putAuthResetPassword = async (email: string): Promise<void> => {
  try {
    const requestBody = { email };

    const response = await fetch(`${API_URL}/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
        responseData.message || responseData || "Error al enviar el correo"
      );
    }

    Swal.fire({
      icon: "success",
      title: "Correo enviado",
      text: "Hemos enviado un enlace de recuperación a tu correo.",
      confirmButtonColor: "#2ECC71",
    });
  } catch (error: unknown) {
    let errorMessage = "No pudimos enviar el correo de recuperación.";

    if (error instanceof Error) {
      console.error("Error al solicitar recuperación:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Error desconocido:", error);
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonColor: "#FF4500",
    });
  }
};
