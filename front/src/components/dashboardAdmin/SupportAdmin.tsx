import React, { useState } from "react";

// Definir el tipo para un mensaje de soporte
interface SupportMessage {
  id: number;
  username: string;
  message: string;
  response: string;
}

export function SupportAdmin() {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 1,
      username: "juanperez",
      message: "No puedo acceder a mi cuenta. ¿Me pueden ayudar?",
      response: "",
    },
    {
      id: 2,
      username: "anagomez",
      message: "¿Cómo cambio mi método de pago?",
      response: "",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(
    null
  );
  const [response, setResponse] = useState<string>("");

  const handleSelectMessage = (msg: SupportMessage) => {
    setSelectedMessage(msg);
    setResponse(msg.response);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };

  const handleSendResponse = () => {
    if (!selectedMessage) return;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, response } : msg
      )
    );

    setSelectedMessage(null);
    setResponse("");
  };

  return (
    <div className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Sistema de Soporte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lista de mensajes */}
        <div className="border p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Mensajes Recibidos</h3>
          <ul>
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectMessage(msg)}
              >
                <span className="font-bold">{msg.username}:</span> {msg.message}
              </li>
            ))}
          </ul>
        </div>

        {/* Respuesta a mensajes */}
        {selectedMessage && (
          <div className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Responder a {selectedMessage.username}
            </h3>
            <p className="mb-2 border-b pb-2">{selectedMessage.message}</p>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={4}
              value={response}
              onChange={handleResponseChange}
              placeholder="Escribe tu respuesta aquí..."
            ></textarea>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleSendResponse}
            >
              Enviar Respuesta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
