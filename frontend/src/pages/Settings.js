import React, { useState } from "react";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";

function Settings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSave = () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordFields.oldPassword || !passwordFields.newPassword || !passwordFields.confirmNewPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSuccess("Password changed successfully!");
    setPasswordFields({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    setTimeout(() => setPasswordSuccess("") , 3000);
    setShowChangePassword(false);
  };

  const handlePasswordCancel = () => {
    setPasswordFields({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    setPasswordError("");
    setShowChangePassword(false);
  };

  return (
    <div className="flex h-screen bg-light">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
              {!showChangePassword ? (
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200"
                >
                  Change Password
                </button>
              ) : (
                <div className="max-w-md">
                  {passwordError && <div className="mb-2 p-2 bg-red-100 text-red-800 rounded">{passwordError}</div>}
                  {passwordSuccess && <div className="mb-2 p-2 bg-green-100 text-green-800 rounded">{passwordSuccess}</div>}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordFields.oldPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordFields.newPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordFields.confirmNewPassword}
                      onChange={handlePasswordFieldChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePasswordSave}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                    >
                      Save Password
                    </button>
                    <button
                      onClick={handlePasswordCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings; 