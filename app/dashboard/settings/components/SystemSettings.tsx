/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";

interface AppSettings {
  siteName: string;
  siteDescription: string;
  maxTestAttempts: number;
  defaultPassingScore: number;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  registrationOpen: boolean;
}

interface SystemSettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export default function SystemSettings({
  settings,
  setSettings,
}: SystemSettingsProps) {
  const ToggleSwitch = ({
    enabled,
    onChange,
    variant = "default",
  }: {
    enabled: boolean;
    onChange: () => void;
    variant?: "default" | "danger";
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled
          ? variant === "danger"
            ? "bg-red-600 dark:bg-red-500"
            : "bg-blue-600 dark:bg-blue-500"
          : "bg-gray-200 dark:bg-gray-600"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        System Settings
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable maintenance mode to temporarily disable user access
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.systemMaintenance}
            onChange={() =>
              setSettings({
                ...settings,
                systemMaintenance: !settings.systemMaintenance,
              })
            }
            variant="danger"
          />
        </div>

        {settings.systemMaintenance && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400 dark:text-red-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Maintenance Mode Active
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>
                    The system is currently in maintenance mode. Regular users
                    cannot access the application. Only administrators can
                    access the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
            System Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Platform Version:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                v1.0.0
              </span>
            </div>
            <div className="flex justify-between">
              <span>Database Status:</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Backup:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
