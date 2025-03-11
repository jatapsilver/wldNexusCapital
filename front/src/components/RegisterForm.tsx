"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import Swal from "sweetalert2";
import { postAuthSignup } from "@/server/frontLogin/postAuthSignup";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm({
  className,
  onBack,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { onBack: () => void }) {
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [referido, setReferido] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullNameRegex = /^[a-záéíóúüñ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameReferidoRegex = /^[a-zñ0-9]+$/;
    const passwordRegex =
      /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,}$/;

    if (
      !fullName ||
      !email ||
      !username ||
      !referido ||
      !password ||
      !confirmPassword
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (!fullNameRegex.test(fullName)) {
      Swal.fire(
        "Error",
        "El nombre completo solo puede contener letras minúsculas y espacios.",
        "error"
      );
      return;
    }

    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Ingrese un correo electrónico válido.", "error");
      return;
    }

    if (!usernameReferidoRegex.test(username)) {
      Swal.fire(
        "Error",
        "El nombre de usuario solo puede contener letras minúsculas y números, sin espacios ni caracteres especiales.",
        "error"
      );
      return;
    }

    if (!usernameReferidoRegex.test(referido)) {
      Swal.fire(
        "Error",
        "El código de referido solo puede contener letras minúsculas y números, sin espacios ni caracteres especiales.",
        "error"
      );
      return;
    }

    if (!passwordRegex.test(password)) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    if (!termsChecked) {
      Swal.fire("Error", "Debes aceptar los Términos y Condiciones.", "error");
      return;
    }

    setIsLoading(true);

    try {
      await postAuthSignup(
        fullName,
        email,
        referido,
        username,
        password,
        confirmPassword
      );

      setFullName("");
      setEmail("");
      setUsername("");
      setReferido("");
      setPassword("");
      setConfirmPassword("");
      setTermsChecked(false);
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 mt-28 md:mt-0 z-30 ", className)}
      {...props}
    >
      <Card className="bg-white/10 animate-fade-in flex-grow z-30">
        <CardHeader>
          <CardTitle className="text-2xl text-accent-landing">
            Registrarse
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="max-h-[45vh] md:max-h-[70vh] overflow-y-auto scrollbar-hidden">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 text-white">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ingrese su Nombre Completo"
                    className="text-black"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    className="text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    className="text-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="referido">Código de Referido</Label>
                  <Input
                    id="referido"
                    type="text"
                    placeholder="Ingrese el usuario de su sponsor"
                    className="text-black"
                    value={referido}
                    onChange={(e) => setReferido(e.target.value)}
                  />
                </div>

                {/* Contraseña */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="flex items-center">
                    <Input
                      id="password"
                      type={viewPassword ? "text" : "password"}
                      placeholder="********"
                      className="text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setViewPassword(!viewPassword)}
                      className="ml-2 text-sm text-accent-landing hover:underline"
                    >
                      {viewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="flex items-center">
                    <Input
                      id="confirmPassword"
                      type={viewConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      className="text-black"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setViewConfirmPassword(!viewConfirmPassword)
                      }
                      className="ml-2 text-sm text-accent-landing hover:underline"
                    >
                      {viewConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-accent-landing"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="text-accent-landing underline"
                    >
                      Términos y Condiciones
                    </button>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </div>
            </form>
          </div>
          <div className="mt-4 text-center text-sm text-white">
            ¿Ya estas Registrado?{" "}
            <button
              type="button"
              className="underline underline-offset-4 hover:text-accent-landing"
              onClick={onBack}
            >
              Inicia Sesión
            </button>
          </div>
        </CardContent>
      </Card>

      <TermsAndConditions
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Términos y Condiciones"
      />
    </div>
  );
}
