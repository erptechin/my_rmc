import GhostGuard from "middleware/GhostGuard";

const ghostRoutes = {
  id: "ghost",
  Component: GhostGuard,
  children: [
    {
      path: "login",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/sign-in")).default,
      }),
    },
    {
      path: "sign-up",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/sign-up")).default,
      }),
    },
    {
      path: "forgot-password",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/forgot-password")).default,
      }),
    },
    {
      path: "reset-password/:email",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/reset-password")).default,
      }),
    }
  ],
};

export { ghostRoutes };
