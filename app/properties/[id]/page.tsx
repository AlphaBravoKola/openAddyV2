"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Property {
  id: string
  name: string
  address: string
  instructions: string
  createdAt: string
}

interface Message {
  id: string
  content: string
  sender: {
    name: string
  }
  createdAt: string
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProperty()
    fetchMessages()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/properties/${params.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Property not found</h3>
          <p className="mt-2 text-sm text-gray-500">
            The property you're looking for doesn't exist or you don't have access to it.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go back to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {property.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {property.address}
                </p>
              </div>
              {session?.user.role === "MANAGER" && (
                <Link
                  href={`/properties/${property.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Property
                </Link>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">
                Delivery Instructions
              </h4>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                {property.instructions}
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900">Messages</h4>
              <div className="mt-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">
                        {message.sender.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-6">
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 