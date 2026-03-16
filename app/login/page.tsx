'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Use fixed demo email since login is password-based.
      await signIn("demo@nandatent.com", password)
      router.push("/")
    } catch (err) {
      setError((err as Error)?.message ?? "Incorrect password")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-2xl font-bold text-center text-green-700">
          NANDA TENT HOUSE
        </h1>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Password Field */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >

            {loading && <Loader2 className="animate-spin" size={18}/>}

            Sign In

          </button>

        </form>

      </div>

    </div>

  )
}