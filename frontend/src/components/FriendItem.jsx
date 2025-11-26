const FriendItem = ({ friend, onClick }) => {
  // Mock active status — you can replace with real online status later
  const isOnline = Math.random() < 0.5;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 cursor-pointer"
    >
      <div className="relative">
        <img
          src={friend.profilePic}
          className="w-10 h-10 rounded-full object-cover"
          alt={friend.fullName}
        />

        {/* Online / offline dot */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-200 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div>
        <p className="font-medium">{friend.fullName}</p>
        <p className="text-xs text-gray-500">
          {isOnline ? "Active now" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default FriendItem;
