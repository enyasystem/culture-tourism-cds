"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
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

export default function SettingsPage() {
  return (
    <AdminLayout currentPath="/admin/settings">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Platform Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Jos Culture & Tourism Platform" />
                  </div>
                  <div>
                    <Label htmlFor="platform-tagline">Tagline</Label>
                    <Input id="platform-tagline" defaultValue="Discover the Beauty of Plateau State" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="platform-description">Description</Label>
                  <Textarea
                    id="platform-description"
                    defaultValue="A platform for NYSC corps members to explore, share, and celebrate the rich cultural heritage and natural beauty of Plateau State."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="admin@josculture.gov.ng" />
                  </div>
                  <div>
                    <Label htmlFor="support-phone">Support Phone</Label>
                    <Input id="support-phone" defaultValue="+234 73 123 4567" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow User Registration</Label>
                    <p className="text-sm text-muted-foreground">Enable new users to register on the platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-approve Stories</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically publish user stories without admin review
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">Notify admins when new users register</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Content Submission</Label>
                    <p className="text-sm text-muted-foreground">Notify admins when users submit new content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Send weekly analytics reports to admins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify admins of system issues and errors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="smtp.gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" placeholder="your-email@gmail.com" />
                  </div>
                  <div>
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" defaultValue="noreply@josculture.gov.ng" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input id="session-duration" defaultValue="60" type="number" />
                </div>
                <div>
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Textarea
                    id="password-policy"
                    defaultValue="Minimum 8 characters, must include uppercase, lowercase, number, and special character"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-detect Inappropriate Content</Label>
                    <p className="text-sm text-muted-foreground">Use AI to flag potentially inappropriate content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profanity Filter</Label>
                    <p className="text-sm text-muted-foreground">Automatically filter profanity in user content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="blocked-words">Blocked Words (comma-separated)</Label>
                  <Textarea id="blocked-words" placeholder="Enter words to block..." rows={2} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Connected Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Supabase Database</h4>
                      <p className="text-sm text-muted-foreground">Primary database for user data and content</p>
                    </div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Service</h4>
                      <p className="text-sm text-muted-foreground">SMTP service for sending notifications</p>
                    </div>
                  </div>
                  <Badge variant="outline">Not Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">CDN Storage</h4>
                      <p className="text-sm text-muted-foreground">Content delivery network for images and media</p>
                    </div>
                  </div>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Theme</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="p-4 border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-to-br from-white to-gray-100 rounded mb-2"></div>
                      <p className="text-sm text-center">Light</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
                      <p className="text-sm text-center">Dark</p>
                    </div>
                    <div className="p-4 border rounded-lg cursor-pointer hover:border-primary">
                      <div className="w-full h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-2"></div>
                      <p className="text-sm text-center">System</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                      <Label htmlFor="primary-color" className="text-sm">
                        Primary
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="primary-color" defaultValue="#8b5cf6" />
                        <div className="w-8 h-8 bg-purple-500 rounded border"></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary-color" className="text-sm">
                        Secondary
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="secondary-color" defaultValue="#06b6d4" />
                        <div className="w-8 h-8 bg-cyan-500 rounded border"></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accent-color" className="text-sm">
                        Accent
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="accent-color" defaultValue="#10b981" />
                        <div className="w-8 h-8 bg-emerald-500 rounded border"></div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="warning-color" className="text-sm">
                        Warning
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="warning-color" defaultValue="#f59e0b" />
                        <div className="w-8 h-8 bg-amber-500 rounded border"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-rate-limit">API Rate Limit (requests per minute)</Label>
                  <Input id="api-rate-limit" defaultValue="100" type="number" />
                </div>
                <div>
                  <Label htmlFor="max-file-size">Maximum File Upload Size (MB)</Label>
                  <Input id="max-file-size" defaultValue="10" type="number" />
                </div>
                <div>
                  <Label htmlFor="cache-duration">Cache Duration (hours)</Label>
                  <Input id="cache-duration" defaultValue="24" type="number" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Create daily database backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" defaultValue="30" type="number" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Create Backup Now</Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
