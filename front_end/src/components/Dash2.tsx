'use client'

import { useState } from "react"
import { CopilotPopup } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X, Search } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useCopilotReadable } from "@copilotkit/react-core"

const fetchNews = async (topic: string): Promise<NewsItem[]> => {
  const response = await fetch("http://localhost:3001/api/get-news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  })

  if (!response.ok) {
    toast.error("An error occurred, please try again.")
    return []
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    toast.error("Unexpected API response format.")
    return []
  }

  return data
}

const updateHistory = async (topic: string): Promise<void> => {
  const response = await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  })
  if (!response.ok) throw new Error("Failed to update history")
}

interface NewsItem {
  id: number
  title: string
  content: string
}

export default function Dashboard() {
  const [topic, setTopic] = useState("")
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useCopilotReadable({
    description: "The state of the searched news topics",
    value: JSON.stringify(news)
  })

  const handleSearch = async (searchTopic: string) => {
    setLoading(true)
    setTopic(searchTopic)
    try {
      const results = await fetchNews(searchTopic)
      setNews(results)
      await updateHistory(searchTopic)
    } catch (error) {
      toast.error("Failed to fetch news")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-lg z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Search className="mr-2 h-6 w-6 text-primary" />
            News Aggregator
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <Input
            className="flex-grow"
            placeholder="Enter a topic or keywords..."
            value={topic}
            required
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch(topic)}
          />
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => handleSearch(topic)}
          >
            Search
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                onClick={() => setSelectedNews(item)}
              >
                <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                  <p className="text-muted-foreground line-clamp-3">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedNews && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedNews(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex flex-row items-center justify-between">
              <CardTitle className="text-primary">{selectedNews.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNews(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="bg-gray-50 dark:bg-gray-900 p-6">
              <p className="text-foreground leading-relaxed">{selectedNews.content}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <CopilotPopup
        className="mb-36"
        labels={{
          title: "Your Assistant",
          initial: "Hi! 👋 How can I assist you today?",
        }}
      />
    </div>
  )
}