import React, { useEffect } from "react";
import * as Updates from "expo-updates";
import OnboardingNavigator from "./navigation/OnboardingNavigator";
import Push from "./Push-notification/PushNotificationComponent";
import TrackingPermissionDialog from './components/TrackingPermissionDialog';

export default function App() {
  const handleTrackingPermission = (status) => {
    if (status === 'granted') {
      // Initialize your tracking here
      console.log('Tracking permission granted');
    } else {
      console.log('Tracking permission denied');
    }
  };

  return (
    <>
      <OnboardingNavigator />
      <Push />
      <TrackingPermissionDialog onResult={handleTrackingPermission} />
    </>
  );
}