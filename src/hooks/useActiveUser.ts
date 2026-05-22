"use client";

import { useEffect, useState } from "react";
import { getActiveUser } from "@/actions/auth";

type ActiveUser = { id: string; email: string } | null;

const useActiveUser = () => {
  const [user, setUser] = useState<ActiveUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
};

export default useActiveUser;
