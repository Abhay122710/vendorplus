import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

/**
 * Wraps pages that shopowners should NOT access.
 * If the logged-in user is a shopowner, redirect them to /dashboard.
 * Otherwise, render children normally.
 */
export default function ShopownerGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  // Still loading auth state — don't redirect yet
  if (loading) return null;

  // If logged in as shopowner, force them to dashboard
  if (user && profile?.role === "shopowner") {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in as admin, force them to admin dashboard
  if (user && profile?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
