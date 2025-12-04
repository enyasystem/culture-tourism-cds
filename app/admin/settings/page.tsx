"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Mail, Globe, Users, Palette } from "lucide-react"
import { useToast } from '@/components/ui/toast'

export default function SettingsPage() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const { toast } = useToast()

  // Fetch current user's email on mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const resp = await fetch('/api/admin/auth/get-user')
        if (resp.ok) {
          const data = await resp.json()
          if (data?.email) {
            setCurrentEmail(data.email)
          }
        }
      } catch (e) {
        console.error('failed to fetch user email', e)
      }
    }
    fetchUserEmail()
  }, [])

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast({ title: 'Error', description: 'New password must be at least 8 characters', variant: 'error' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'error' })
      return
    }

    try {
      setLoading(true)
      const resp = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await resp.json()
      if (!resp.ok) {
        toast({ title: 'Failed', description: json?.error || 'Could not change password', variant: 'error' })
        return
      }
      toast({ title: 'Success', description: 'Password changed successfully', variant: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e) {
      console.error('change password error', e)
      toast({ title: 'Error', description: 'Unexpected error', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({ title: 'Error', description: 'Valid email address is required', variant: 'error' })
      return
    }

    try {
      setEmailLoading(true)
      const resp = await fetch('/api/admin/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail }),
      })
      const json = await resp.json()
      if (!resp.ok) {
        toast({ title: 'Failed', description: json?.error || 'Could not change email', variant: 'error' })
        return
      }
      toast({ title: 'Success', description: 'Email updated successfully', variant: 'success' })
      setCurrentEmail(newEmail)
      setNewEmail('')
    } catch (e) {
      console.error('change email error', e)
      toast({ title: 'Error', description: 'Unexpected error', variant: 'error' })
    } finally {
      setEmailLoading(false)
    }
  }

  const handleResetEmail = () => {
    setNewEmail('')
  }

  // Hero images management
  const [heroItems, setHeroItems] = useState<Array<{ url: string; alt?: string; caption?: string; link?: string }>>([])
  const [heroUploading, setHeroUploading] = useState(false)
  const [heroFiles, setHeroFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const resp = await fetch('/api/admin/settings/hero')
        if (resp.ok) {
          const json = await resp.json()
          if (Array.isArray(json?.hero)) setHeroItems(json.hero)
        }
      } catch (e) {
        console.error('failed to fetch hero settings', e)
      }
    }
    fetchHero()
  }, [])

  const handleHeroFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setHeroFiles(Array.from(files))
  }

  const uploadHeroFile = async (file: File) => {
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    const resp = await fetch('/api/admin/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-filename': filename,
      },
      body: file,
    })
    if (!resp.ok) {
      const txt = await resp.text()
      throw new Error(txt || `Upload failed: ${resp.status}`)
    }
    const j = await resp.json()
    return j.publicUrl
  }

  const handleAddHero = async () => {
    if (!heroFiles || heroFiles.length === 0) return
    try {
      setHeroUploading(true)
      const uploaded: Array<{ url: string; alt?: string; caption?: string; link?: string }> = []
      for (const f of heroFiles) {
        try {
          const publicUrl = await uploadHeroFile(f)
          uploaded.push({ url: publicUrl, alt: '', caption: '', link: '' })
        } catch (innerErr) {
          console.error('failed to upload one hero file', innerErr)
          toast({ title: 'Upload failed', description: String(innerErr), variant: 'error' })
        }
      }
      if (uploaded.length > 0) {
        setHeroItems((s) => [...s, ...uploaded])
      }
      setHeroFiles([])
    } catch (e) {
      console.error('hero upload failed', e)
      toast({ title: 'Upload failed', description: String(e), variant: 'error' })
    } finally {
      setHeroUploading(false)
    }
  }

  const moveHero = (index: number, dir: -1 | 1) => {
    setHeroItems((s) => {
      const copy = [...s]
      const to = index + dir
      if (to < 0 || to >= copy.length) return copy
      const [item] = copy.splice(index, 1)
      copy.splice(to, 0, item)
      return copy
    })
  }

  const removeHero = (index: number) => {
    setHeroItems((s) => s.filter((_, i) => i !== index))
  }

  const updateHeroField = (index: number, field: string, value: string) => {
    setHeroItems((s) => s.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }

  const handleSaveHero = async () => {
    try {
      setHeroUploading(true)
      const resp = await fetch('/api/admin/settings/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: heroItems }),
      })
      const json = await resp.json()
      if (!resp.ok) {
        toast({ title: 'Failed', description: json?.error || 'Could not save hero images', variant: 'error' })
        return
      }
      toast({ title: 'Saved', description: 'Hero configuration updated', variant: 'success' })
      // Re-fetch saved value to ensure UI shows exactly what was persisted
      try {
        const read = await fetch('/api/admin/settings/hero')
        if (read.ok) {
          const j = await read.json()
          if (Array.isArray(j?.hero)) setHeroItems(j.hero)
        }
      } catch (e) {
        // non-fatal
        console.warn('could not re-read hero settings after save', e)
      }

      // Broadcast update to other open tabs/windows so the homepage can refresh
      try {
        localStorage.setItem('site-hero-updated', String(Date.now()))
      } catch (e) {
        // ignore
      }
      // Show saved JSON in a debug toast (truncated)
      try {
        const resp = await fetch('/api/admin/settings/hero')
        if (resp.ok) {
          const payload = await resp.json()
          const preview = JSON.stringify(payload).slice(0, 250)
          toast({ title: 'Saved (server)', description: preview + (String(payload).length > 250 ? '…' : ''), variant: 'default' })
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('save hero error', e)
      toast({ title: 'Error', description: 'Unexpected error', variant: 'error' })
    } finally {
      setHeroUploading(false)
    }
  }

  const handleResetHero = async () => {
    // Persist an empty hero array to remove current hero images
    try {
      setHeroUploading(true)
      const resp = await fetch('/api/admin/settings/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: [] }),
      })
      const json = await resp.json()
      if (!resp.ok) {
        toast({ title: 'Failed', description: json?.error || 'Could not reset hero images', variant: 'error' })
        return
      }
      // update local UI
      setHeroItems([])
      toast({ title: 'Reset', description: 'Hero images cleared', variant: 'success' })

      // broadcast change and re-fetch server value so UI and other tabs update
      try {
        const read = await fetch('/api/admin/settings/hero')
        if (read.ok) {
          const j = await read.json()
          if (Array.isArray(j?.hero)) setHeroItems(j.hero)
        }
      } catch (e) {
        console.warn('could not re-read hero settings after reset', e)
      }

      try {
        localStorage.setItem('site-hero-updated', String(Date.now()))
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error('reset hero error', e)
      toast({ title: 'Error', description: 'Unexpected error', variant: 'error' })
    } finally {
      setHeroUploading(false)
    }
  }

  const addHeroLabel = heroUploading ? 'Uploading...' : (heroFiles.length > 0 ? `Add (${heroFiles.length}) to Hero` : 'Add to Hero')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage platform configuration and preferences</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          <TabsTrigger value="security">Security</TabsTrigger>
          {/* <TabsTrigger value="integrations">Integrations</TabsTrigger> */}
          {/* <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* General settings placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Site Title</Label>
                    <Input placeholder="Culture & Tourism" />
                  </div>
                  <div>
                    <Label>Site Description</Label>
                    <Textarea rows={3} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Manage the homepage hero images. Upload images, add captions and links, and reorder them.</p>

                <div className="grid grid-cols-1 gap-3 max-w-2xl">
                  <div>
                    <Label htmlFor="hero-file">Upload Images</Label>
                    <input id="hero-file" type="file" accept="image/*" onChange={(e) => handleHeroFileChange(e.target.files)} className="block w-full" multiple />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => setHeroFiles([])} disabled={heroUploading || heroFiles.length === 0}>Clear</Button>
                    <Button onClick={handleAddHero} disabled={heroUploading || heroFiles.length === 0}>{addHeroLabel}</Button>
                  </div>

                  <div className="space-y-3">
                    {heroItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-muted p-3 rounded-lg">
                        <img src={item.url} alt={item.alt || `hero-${idx}`} className="w-28 h-16 object-cover rounded-md" />
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input value={item.caption || ''} onChange={(e) => updateHeroField(idx, 'caption', e.target.value)} placeholder="Caption" className="px-3 py-2 rounded-md" />
                            <input value={item.alt || ''} onChange={(e) => updateHeroField(idx, 'alt', e.target.value)} placeholder="Alt text" className="px-3 py-2 rounded-md" />
                            <input value={item.link || ''} onChange={(e) => updateHeroField(idx, 'link', e.target.value)} placeholder="Optional link" className="px-3 py-2 rounded-md" />
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => moveHero(idx, -1)} disabled={idx === 0}>Up</Button>
                            <Button variant="outline" size="sm" onClick={() => moveHero(idx, 1)} disabled={idx === heroItems.length - 1}>Down</Button>
                            <Button variant="destructive" size="sm" onClick={() => removeHero(idx)}>Remove</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={handleResetHero} disabled={heroUploading}>Reset</Button>
                    <Button onClick={handleSaveHero} disabled={heroUploading}>{heroUploading ? 'Saving...' : 'Save Hero Images'}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Update your admin account email address.</p>
                <div className="grid grid-cols-1 gap-3 max-w-xl">
                  <div>
                    <Label htmlFor="current-email">Current Email</Label>
                    <Input id="current-email" type="email" value={currentEmail} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label htmlFor="new-email">New Email</Label>
                    <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email address" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={handleResetEmail} disabled={emailLoading}>Reset</Button>
                    <Button onClick={handleChangeEmail} disabled={emailLoading}>{emailLoading ? 'Saving...' : 'Change Email'}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Change your admin account password.</p>
                <div className="grid grid-cols-1 gap-3 max-w-xl">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} disabled={loading}>Reset</Button>
                    <Button onClick={handleChangePassword} disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Alerts</div>
                    <div className="text-sm text-muted-foreground">Receive email updates for new activity</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Manage API keys and third-party integrations.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Enable Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Toggle site color scheme</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Advanced configuration and migrations.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
