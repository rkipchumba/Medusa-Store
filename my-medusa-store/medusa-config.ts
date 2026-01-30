import { loadEnv, defineConfig, Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [
        Modules.CACHE,
        ContainerRegistrationKeys.LOGGER,
        Modules.EVENT_BUS,
      ],
      options: {
        providers: [
          // default email/password provider
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },

          // your custom phone auth provider
          {
            resolve: "./src/modules/auth",
            id: "phone-auth",
            options: {
              jwtSecret:
                process.env.PHONE_AUTH_JWT_SECRET || "supersecret",
            },
          },
        ],
      },
    },
  ],
})