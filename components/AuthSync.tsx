"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/lib/store";

export default function AuthSync() {
  useEffect(() => {
    const applySession = (session: any) => {
      const authedUser = session?.user;
      if (authedUser) {
        useStore.setState({
          user: {
            id: authedUser.id,
            email: authedUser.email ?? "",
            firstName: authedUser.user_metadata?.firstName ?? "",
            username: authedUser.user_metadata?.username ?? "",
            surname: authedUser.user_metadata?.surname ?? "",
          },
          isAuthenticated: true,
          hasEnteredApp: true,
          isDemoMode: false,
        });
        useStore.getState().loadUserData(authedUser.id);
      } else {
        useStore.setState((s) => ({
          user: null,
          isAuthenticated: false,
          hasEnteredApp: s.isDemoMode,
          businessDays: s.isDemoMode ? s.businessDays : [],
          debtors: s.isDemoMode ? s.debtors : [],
        }));
      }
    };

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}
