interface AppSettings {
  siteName: string;
  siteDescription: string;
  maxTestAttempts: number;
  defaultPassingScore: number;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  registrationOpen: boolean;
}

interface TestSettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export default function TestSettings({
  settings,
  setSettings,
}: TestSettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Test Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Test Attempts
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.maxTestAttempts}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxTestAttempts: Math.max(1, parseInt(e.target.value) || 1),
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum number of attempts allowed per test
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Passing Score (%)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.defaultPassingScore}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultPassingScore: Math.min(
                  100,
                  Math.max(1, parseInt(e.target.value) || 60)
                ),
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Default minimum score required to pass tests
          </p>
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Changes to test settings will only apply to new tests created
                after saving. Existing tests will retain their current settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
