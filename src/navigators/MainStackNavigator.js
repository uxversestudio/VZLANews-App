import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import * as Screens from "../screens";

const Stack = createStackNavigator();

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='Onboarding'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} />
      <Stack.Screen name='Onboarding' component={Screens.Onboarding} />
      <Stack.Screen name='SignInOptions' component={Screens.SignInOptions} />
      <Stack.Screen name='SignUp' component={Screens.SignUp} />
      <Stack.Screen name='SignIn' component={Screens.SignIn} />
      <Stack.Screen name='OauthSuccess' component={Screens.OauthSuccess} />
      <Stack.Screen name='ForgotPassword' component={Screens.ForgotPassword} />
      <Stack.Screen name='EnterOTP' component={Screens.EnterOTP} />
      <Stack.Screen name='SetPassword' component={Screens.SetPassword} />
      <Stack.Screen name='Terms' component={Screens.Terms} />
      <Stack.Screen name='SelectCountry' component={Screens.SelectCountry} />
      <Stack.Screen name='SelectTopics' component={Screens.SelectTopics} />
      <Stack.Screen name='SelectSources' component={Screens.SelectSources} />
      <Stack.Screen
        name='FillInformation'
        component={Screens.FillInformation}
      />
      <Stack.Screen name='AccountReady' component={Screens.AccountReady} />
      <Stack.Screen name='NewsDetail' component={Screens.NewsDetails} />
      <Stack.Screen name='SourceProfile' component={Screens.SourceProfile} />
      <Stack.Screen name='Followers' component={Screens.Followers} />
      <Stack.Screen name='Following' component={Screens.Following} />
      <Stack.Screen name='Comments' component={Screens.Comments} />
      <Stack.Screen name='HashDetails' component={Screens.HashDetails} />
      <Stack.Screen name='SearchResults' component={Screens.SearchResults} />
      <Stack.Screen name='Notifications' component={Screens.Notifications} />
      <Stack.Screen name='TopicNews' component={Screens.TopicNews} />
    </Stack.Navigator>
  );
};
