import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="home_gv" >
        {/* Đặt màn hình mặc định */}
        
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }}/>


        {/* <Stack.Screen name="(tabgv)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabgv)/home_gv" options={{ headerShown: false }} />
        <Stack.Screen name="(tabgv)/edit_class" options={{ headerShown: false }} />
        <Stack.Screen name="(tabgv)/create_class" options={{ headerShown: false }} />

        {/* <Stack.Screen name="(tabsv)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(tabsv)/home_sv" options={{ headerShown: false }} />
        <Stack.Screen name="(tabsv)/submission" options={{ headerShown: false }} />
        <Stack.Screen name="(tabsv)/assignment_sv" options={{ headerShown: false }} />
        <Stack.Screen name="(tabsv)/class_register" options={{ headerShown: false }} />
        <Stack.Screen name="documents-class" options={{ headerShown: false }} />

      </Stack>
    </ThemeProvider>
  );
}
