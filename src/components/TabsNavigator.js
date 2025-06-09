import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../common/theme";
import { getStyles } from "../styles/common";

const TabNavigation = ({ tabs, activeTab, onTabPress, style }) => {
  const mode = useColorScheme();

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          {tab.icon && (
            <Feather
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? "#fff" : "#666"}
              style={styles.tabIcon}
            />
          )}
          <Text
            style={[
              styles.tabText,
              getStyles(mode).mainBtnText,
              {
                color: activeTab === tab.id ? "#fff" : "#000",
                fontWeight: activeTab === tab.id ? "600" : "500",
              },
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
  },
});

export default TabNavigation;
