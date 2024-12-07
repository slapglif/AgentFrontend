import WebSocket from "ws";
import type { Server } from "http";
import { db } from "../db";
import { memories, messages, collaborations, collaborationParticipants } from "@db/schema";
import { eq, and } from "drizzle-orm";

interface WebSocketClient extends WebSocket {
  agentId?: number;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocket.Server({ server });

  const broadcastToCollaboration = (collaborationId: number, message: any) => {
    wss.clients.forEach((client: WebSocketClient) => {
      if (client.readyState === WebSocket.OPEN && client.agentId) {
        db.select()
          .from(collaborationParticipants)
          .where(
            and(
              eq(collaborationParticipants.collaborationId, collaborationId),
              eq(collaborationParticipants.agentId, client.agentId)
            )
          )
          .then((participants) => {
            if (participants.length > 0) {
              client.send(JSON.stringify(message));
            }
          });
      }
    });
  };

  wss.on("connection", (ws: WebSocketClient) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case "register":
            ws.agentId = data.agentId;
            break;

          case "memory":
            const memoryResult = await db.insert(memories).values(data.memory);
            wss.clients.forEach((client: WebSocketClient) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "memory", data: memoryResult }));
              }
            });
            break;

          case "collaboration.message":
            const messageResult = await db.insert(messages).values({
              fromAgentId: ws.agentId!,
              toAgentId: data.toAgentId,
              content: data.content,
              type: "collaboration",
              priority: data.priority || "normal",
              status: "sent",
              collaborationId: data.collaborationId,
              metadata: data.metadata,
            });
            broadcastToCollaboration(data.collaborationId, {
              type: "collaboration.message",
              data: messageResult,
            });
            break;

          case "collaboration.join":
            const collaboration = await db.select().from(collaborations)
              .where(eq(collaborations.id, data.collaborationId));
            
            if (collaboration.length > 0) {
              await db.insert(collaborationParticipants).values({
                collaborationId: data.collaborationId,
                agentId: ws.agentId!,
                role: data.role || "participant",
              });
              broadcastToCollaboration(data.collaborationId, {
                type: "collaboration.joined",
                data: { agentId: ws.agentId, role: data.role },
              });
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Failed to process message" }));
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
}
