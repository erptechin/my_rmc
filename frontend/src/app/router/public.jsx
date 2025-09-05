const publicRoutes = {
  id: "public",
  children: [
    {
      path: "prototypes",
      children: [
        {
          path: "errors",
          children: [
            {
              path: "404-v1",
              lazy: async () => ({
                Component: (await import("app/pages/errors/404"))
                  .default,
              }),
            },
            {
              path: "404-v2",
              lazy: async () => ({
                Component: (await import("app/pages/errors/404"))
                  .default,
              }),
            },
            {
              path: "404-v3",
              lazy: async () => ({
                Component: (await import("app/pages/errors/404"))
                  .default,
              }),
            },
            {
              path: "401",
              lazy: async () => ({
                Component: (await import("app/pages/errors/401"))
                  .default,
              }),
            },
            {
              path: "429",
              lazy: async () => ({
                Component: (await import("app/pages/errors/429"))
                  .default,
              }),
            },
            {
              path: "500",
              lazy: async () => ({
                Component: (await import("app/pages/errors/500"))
                  .default,
              }),
            },
          ],
        }
      ],
    },
  ],
};

export { publicRoutes };
