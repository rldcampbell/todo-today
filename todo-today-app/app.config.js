const appVariant = process.env.APP_VARIANT === "dev" ? "dev" : "release"
const isDevVariant = appVariant === "dev"

module.exports = {
  expo: {
    name: isDevVariant ? "To-day Dev" : "To-day",
    slug: "todo-today",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: isDevVariant ? "todo-today-dev" : "todo-today",
    userInterfaceStyle: "light",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: isDevVariant
        ? "com.rldc.todotoday.dev"
        : "com.rldc.todotoday",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-dev-client",
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
      "expo-sqlite",
      "@react-native-community/datetimepicker",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
}
