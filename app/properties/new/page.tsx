"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function NewPropertyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    instructions: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create property")
      }

      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add New Property
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="instructions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Instructions
                </label>
                <div className="mt-1">
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={6}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, instructions: e.target.value })
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Provide clear instructions for delivery drivers on how to access
                  and deliver packages to this property.
                </p>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? "Creating..." : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 