import React from "react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: SettingsTabsProps) {
  const tabs = [
    { id: "general", label: "General" },
    { id: "test", label: "Test Settings" },
    { id: "notifications", label: "Notifications" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out 
              ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-700 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
