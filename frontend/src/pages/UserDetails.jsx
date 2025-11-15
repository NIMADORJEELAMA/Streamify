import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { axiosInstance } from "../lib/axios";
import { LANGUAGES } from "../constants";
const UserDetails = () => {
  const { authUser, isLoading, refetch } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Load data into form once user is available
  React.useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        location: authUser.location || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
      });
    }
  }, [authUser]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading user details...
      </div>
    );

  if (!authUser)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load user data.
      </div>
    );

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axiosInstance.put("/users/me", formData);
      if (res.status === 200) {
        await refetch();
        setIsEditing(false);
      }
    } catch (err) {
      console.log("err", err);
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4">
        <img
          src={authUser.profilePic}
          alt={authUser.fullName}
          className="w-24 h-24 rounded-full border-2 border-primary"
        />
        <div>
          <h2 className="text-2xl font-bold">{authUser.fullName}</h2>
          <p className="text-gray-600">{authUser.email}</p>
          <p className="text-sm text-success mt-1">✅ Onboarded</p>
        </div>
      </div>

      {/* Edit / View Mode */}
      <div className="bg-base-100 shadow-md rounded-xl p-6 space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Profile Information</h3>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formData.learningLanguage}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Native Language
                </label>
                <input
                  name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Learning Language
                </label>
                <input
                  name="learningLanguage"
                  value={formData.learningLanguage}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div> */}

            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn btn-primary w-full mt-4 ${
                saving ? "loading" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Location:</strong> {authUser.location || "Not specified"}
            </p>
            <p>
              <strong>Bio:</strong> {authUser.bio || "No bio available"}
            </p>
            <p>
              <strong>Learning Language:</strong>{" "}
              {authUser.learningLanguage || "N/A"}
            </p>
            <p>
              <strong>Native Language:</strong>{" "}
              {authUser.nativeLanguage || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
        <p>Created At: {new Date(authUser.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(authUser.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserDetails;
