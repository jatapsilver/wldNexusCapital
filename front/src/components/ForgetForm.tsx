"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putAuthResetPassword } from "@/server/frontLogin/putAuthResertPassword";

export function ForgetForm({
  className,
  onBack,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { onBack?: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await putAuthResetPassword(email);
    setLoading(false);
  };
  return (
    <div className={cn("flex flex-col gap-6 z-30", className)} {...props}>
      <Card className="bg-white/10 z-30">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Recuperar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 text-white">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full">
                {loading ? "Enviando..." : "Enviar correo"}
              </Button>
              <button
                type="button"
                onClick={onBack}
                className="mt-2 text-center text-sm underline-offset-4 hover:underline hover:text-accent-landing"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
