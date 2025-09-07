"use client";

import { useState, useEffect } from "react";
import SettingsTabs from "./components/SettingsTabs";
import GeneralSettings from "./components/GeneralSettings";
import TestSettings from "./components/TestSettings";
import NotificationSettings from "./components/NotificationSettings";
import SystemSettings from "./components/SystemSettings";
import { CheckCircle } from "@phosphor-icons/react";

interface AppSettings {
  siteName: string;
  siteDescription: string;
  maxTestAttempts: number;
  defaultPassingScore: number;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  registrationOpen: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    siteName: "",
    siteDescription: "",
    maxTestAttempts: 3,
    defaultPassingScore: 60,
    emailNotifications: true,
    systemMaintenance: false,
    registrationOpen: true,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Kelola pengaturan aplikasi</p>
      </div>

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        {activeTab === "general" && (
          <GeneralSettings settings={settings} setSettings={setSettings} />
        )}

        {activeTab === "test" && (
          <TestSettings settings={settings} setSettings={setSettings} />
        )}

        {activeTab === "notifications" && (
          <NotificationSettings settings={settings} setSettings={setSettings} />
        )}

        {activeTab === "system" && (
          <SystemSettings settings={settings} setSettings={setSettings} />
        )}

        <div className="pt-6 border-t flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <div className="flex items-center text-green-600">
              <CheckCircle size={20} className="mr-2" />
              Settings saved successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
