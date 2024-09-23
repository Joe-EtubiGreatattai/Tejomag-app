import React, { useEffect } from "react";
import * as Updates from "expo-updates";
import OnboardingNavigator from "./navigation/OnboardingNavigator";
import Push from "./Push-notification/PushNotificationComponent";

export default function App() {
  // useEffect(() => {
  //   async function checkForUpdates() {
  //     try {
  //       const update = await Updates.checkForUpdateAsync();
  //       if (update.isAvailable) {
  //         await Updates.fetchUpdateAsync();
  //         await Updates.reloadAsync();
  //       }
  //     } catch (e) {
  //       console.error('Failed to check for updates:', e);
  //     }
  //   }

  //   checkForUpdates();
  // }, []);

  return (
    <>
      <Push />
      <OnboardingNavigator />
    </>
  );
}
