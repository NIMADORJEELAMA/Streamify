import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import useStreamChat from "../hooks/useStreamChat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const chatClient = useStreamChat(authUser, tokenData?.token);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create the channel only when client is ready
  useEffect(() => {
    if (!chatClient || !authUser || !targetUserId) return;

    const channelId = [authUser._id, targetUserId].sort().join("-");

    const currChannel = chatClient.channel("messaging", channelId, {
      members: [authUser._id, targetUserId],
    });

    currChannel
      .watch()
      .then(() => {
        setChannel(currChannel);
        setLoading(false);
      })
      .catch(() => toast.error("Failed to load chat"));
  }, [chatClient, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] bg-gray-100 flex justify-center">
      <div className="w-full shadow-lg border rounded-lg overflow-hidden bg-white mt-2">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            <div className="relative">
              <CallButton handleVideoCall={handleVideoCall} />

              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>

            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;
