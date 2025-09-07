interface AppSettings {
  siteName: string;
  siteDescription: string;
  maxTestAttempts: number;
  defaultPassingScore: number;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  registrationOpen: boolean;
}

interface NotificationSettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export default function NotificationSettings({
  settings,
  setSettings,
}: NotificationSettingsProps) {
  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-200"
      }`}
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
      <h2 className="text-lg font-semibold">Notification Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Email Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Send email notifications to users for important updates
            </p>
          </div>
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={() =>
              setSettings({
                ...settings,
                emailNotifications: !settings.emailNotifications,
              })
            }
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Email Configuration Required
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  To enable email notifications, make sure your SMTP settings
                  are configured in your environment variables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
