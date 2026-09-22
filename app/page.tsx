"use client";

import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isBootstrapping, isAuthenticated, router]);

  return (
    <Center h="100vh">
      <Loader />
    </Center>
  );
}
