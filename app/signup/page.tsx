"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store";
import { register, login } from "../../lib/mutation";
import { Hero, HeroSubtitle, HeroTitle } from "../components/hero";
import { Button } from "../components/button";
import { Loader } from "../components/Loader";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(email, password); // Returns user object
      const { token } = await login(email, password); // Returns token
      setAuth(user, token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://optimaizer-api.onrender.com/oauth/google";
  };

  return (
    <>
      <Loader show={loading} />
      {!loading && (
        <Hero>
          <HeroTitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            Sign Up for OptimAIzer
          </HeroTitle>
          <HeroSubtitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            Create an account to start debugging and reviewing code with AI.
          </HeroSubtitle>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-md translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]"
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white-a08 bg-background/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ac8eff]"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-white-a08 bg-background/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ac8eff]"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
            >
              Sign Up
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="mt-4 w-full"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button>
          </form>
          <p className="mt-4 translate-y-[-1rem] animate-fade-in text-center text-sm text-white/80 opacity-0 [--animation-delay:800ms]">
            Already have an account?{" "}
            <a href="/login" className="text-[#ac8eff] hover:underline">
              Log In
            </a>
          </p>
        </Hero>
      )}
    </>
  );
}
