import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound.tsx";

const Practice = lazy(() => import("./pages/Practice"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Teacher = lazy(() => import("./pages/Teacher"));
const ClassView = lazy(() => import("./pages/teacher/ClassView"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div>}>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/teacher/class/:id" element={<ClassView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
