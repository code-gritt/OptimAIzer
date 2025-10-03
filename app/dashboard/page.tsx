"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Hero, HeroSubtitle, HeroTitle } from "../components/hero";
import { Button } from "../components/button";
import { useAuthStore } from "../../lib/store";
import { getMe } from "../../lib/mutation";
import { Loader } from "../components/Loader";

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    const fetchUser = async (authToken: string) => {
      setLoading(true);
      try {
        const userData = await getMe(authToken);
        useAuthStore.setState({ user: userData, token: authToken });
      } catch (err: any) {
        setError(err.message);
        useAuthStore.getState().clearAuth();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (tokenFromUrl) {
      // Handle Google OAuth redirect
      fetchUser(tokenFromUrl);
      router.replace("/dashboard"); // Clean up URL
    } else if (token) {
      // Verify existing token
      fetchUser(token);
    } else {
      router.push("/login");
    }
  }, [token, searchParams, router]);

  return (
    <>
      <Loader show={loading} />
      {!loading && user && token && (
        <Hero>
          <HeroTitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            Welcome, {user.email}
          </HeroTitle>
          <HeroSubtitle className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            Your Credits: {user.credits} <br />
            Start reviewing and debugging your code with OptimAIzer’s AI-powered
            tools.
          </HeroSubtitle>
          <div className="mt-8 flex translate-y-[-1rem] animate-fade-in flex-col space-y-4 opacity-0 [--animation-delay:600ms] sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              href="/upload"
              variant="primary"
              size="large"
              className="w-full text-center sm:w-auto"
            >
              Upload Code
            </Button>
            <Button
              href="/analysis"
              variant="secondary"
              size="large"
              className="w-full text-center sm:w-auto"
            >
              Start Analysis
            </Button>
          </div>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </Hero>
      )}
    </>
  );
}
