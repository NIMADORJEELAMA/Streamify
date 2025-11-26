import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "./FriendCard";
import NoFriendsFound from "./NoFriendsFound";
import ChatModal from "./ChatModal";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";

const FriendsList = () => {
  const [openChatUser, setOpenChatUser] = useState(null);

  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return <NoFriendsFound />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {friends.map((friend) => (
        <FriendCard
          key={friend._id}
          user={friend}
          type="friend"
          onOpenChat={(user) => setOpenChatUser(user)}
        />
      ))}
      {openChatUser && (
        <ChatModal
          friend={openChatUser}
          authUser={authUser}
          token={tokenData?.token}
          onClose={() => setOpenChatUser(null)}
        />
      )}
    </div>
  );
};

export default FriendsList;
