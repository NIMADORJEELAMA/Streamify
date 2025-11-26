import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let clientInstance = null; // 🔥 ensures only ONE client

export default function useStreamChat(authUser, token) {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    if (!authUser || !token) return;

    // 🔥 Create client once
    if (!clientInstance) {
      clientInstance = StreamChat.getInstance(STREAM_API_KEY);
    }

    const init = async () => {
      try {
        if (!clientInstance.userID) {
          await clientInstance.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            token
          );
        }

        setChatClient(clientInstance);
      } catch (err) {
        console.error("STREAM CHAT ERROR:", err);
      }
    };

    init();

    return () => {
      // do NOT disconnect here — keeps global session alive
    };
  }, [authUser, token]);

  return chatClient;
}
