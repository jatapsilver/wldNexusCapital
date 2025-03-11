import Image from "next/image";
import { useState, useEffect } from "react";
import { getSupportTicketByUuid } from "../../server/dashboard/support/getSupportTicketByUuid";
import { updateTicketMessage } from "../../server/dashboard/support/postUpdateTicketMessage";
import { createSupportTicket } from "../../server/dashboard/support/createSupportTicket";

export function SupportDashboard() {
  interface TicketMessage {
    uuid: string;
    message: string;
    createdAt: string;
  }

  interface Ticket {
    uuid: string;
    subject: string;
    status: string;
    ticketMessages: TicketMessage[];
  }

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newReason, setNewReason] = useState("Soporte Técnico");
  const [newMessage, setNewMessage] = useState("");
  const userId = localStorage.getItem("sub");

  const [drafts, setDrafts] = useState<{
    [ticketId: string]: { isDrafting: boolean; message: string };
  }>({});

  const fetchTickets = async () => {
    const userId = localStorage.getItem("sub");
    if (userId) {
      const data = await getSupportTicketByUuid(userId);
      if (data) {
        const ticketsWithSortedMessages = data.map((ticket: Ticket) => {
          const sortedMessages = [...ticket.ticketMessages].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          return { ...ticket, ticketMessages: sortedMessages };
        });

        ticketsWithSortedMessages.sort((a: Ticket, b: Ticket) => {
          const aRecentMessage = a.ticketMessages[0];
          const bRecentMessage = b.ticketMessages[0];
          return (
            new Date(bRecentMessage.createdAt).getTime() -
            new Date(aRecentMessage.createdAt).getTime()
          );
        });

        setTickets(ticketsWithSortedMessages);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      if (userId) {
        const response = await createSupportTicket(
          userId,
          newReason,
          newMessage
        );
        if (response) {
          fetchTickets();
        }
      }
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Imagen de portada */}
      <div className="w-full relative">
        <Image
          src="/dashboard/coverSupport.jpg"
          alt="User Cover"
          width={1080}
          height={400}
          className="w-full h-[10rem] md:h-[20rem] object-cover rounded-lg"
        />
      </div>

      {/* Imagen de perfil */}
      <div className="relative -mt-20 md:-mt-32">
        <Image
          src="/dashboard/mailPlus.svg"
          alt="Imagen de perfil"
          width={240}
          height={150}
          className="rounded-full object-cover border-4 border-white bg-white shadow-lg h-[8rem] w-[8rem] md:h-[15rem] md:w-[15rem]"
        />
      </div>

      {/* Formulario para enviar mensaje */}
      <div className="w-full max-w-2xl bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2 text-black">Enviar Mensaje</h2>
        <select
          className="w-full p-2 border rounded mb-2 text-black"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
        >
          <option value="Soporte Técnico">Soporte Técnico</option>
          <option value="Pagos y Facturación">Pagos y Facturación</option>
          <option value="Sugerencias">Sugerencias</option>
          <option value="Otros">Otros</option>
        </select>
        <textarea
          className="w-full p-2 border rounded mb-2 text-black"
          rows={3}
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button
          className="bg-black hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg"
          onClick={handleSendMessage}
        >
          Enviar
        </button>
      </div>

      {/* Historial de tickets y mensajes */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md mt-4 text-black">
        <h2 className="text-lg font-bold mb-2">Tickets de Soporte</h2>
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.uuid} className="p-4 border rounded bg-gray-50">
                <h3 className="text-md font-bold mb-2">{ticket.subject}</h3>
                <p className="text-sm mb-2 text-black">
                  Estado: {ticket.status}
                </p>
                <div className="space-y-2">
                  {ticket.ticketMessages.map((msg: TicketMessage) => (
                    <div key={msg.uuid} className="p-2 border rounded bg-white">
                      <p className="text-black">{msg.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString("es-CO", {
                          timeZone: "America/Bogota",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Si el ticket no está cerrado, mostramos la UI para redactar mensaje */}
                {ticket.status !== "closed" && (
                  <div className="mt-4">
                    {drafts[ticket.uuid]?.isDrafting ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Escribe tu mensaje..."
                          value={drafts[ticket.uuid].message}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [ticket.uuid]: {
                                ...prev[ticket.uuid],
                                message: e.target.value,
                              },
                            }))
                          }
                          className="w-full p-2 border rounded"
                        />
                        <button
                          className="bg-black hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg"
                          onClick={async () => {
                            const draft = drafts[ticket.uuid];
                            if (draft?.message.trim()) {
                              const response = await updateTicketMessage(
                                userId!,
                                draft.message,
                                ticket.uuid
                              );
                              if (response) {
                                fetchTickets();
                              }

                              setDrafts((prev) => ({
                                ...prev,
                                [ticket.uuid]: {
                                  isDrafting: false,
                                  message: "",
                                },
                              }));
                            }
                          }}
                        >
                          Enviar mensaje
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-black hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg"
                        onClick={() =>
                          setDrafts((prev) => ({
                            ...prev,
                            [ticket.uuid]: { isDrafting: true, message: "" },
                          }))
                        }
                      >
                        Redactar mensaje
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-black">No hay tickets para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
