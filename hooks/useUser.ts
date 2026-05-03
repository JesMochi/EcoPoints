"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

export function useUser() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setLoading(false);
      } else {
        fetchUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading };
}
