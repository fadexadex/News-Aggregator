"use client";

import { useState, useEffect } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, Menu, Clock, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCopilotReadable } from "@copilotkit/react-core"; 

const fetchNews = async (topic: string): Promise<NewsItem[]> => {
  const response = await fetch("http://localhost:3001/api/get-news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    toast.error("An error occurred, please try again.");
    return [];
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    toast.error("Unexpected API response format.");
    return [];
  }

  return data;
};

const fetchHistory = async (): Promise<string[]> => {
  const response = await fetch("/api/history");
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};

const updateHistory = async (topic: string): Promise<void> => {
  const response = await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!response.ok) throw new Error("Failed to update history");
};

interface NewsItem {
  id: number;
  title: string;
  content: string;
}

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useCopilotReadable({
    description: "The state of the searched news topics",
    value: JSON.stringify(news)
  });

  const loadHistory = async () => {
    try {
      const fetchedHistory = await fetchHistory();
      setHistory(fetchedHistory);
    } catch (error) {
      toast.error("Failed to load history");
    }
  };

  const handleSearch = async (searchTopic: string) => {
    setLoading(true);
    setTopic(searchTopic);
    try {
      const results = await fetchNews(searchTopic);
      setNews(results);
      await updateHistory(searchTopic);
      await loadHistory();
    } catch (error) {
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <header className="bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Search className="mr-2 h-6 w-6 text-blue-500" />
            Aggregator
          </h1>
          <div className="flex items-center space-x-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle history sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gray-900">
                <HistorySidebar
                  history={history}
                  onSelectTopic={handleSearch}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-grow flex">
        <aside className="hidden lg:block w-64 bg-gray-900 text-white">
          <HistorySidebar history={history} onSelectTopic={handleSearch} />
        </aside>

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
              className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
              onClick={() => handleSearch(topic)}
            >
              Search
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
                <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-blue-500 animate-spin" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => setSelectedNews(item)}
                >
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <p className="text-gray-600 line-clamp-3">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedNews && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedNews(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="sticky top-0 bg-white z-10 flex flex-row items-center justify-between">
              <CardTitle className="text-blue-600">
                {selectedNews.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNews(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="bg-gray-50 p-6">
              <p className="text-gray-700 leading-relaxed">
                {selectedNews.content}
              </p>
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
  );
}

function HistorySidebar({
  history,
  onSelectTopic,
}: {
  history: string[];
  onSelectTopic: (topic: string) => void;
}) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-50">
        Search History
      </h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((topic, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => onSelectTopic(topic)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {topic}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No search history yet.</p>
        )}
      </ScrollArea>
    </div>
  );
}
