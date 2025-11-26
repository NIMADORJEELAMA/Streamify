import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { UserPlusIcon, CheckCircleIcon } from "lucide-react";

const FriendCard = ({
  user,
  type,
  onSendRequest,
  hasRequestBeenSent,
  isPending,
  onOpenChat,
}) => {
  // const [openChatUser, setOpenChatUser] = useState(null);

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={user.profilePic} alt={user.fullName} />
          </div>
          <h3 className="font-semibold truncate">{user.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(user.nativeLanguage)}
            Native: {user.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(user.learningLanguage)}
            Learning: {user.learningLanguage}
          </span>
        </div>

        {type === "friend" ? (
          <button
            className="btn btn-outline w-full"
            onClick={() => onOpenChat(user)}
          >
            Message
          </button>
        ) : (
          <button
            className={`btn w-full mt-2 ${
              hasRequestBeenSent ? "btn-disabled" : "btn-primary"
            }`}
            onClick={() => onSendRequest(user._id)}
            disabled={hasRequestBeenSent || isPending}
          >
            {hasRequestBeenSent ? (
              <>
                <CheckCircleIcon className="size-4 mr-2" />
                Request Sent
              </>
            ) : (
              <>
                <UserPlusIcon className="size-4 mr-2" />
                Send Friend Request
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
