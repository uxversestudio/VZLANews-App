import React from "react";
import { View, useColorScheme, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getStyles } from "../styles/common";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../common/theme";
import * as Screens from "../screens";

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name='Chats'
        component={Screens.Home}
        options={{
          title: "GS News",
          tabBarIcon: () => <Feather name='home' size={25} />,
          tabBarSelectedIcon: () => (
            <MaterialCommunityIcons
              name='home'
              size={32}
              color={colors.primary}
            />
          ),
          tabBarBadge: 10,
        }}
      />
      <Tab.Screen
        name='Search'
        component={Screens.Search}
        options={{
          tabBarIcon: () => <Feather name='search' size={25} />,
          tabBarSelectedIcon: () => (
            <MaterialCommunityIcons
              name='magnify'
              size={32}
              color={colors.primary}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Bookmarks'
        component={Screens.Bookmarks}
        options={{
          tabBarIcon: () => <Feather name='bookmark' size={25} />,
          tabBarSelectedIcon: () => (
            <MaterialCommunityIcons
              name='bookmark'
              size={32}
              color={colors.primary}
            />
          ),
        }}
      />

      {/*<Tab.Screen 
              name="Profile" 
              component={Screens.UserProfile} 
              options={{ 
                tabBarIcon: () =>  (
                    <Image 
                        source={{ uri: 'https://i.pravatar.cc/200?u=dev@geekspark.com' }}
                        style={[{ width: 28, height: 28, borderRadius: 15 }]}
                    />
                ),
                tabBarSelectedIcon: () => (
                    <Image 
                        source={{ uri: 'https://i.pravatar.cc/200?u=dev@geekspark.com' }}
                        style={[{ width: 28, height: 28, borderRadius: 15, borderWidth: 2, borderColor: colors.primary }]}
                    />
                ),
              }} 
          />*/}
    </Tab.Navigator>
  );
};

function CustomTabBar({ state, descriptors, navigation }) {
  const mode = useColorScheme();

  return (
    <View style={getStyles(mode).bottomTabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const tabBarIcon =
          options.tabBarIcon !== undefined ? options.tabBarIcon : () => {};

        const tabBarSelectedIcon =
          options.tabBarSelectedIcon !== undefined
            ? options.tabBarSelectedIcon
            : () => {};

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
            key={index}
          >
            {!isFocused ? tabBarIcon() : tabBarSelectedIcon()}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default BottomTabNavigator;
