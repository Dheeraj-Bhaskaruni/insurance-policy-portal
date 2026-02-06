import React from 'react';

import { Card } from '../../components/ui';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../store/selectors';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  usePageTitle('Settings');
  const user = useAppSelector(selectCurrentUser);
  const [pageSize, setPageSize] = useLocalStorage<number>('preferred_page_size', DEFAULT_PAGE_SIZE);
  const [compactMode, setCompactMode] = useLocalStorage<boolean>('compact_mode', false);
  const [emailNotifications, setEmailNotifications] = useLocalStorage<boolean>(
    'email_notifications',
    true,
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <Card className="settings-card">
          <h3 className="settings-section-title">Profile Information</h3>
          <div className="settings-profile">
            <div className="settings-avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="settings-profile-info">
              <div className="settings-field">
                <span className="settings-label">Name</span>
                <span className="settings-value">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <div className="settings-field">
                <span className="settings-label">Email</span>
                <span className="settings-value">{user?.email}</span>
              </div>
              <div className="settings-field">
                <span className="settings-label">Role</span>
                <span className="settings-value settings-role">{user?.role}</span>
              </div>
              <div className="settings-field">
                <span className="settings-label">Member Since</span>
                <span className="settings-value">
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="settings-card">
          <h3 className="settings-section-title">Display Preferences</h3>
          <div className="settings-options">
            <div className="settings-option">
              <div>
                <span className="settings-option-label">Default Page Size</span>
                <span className="settings-option-desc">
                  Number of items shown per page in tables
                </span>
              </div>
              <select
                className="settings-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} items
                  </option>
                ))}
              </select>
            </div>

            <div className="settings-option">
              <div>
                <span className="settings-option-label">Compact Mode</span>
                <span className="settings-option-desc">Reduce spacing in tables and lists</span>
              </div>
              <label className="settings-toggle" aria-label="Compact Mode">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>

            <div className="settings-option">
              <div>
                <span className="settings-option-label">Email Notifications</span>
                <span className="settings-option-desc">
                  Receive email updates about policy changes
                </span>
              </div>
              <label className="settings-toggle" aria-label="Email Notifications">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="settings-toggle-slider" />
              </label>
            </div>
          </div>
        </Card>

        <Card className="settings-card">
          <h3 className="settings-section-title">Application Info</h3>
          <div className="settings-info">
            <div className="settings-field">
              <span className="settings-label">Version</span>
              <span className="settings-value">1.0.0</span>
            </div>
            <div className="settings-field">
              <span className="settings-label">Environment</span>
              <span className="settings-value">
                {import.meta.env.VITE_APP_ENV || 'development'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
