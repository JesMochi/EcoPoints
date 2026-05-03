import { supabase } from "./supabase";
import type { LoginFormData, RegisterFormData, UserRole } from "@/types";

export async function signIn({ email, password }: LoginFormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUp({
  email,
  password,
  username,
  role,
}: RegisterFormData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, role } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (data?.role as UserRole) ?? null;
}

export function getRoleRedirect(role: UserRole): string {
  if (role === "centro_acopio") return "/centro";
  if (role === "admin") return "/admin";
  return "/dashboard";
}
