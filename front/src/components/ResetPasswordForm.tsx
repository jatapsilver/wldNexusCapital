"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { putChangePassword } from "@/server/frontLogin/putChangePassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return alert("Token no válido.");
    }

    setLoading(true);
    try {
      const response = await putChangePassword(
        token,
        password,
        confirmPassword
      );
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 z-30">
      <Card className="bg-white/10 z-30">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Restablecer Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-white"
          >
            {/* Campo Nueva Contraseña */}
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <div className="flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="text-black pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-sm text-accent-landing hover:underline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Contraseña */}
            <div className="grid gap-2 relative">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="flex items-center">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  className="text-black pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-sm text-accent-landing hover:underline"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Procesando..." : "Cambiar Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
