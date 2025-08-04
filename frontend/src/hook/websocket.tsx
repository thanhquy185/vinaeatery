import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { UseTablesFormatType } from "../common/types";

type UseWebSocketProps = {
    tableId?: string;
    onUseTableUpdate?: (useTable: UseTablesFormatType) => void;
};

export default function useWebSocket({ tableId, onUseTableUpdate }: UseWebSocketProps) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!tableId) return;

        // 🔌 Ngắt kết nối cũ nếu có
        if (clientRef.current?.active) {
            console.log("♻️ Ngắt kết nối cũ trước khi kết nối mới");
            clientRef.current.deactivate();
        }

        console.log("📡 WebSocket effect chạy với tableId:", tableId);

        const socket = new SockJS("http://localhost:8080/ws");

        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log("[STOMP DEBUG]", str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ Connected WebSocket!");
                const topic = `/topic/use-table-update/${tableId}`;
                console.log("👉 Subscribing to topic:", topic);
                client.subscribe(topic, (message) => {
                    const body = JSON.parse(message.body);
                    console.log("📥 Received message:", body);
                    onUseTableUpdate?.(body);
                });
            },
            onStompError: (frame) => {
                console.error("❌ Broker reported error: " + frame.headers["message"]);
                console.error("🧵 Additional details: " + frame.body);
            },
            onWebSocketClose: () => {
                console.warn("⚠️ WebSocket connection closed.");
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current?.active) {
                console.log("🔌 Cleanup WebSocket");
                clientRef.current.deactivate();
            } else {
                console.log("⚠️ WebSocket chưa kết nối, không cần disconnect");
            }
        };
    }, [tableId, onUseTableUpdate]);

}
