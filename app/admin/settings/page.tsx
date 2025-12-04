"use client"

import { useState } from 'react'
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
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Change your admin password below.</p>
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
