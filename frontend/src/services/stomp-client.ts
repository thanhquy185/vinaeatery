// import SockJS from "sockjs-client";
// import Stomp, { Client, type Message } from "stompjs";

// let stompClient: Client | null = null;

// interface MessagePayload {
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp?: string;
// }

// export const connectWebSocket = (
//   selectedTableId: number,
//   onMessageReceived: (msg: MessagePayload) => void
// ): Client => {
//   if (stompClient && stompClient.connected) return stompClient;

//   const socket = new SockJS("http://localhost:8080/ws");
//   stompClient = Stomp.over(socket);

//   stompClient.connect({}, () => {
//     console.log("WebSocket connected!");
//     stompClient?.subscribe(
//       `/topic/use-table-${selectedTableId}`,
//       (payload: Message) => {
//         const msg: MessagePayload = JSON.parse(payload.body);
//         onMessageReceived(msg);
//       }
//     );
//   });

//   return stompClient;
// };

// export const sendMessage = (destination: string, message: MessagePayload) => {
//   if (stompClient && stompClient.connected) {
//     stompClient.send(destination, {}, JSON.stringify(message));
//   }
// };
