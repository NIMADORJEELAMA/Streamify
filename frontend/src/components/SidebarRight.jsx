import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendItem from "./FriendItem";
import ChatModal from "./ChatModal";
import { useState } from "react";

const SidebarRight = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <aside className="hidden lg:flex flex-col w-72 border-l border-base-300 bg-base-200 h-screen sticky top-14 p-4">
      <h2 className="text-lg font-semibold mb-3">Contacts</h2>

      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}

      {!isLoading && friends.length === 0 && (
        <p className="text-sm text-neutral">No friends found</p>
      )}

      <div className="space-y-2 overflow-y-auto">
        {friends.map((fr) => (
          <FriendItem
            key={fr._id}
            friend={fr}
            onClick={() => setSelectedFriend(fr)}
          />
        ))}
      </div>

      {selectedFriend && (
        <ChatModal
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </aside>
  );
};

export default SidebarRight;
