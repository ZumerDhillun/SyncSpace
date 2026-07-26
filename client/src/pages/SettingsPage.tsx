import { useState } from 'react'
import toast from 'react-hot-toast'
import { Sidebar } from '@/components/layout/Sidebar'
import { CreateRoomModal } from '@/components/room/CreateRoomModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Modal } from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { LANGUAGES } from '@/types'

const AVATAR_COLORS = ['#7C6CF6', '#FF6B4A', '#4ADE80', '#FBBF24', '#FB7185', '#38BDF8']

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const { logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [defaultLang, setDefaultLang] = useState(user?.defaultLang || 'javascript')
  const [fontSize, setFontSize] = useState(user?.fontSize || 14)
  const [theme, setTheme] = useState<'dark' | 'light'>(user?.theme || 'dark')
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || AVATAR_COLORS[0])
  const [savingProfile, setSavingProfile] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  async function saveProfile() {
    setSavingProfile(true)
    try {
      const { data } = await api.put('/api/auth/profile', {
        name,
        defaultLang,
        fontSize,
        theme,
        avatarColor,
      })
      updateUser(data.user)
      toast.success('Settings saved')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not save settings')
    } finally {
      setSavingProfile(false)
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setSavingPassword(true)
    try {
      await api.put('/api/auth/password', { oldPassword, newPassword })
      toast.success('Password updated')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not update password')
    } finally {
      setSavingPassword(false)
    }
  }

  async function deleteAccount() {
    try {
      await api.delete('/api/auth/account')
      toast.success('Account deleted')
      logout()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not delete account')
    }
  }

  return (
    <div className="flex">
      <Sidebar onNewRoom={() => setModalOpen(true)} />
      <main className="min-h-screen flex-1 px-8 py-8">
        <h1 className="mb-8 text-2xl font-bold text-white">Settings</h1>

        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {/* Profile */}
          <section className="glass-card p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Profile</h2>
            <div className="mb-4 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    className={`h-6 w-6 rounded-full ${avatarColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-base-800' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user?.email} disabled />
            </div>
          </section>

          {/* Editor preferences */}
          <section className="glass-card p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Editor Preferences</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Default Language</label>
                <select value={defaultLang} onChange={(e) => setDefaultLang(e.target.value)} className="input-field">
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Font Size — {fontSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={20}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-signal-500"
                />
              </div>
              <Toggle checked={theme === 'light'} onChange={(v) => setTheme(v ? 'light' : 'dark')} label="Light mode" />
            </div>
            <Button variant="primary" onClick={saveProfile} disabled={savingProfile} className="mt-5">
              {savingProfile ? 'Saving…' : 'Save Changes'}
            </Button>
          </section>

          {/* Account security */}
          <section className="glass-card p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Account Security</h2>
            <div className="flex flex-col gap-4">
              <Input label="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button variant="secondary" onClick={changePassword} disabled={savingPassword} className="mt-5">
              {savingPassword ? 'Updating…' : 'Change Password'}
            </Button>
          </section>

          {/* Danger zone */}
          <section className="glass-card border-rose/20 p-6">
            <h2 className="mb-2 text-base font-semibold text-rose">Danger Zone</h2>
            <p className="mb-4 text-sm text-slate-400">
              Deleting your account permanently removes your rooms and history. This cannot be undone.
            </p>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="rounded-xl border border-rose/40 px-5 py-2.5 font-semibold text-rose transition-colors hover:bg-rose/10"
            >
              Delete Account
            </button>
          </section>
        </div>
      </main>

      <Modal open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Delete your account">
        <p className="mb-4 text-sm text-slate-400">
          This is permanent. Type <span className="font-mono font-semibold text-white">DELETE</span> to confirm.
        </p>
        <Input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="DELETE" />
        <Button
          variant="primary"
          disabled={deleteText !== 'DELETE'}
          onClick={deleteAccount}
          className="mt-4 w-full !bg-rose !shadow-none"
        >
          Permanently Delete Account
        </Button>
      </Modal>

      <CreateRoomModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
