import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  useColorScheme,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tStyles, colors } from "../common/theme";
import { getStyles } from "../styles/selectpreferences";
import BackHeader from "../components/BackHeader";
import VogueHeading from "../components/VogueHeading";
import HazyTextInput from "../components/HazyTextInput";
import MainBtn from "../components/MainBtn";
import { Feather } from "@expo/vector-icons";

const SelectCountry = ({ navigation }) => {
  const mode = useColorScheme();
  const countries = [
    { id: 1, name: "Argentina", flag: "🇦🇷" },
    { id: 2, name: "Afghanistan", flag: "🇦🇫" },
    { id: 3, name: "Armenia", flag: "🇦🇲" },
    { id: 4, name: "Antarctica", flag: "🇦🇶" },
    { id: 5, name: "Australia", flag: "🇦🇺" },
    { id: 6, name: "Algeria", flag: "🇩🇿" },
    { id: 7, name: "Indonesia", flag: "🇮🇩" },
    { id: 8, name: "Ireland", flag: "🇮🇪" },
    { id: 9, name: "India", flag: "🇮🇳" },
    { id: 10, name: "Pakistan", flag: "🇵🇰" },
    { id: 11, name: "United Kingdom", flag: "🇬🇧" },
    { id: 12, name: "United States", flag: "🇺🇸" },
  ];

  const [selected, setSelected] = React.useState(5);

  return (
    <SafeAreaView style={getStyles(mode).container}>
      <KeyboardAvoidingView
        behavior='height'
        style={[tStyles.flex1, { justifyContent: "space-between" }]}
      >
        {/* Back Header */}
        <View style={{ paddingHorizontal: 15 }}>
          <BackHeader skip={() => navigation.navigate("BottomTabNavigator")} />
        </View>

        {/* Screen Heading */}
        <View style={[{ paddingHorizontal: 15, marginBottom: 10 }]}>
          <VogueHeading f_line='What is your' s_line='country?' />

          {/* Search Country Input */}
          <View style={{ marginTop: 25 }}>
            <HazyTextInput
              icon='search'
              placeholder='Search country...'
              reverse={true}
            />
          </View>
        </View>

        {/* Countries Listing */}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={countries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CountryItem
              item={item}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
        />

        {/* Continue Button */}
        <View
          style={[
            tStyles.endx,
            { marginTop: 15, marginBottom: 25, paddingHorizontal: 15 },
          ]}
        >
          <MainBtn
            onPress={() => navigation.navigate("SelectTopics")}
            title='Siguiente'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const CountryItem = ({ item, selected, setSelected }) => {
  const mode = useColorScheme();
  const isSelected = () => selected == item.id;

  return (
    <TouchableOpacity
      onPress={() => setSelected(item.id)}
      style={
        isSelected()
          ? getStyles(mode).countryItemSelected
          : getStyles(mode).countryItem
      }
    >
      <Text style={{ fontSize: 25 }}>{item.flag}</Text>

      <View style={[tStyles.flex1, tStyles.spacedRow]}>
        <Text
          style={[
            getStyles(mode).countryName,
            isSelected() ? { color: colors.white } : null,
          ]}
        >
          {item.name}
        </Text>

        {isSelected() && (
          <View style={getStyles(mode).checkBox}>
            <Feather name='check' size={12} color={colors.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SelectCountry;
