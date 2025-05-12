"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, Filter, RefreshCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"

// Types
interface JiraReply {
  key: string
  category: "phase1" | "in-progress" | "completed"
  message: string
  createdAt: string
}

export default function Home() {
  const [replies, setReplies] = useState<JiraReply[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [newReply, setNewReply] = useState({
    key: "",
    message: "",
    category: ""
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Fetch data
  const fetchReplies = async () => {
    setLoading(true)
    try {
      const data = await apiClient.getReplies()
      console.log(data)
      setReplies(data)
    } catch (error) {
      console.error("Failed to fetch replies:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReplies()
  }, [])

  // Filter replies based on active tab
  const filteredReplies = replies.filter((reply) => {
    if (activeTab === "all") return true
    return reply.category === activeTab
  })

  // Handle adding a new reply
  const handleAddReply = async () => {
    try {
      await apiClient.createReply(newReply)
      setIsAddDialogOpen(false)
      setNewReply({key: "", message: "", category: "phase1" })
      toast({
        title: "Success",
        description: "Reply added successfully",
      })
      fetchReplies()
    } catch (error) {
      console.error("Failed to add reply:", error)
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a reply
  const handleDeleteReply = async (key: string) => {
    try {
      await apiClient.deleteReply(key)
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      })
      fetchReplies()
    } catch (error) {
      console.error("Failed to delete reply:", error)
      toast({
        title: "Error",
        description: "Failed to delete reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle auto reply for a single Jira issue
  const handleAutoReply = async (key: string) => {
    try {
      await apiClient.autoReplyJira(key)
      toast({
        title: "Success",
        description: "Auto-replied to Jira issue successfully",
      })
      fetchReplies()
    } catch (error) {
      console.error("Failed to auto-reply:", error)
      toast({
        title: "Error",
        description: "Failed to auto-reply to Jira issue. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle auto reply for all Jira issues
  const handleAutoReplyAll = async () => {
    try {
      await apiClient.autoReplyAllJira()
      toast({
        title: "Success",
        description: "Auto-replied to all Jira issues successfully",
      })
      fetchReplies()
    } catch (error) {
      console.error("Failed to auto-reply to all:", error)
      toast({
        title: "Error",
        description: "Failed to auto-reply to all Jira issues. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-white p-6 md:flex">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900">Jira Reply App</h1>
        </div>
        <nav className="flex flex-1 flex-col space-y-1">
          <Button variant="ghost" className="justify-start gap-2 px-3" asChild>
            <a href="#" className="font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-dashboard"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Dashboard
            </a>
          </Button>
          <Button variant="secondary" className="justify-start gap-2 px-3" asChild>
            <a href="#" className="font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-square"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Replies
            </a>
          </Button>
          <Button variant="ghost" className="justify-start gap-2 px-3" asChild>
            <a href="#" className="font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </a>
          </Button>
        </nav>
        <div className="mt-auto pt-4">
          <div className="rounded-lg bg-slate-100 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                N
              </div>
              <div>
                <p className="text-sm font-medium">{replies.filter((r) => r.category === "phase1").length} issues</p>
                <p className="text-xs text-slate-500">Need attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-6 shadow-sm">
          <h2 className="text-lg font-medium">Dashboard Replies</h2>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchReplies} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input type="search" placeholder="Search..." className="w-64 pl-8" />
            </div>
            <Button size="sm" variant="ghost" className="rounded-full">
              <span className="sr-only">User account</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </Button>
          </div>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Replies</CardTitle>
              <Button className="ml-auto gap-2" onClick={handleAutoReplyAll}>
                <Send className="h-4 w-4" />
                Reply All Jira Issues
              </Button>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-sm text-slate-500">
                Manage your Jira replies efficiently with advanced filtering and bulk actions.
              </p>

              <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="all">All Replies</TabsTrigger>
                    <TabsTrigger value="phase1">Phase1</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <TabsContent value={activeTab} className="mt-4">
                  <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="key" className="mb-2 block text-sm font-medium">
                        Jira Issue ID
                      </label>
                      <Input key="key" placeholder="Enter Jira ID" />
                    </div>
                    <div>
                      <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Category
                      </label>
                      <Select>
                        <SelectTrigger key="category">
                          <SelectValue placeholder="All Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Category</SelectItem>
                          <SelectItem value="phase1">phase1</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium">
                        Message
                      </label>
                      <Input key="message" placeholder="Enter message" />
                    </div>
                    
                  </div>

                  <div className="mb-6 flex justify-start">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Reply
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Reply</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="new-key">Jira Issue ID</Label>
                            <Input
                              key="new-key"
                              value={newReply.key}
                              onChange={(e) => setNewReply({ ...newReply, key: e.target.value })}
                              placeholder="Enter Jira ID"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new-category">Category</Label>
                            <Select
                              value={newReply.category}
                              onValueChange={(value) => setNewReply({ ...newReply, category: value as any })}
                            >
                              <SelectTrigger key="new-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="phase1">phase1</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new-message">Message</Label>
                            <Input
                              key="new-message"
                              value={newReply.message}
                              onChange={(e) => setNewReply({ ...newReply, message: e.target.value })}
                              placeholder="Enter message"
                            />
                          </div>
                          
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddReply}>Add Reply</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Jira Issue ID</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Created at</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReplies.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No replies found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredReplies.map((reply) => (
                              <TableRow key={reply.key}>
                                <TableCell className="font-medium">{reply.key}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      reply.category === "phase1"
                                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                        : reply.category === "in-progress"
                                          ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                          : "bg-green-50 text-green-700 hover:bg-green-50"
                                    }
                                  >
                                    {reply.category === "phase1"
                                      ? "phase1"
                                      : reply.category === "in-progress"
                                        ? "In Progress"
                                        : "Completed"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{reply.message}</TableCell>
                                <TableCell>{new Date(reply.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {reply.category !== "completed" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAutoReply(reply.key)}
                                        className="gap-1"
                                      >
                                        <Send className="h-3 w-3" />
                                        Auto Reply
                                      </Button>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Open menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() => handleDeleteReply(reply.key)}
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
