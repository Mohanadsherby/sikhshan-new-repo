"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCog,
  faSave,
  faShieldAlt,
  faBell,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons"

function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: "Sikhshan LMS",
    emailNotifications: true,
    maintenanceMode: false,
    backupFrequency: "daily",
    securityLevel: "high",
    maxFileSize: 10,
    sessionTimeout: 30,
    enableTwoFactor: true,
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    alert("Settings saved successfully!")
  }

  const settingSections = [
    {
      id: "general",
      title: "General Settings",
      icon: faCog,
      settings: [
        {
          id: "systemName",
          label: "System Name",
          type: "text",
          value: settings.systemName,
        },
        {
          id: "maintenanceMode",
          label: "Maintenance Mode",
          type: "toggle",
          value: settings.maintenanceMode,
        },
      ],
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: faBell,
      settings: [
        {
          id: "emailNotifications",
          label: "Email Notifications",
          type: "toggle",
          value: settings.emailNotifications,
        },
      ],
    },
    {
      id: "security",
      title: "Security Settings",
      icon: faShieldAlt,
      settings: [
        {
          id: "securityLevel",
          label: "Security Level",
          type: "select",
          value: settings.securityLevel,
          options: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ],
        },
        {
          id: "enableTwoFactor",
          label: "Enable Two-Factor Authentication",
          type: "toggle",
          value: settings.enableTwoFactor,
        },
        {
          id: "sessionTimeout",
          label: "Session Timeout (minutes)",
          type: "number",
          value: settings.sessionTimeout,
        },
      ],
    },
    {
      id: "storage",
      title: "Storage Settings",
      icon: faDatabase,
      settings: [
        {
          id: "maxFileSize",
          label: "Maximum File Size (MB)",
          type: "number",
          value: settings.maxFileSize,
        },
        {
          id: "backupFrequency",
          label: "Backup Frequency",
          type: "select",
          value: settings.backupFrequency,
          options: [
            { value: "hourly", label: "Hourly" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ],
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCog} className="text-2xl text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          </div>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Changes
          </button>
        </div>

        <div className="space-y-6">
          {settingSections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={section.icon} className="text-xl text-primary mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {setting.label}
                    </label>
                    <div className="w-1/2">
                      {setting.type === "toggle" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      ) : setting.type === "select" ? (
                        <select
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={setting.type}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings 