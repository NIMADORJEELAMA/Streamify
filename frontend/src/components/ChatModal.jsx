import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { X } from "lucide-react";
import useStreamChat from "../hooks/useStreamChat";
import toast from "react-hot-toast";

const ChatModal = ({ friend, authUser, token, onClose }) => {
  const chatClient = useStreamChat(authUser, token);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!chatClient || !friend) return;

    const channelId = [authUser._id, friend._id].sort().join("-");

    const currChannel = chatClient.channel("messaging", channelId, {
      members: [authUser._id, friend._id],
    });

    currChannel
      .watch()
      .then(() => setChannel(currChannel))
      .catch(() => toast.error("Failed to load chat"));
  }, [chatClient, friend]);

  if (!chatClient || !channel)
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
        <div className="bg-white p-4 rounded-xl shadow">Loading chat…</div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="w-[380px] h-[758px] mt-32 bg-white rounded-xl shadow-xl overflow-hidden relative">
        {/* HEADER */}
        <div className="flex items-center gap-3 p-3 border-b bg-gray-100">
          <img src={friend.profilePic} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <h3 className="font-semibold">{friend.fullName}</h3>
            <p className="text-xs text-green-600">● Online</p>
          </div>

          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* STREAM CHAT */}
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatModal;
