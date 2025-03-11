// components/ui/modal.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function TermsAndConditions({
  isOpen,
  onClose,
  title,
}: Readonly<ModalProps>) {
  if (!isOpen) return null;

  const termsText = `Términos y Condiciones de Neuro Bot IA 

1. Introducción
Neuro Bot IA es una plataforma de inversión automatizada basada en inteligencia artificial. Al acceder y utilizar nuestros servicios, usted acepta los siguientes términos y condiciones.
Si no está de acuerdo con alguno de los términos, le recomendamos no utilizar la plataforma.

2. Tratamiento de Datos
Neuro Bot IA recopila, almacena y procesa datos personales según lo establecido en nuestra Política de Privacidad.

La información del usuario se utiliza para mejorar la experiencia de inversión y garantizar el cumplimiento normativo.

Los datos pueden ser compartidos con terceros proveedores de servicios bajo estrictos acuerdos de confidencialidad.

El usuario puede solicitar la eliminación o modificación de sus datos contactando a nuestro equipo de soporte.

3. Uso de la Plataforma
El usuario debe ser mayor de edad y contar con la capacidad legal para operar en mercados financieros.

El usuario es responsable de proporcionar información veraz y actualizada al registrarse.

El acceso a la plataforma es personal e intransferible.

4. Riesgos Financieros
Neuro Bot IA no garantiza rendimientos específicos ni la rentabilidad de las inversiones.

La inversión en mercados financieros implica riesgos, incluyendo la pérdida parcial o total del capital.

Los resultados pasados no garantizan rendimientos futuros.

5. Seguridad y Manejo de Datos
Neuro Bot IA recopila y almacena información personal de acuerdo con nuestra Política de Privacidad.

Implementamos medidas de seguridad para proteger los datos de los usuarios, pero no garantizamos protección absoluta contra ataques informáticos.

En caso de acceso no autorizado o vulneración de datos, se notificará a los usuarios afectados según la normativa aplicable.

6. Posibles Hackeos y Ataques Cibernéticos
Neuro Bot IA no se hace responsable por pérdidas derivadas de ataques informáticos, hackeos o vulneraciones de seguridad.

En caso de ataque, nos reservamos el derecho de suspender temporalmente los servicios para mitigar riesgos.

7. Fluctuaciones del Mercado y Pérdidas
La plataforma opera en mercados volátiles, y el usuario asume el riesgo de fluctuaciones en los precios de los activos.

Neuro Bot IA no es responsable por pérdidas ocasionadas por caídas abruptas en los mercados.

8. Política de Cancelación y Reembolsos
No se garantizan reembolsos por inversiones realizadas.

En caso de suscripción a servicios premium, el usuario podrá cancelar la renovación automática antes del siguiente ciclo de facturación.

9. Modificación de los Términos
Neuro Bot IA se reserva el derecho de modificar estos términos en cualquier momento.

Los usuarios serán notificados sobre cambios importantes mediante correo electrónico o notificación en la plataforma.

10. Limitación de Responsabilidad
Neuro Bot IA no es responsable de daños directos o indirectos derivados del uso de la plataforma.

No garantizamos disponibilidad continua del servicio debido a mantenimiento, fallos técnicos o ataques informáticos.

11. Contacto y Soporte
Para cualquier consulta o reclamación, los usuarios pueden contactarnos a través de nuestro servicio de atención al cliente por correo electrónico

12. Legislación Aplicable
Estos términos se rigen por las leyes del país donde Neuro Bot IA tiene su sede. Cualquier disputa será resuelta en los tribunales competentes de dicha jurisdicción.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-md w-full max-w-lg max-h-[90vh] overflow-hidden shadow-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-justify max-h-[60vh] overflow-y-auto whitespace-pre-line">
            {termsText}
          </CardContent>
        </Card>
        <div className="flex justify-end mt-4 mb-6">
          <Button onClick={onClose} className="bg-red-500 text-white">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
