import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  useColorScheme,
  FlatList,
  ImageBackground,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CenterImgCatItem from "../components/CenterImgCatItem";
import { tStyles } from "../common/theme";
import { getStyles } from "../styles/selectpreferences";
import BackHeader from "../components/BackHeader";
import VogueHeading from "../components/VogueHeading";
import HazyTextInput from "../components/HazyTextInput";
import MainBtn from "../components/MainBtn";

const SelectSources = ({ navigation }) => {
  const mode = useColorScheme();
  const topics = [
    {
      id: 1,
      title: "CNN",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/600px-CNN_International_logo.svg.png",
    },
    {
      id: 2,
      title: "BBC",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/BBC_Worldwide_Logo.svg/1280px-BBC_Worldwide_Logo.svg.png",
    },
    {
      id: 3,
      title: "Al-Jazeera",
      image:
        "https://static.wikia.nocookie.net/youtube/images/6/68/Al_Jazeera_English.jpg/revision/latest?cb=20230127151411",
    },
    {
      id: 4,
      title: "Fox News",
      image:
        "https://www.hatchwise.com/wp-content/uploads/2023/08/Fox-News-Channel-Emblem-600x338.png.webp",
    },
    {
      id: 5,
      title: "CNET",
      image:
        "https://static.wikia.nocookie.net/ultimatepopculture/images/8/8f/Cnetlogo.png/revision/latest/scale-to-width-down/150?cb=20191022130326",
    },
    {
      id: 6,
      title: "Reuters",
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQGImiC0n_bM_r6d0b9j-fsq4Rmj1t6nqtQH67JgSibn2erpGJO",
    },
  ];

  const [selected, setSelected] = React.useState([2, 3, 5]);

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
          <VogueHeading f_line='Select your' s_line='news sources' />

          {/* Search Country Input */}
          <View style={{ marginTop: 25 }}>
            <HazyTextInput
              icon='search'
              placeholder='Search sources...'
              reverse={true}
            />
          </View>
        </View>

        {/* Topics Listing */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={topics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CenterImgCatItem
              item={item}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          contentContainerStyle={[{ paddingHorizontal: 15, paddingTop: 10 }]}
          numColumns={2}
          columnWrapperStyle={tStyles.spacedRow}
          ItemSeparatorComponent={<View style={{ height: 15 }} />}
        />

        {/* Continue Button */}
        <View
          style={[
            tStyles.endx,
            { marginTop: 15, marginBottom: 25, paddingHorizontal: 15 },
          ]}
        >
          <MainBtn
            onPress={() => navigation.navigate("FillInformation")}
            title='Siguiente'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SelectSources;
