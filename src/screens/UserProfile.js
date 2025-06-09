"use client";

import { useState } from "react";
import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "../components/BackHeader";
import { getStyles } from "../styles/profile";
import { Feather } from "@expo/vector-icons";
import AnimProfileHeader from "../components/AnimProfileHeader";
import { useNavigation } from "@react-navigation/native";
import ReusableInput from "../components/Inputs";
import TabNavigation from "../components/TabsNavigator";
import MainBtn from "../components/MainBtn";
import { colors, fonts } from "../common/theme";

const UserProfile = () => {
  const mode = useColorScheme();
  const scroll = useSharedValue(0);
  const [activeTab, setActiveTab] = useState("personal");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigation = useNavigation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = e.contentOffset.y;
    },
  });

  const news = [
    {
      id: 1,
      headline:
        "Biden, Harris meet with national security team as US watches for Iranian retaliation",
      category: "Business",
      img: "https://media.cnn.com/api/v1/images/stellar/prod/02-gettyimages-1731157124.JPG?c=16x9&q=h_653,w_1160,c_fill/f_webp",
      read_time: 5,
      time: "2024-08-06T03:36:57.865000000Z",
      bookmarked: true,
    },
    {
      id: 2,
      headline:
        "'Fight for our future': Kamala Harris and Tim Walz hold first rally",
      category: "Politics",
      img: "https://www.aljazeera.com/wp-content/uploads/2024/08/2024-08-06T233754Z_610419846_RC2MA9AWTWI6_RTRMADP_3_USA-ELECTION-HARRIS-1-1722993495.jpg?resize=730%2C410&quality=80",
      read_time: 3,
      time: "2024-08-07T03:36:57.865000000Z",
      bookmarked: false,
    },
    {
      id: 3,
      headline:
        "Chappell Roan may have had the biggest Lollapalooza set of all time",
      category: "Entertainment",
      img: "https://media.cnn.com/api/v1/images/stellar/prod/chappell-roan-by-pooneh-ghana-for-lollapalooza-2024-pgh04133-enhanced-nr.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp",
      read_time: 2,
      time: "2024-08-07T03:20:57.865000000Z",
      bookmarked: true,
    },
    {
      id: 4,
      headline:
        "Simone Biles tells CNN competing in Paris 'meant the world' after struggles in Tokyo",
      category: "Sports",
      img: "https://media.cnn.com/api/v1/images/stellar/prod/dfc9b330-f5c3-4fcc-90aa-de5b49ffb1f0.jpg?q=w_1110,c_fill/f_webp",
      read_time: 4,
      time: "2024-08-07T03:00:57.865000000Z",
      bookmarked: false,
    },
    {
      id: 5,
      headline:
        "NASA delays SpaceX astronaut mission as rumors swirl about Boeing Starliner's safety",
      category: "Science",
      img: "https://media.cnn.com/api/v1/images/stellar/prod/iss071e182991-orig.jpg?c=16x9&q=h_653,w_1160,c_fill/f_webp",
      read_time: 3,
      time: "2024-08-06T03:00:57.865000000Z",
      bookmarked: false,
    },
  ];

  return (
    <SafeAreaView style={getStyles(mode).container}>
      {/* Top Bar  */}
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackHeader />
        <TouchableOpacity
          style={styles.logoutIcon}
          onPress={() => setShowLogoutModal(true)}
        >
          <Feather name='log-out' size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* User image */}
      <AnimProfileHeader
        scroll={scroll}
        name='Geek Spark'
        userName='geekSpark'
        image='https://i.pravatar.cc/200?u=dev@geekspark.com'
      />

      {/* News Listing */}
      <Animated.FlatList
        data={news}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 55,
          paddingBottom: 70,
        }}
        ListHeaderComponent={
          <ListHeaderComponent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
        onScroll={scrollHandler}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            </View>
            <Text style={[styles.modalMessage, getStyles(mode).userBioText]}>
              ¿Estás seguro de que deseas cerrar tu sesión?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowLogoutModal(false);
                  navigation.navigate("SignIn");
                }}
              >
                <Text style={styles.confirmButtonText}>Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Status Bar  */}
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const ListHeaderComponent = ({ activeTab, setActiveTab }) => {
  const mode = useColorScheme();

  const tabs = [
    {
      id: "personal",
      title: "Datos personales",
      icon: "user",
    },
    {
      id: "security",
      title: "Seguridad",
      icon: "shield",
    },
  ];

  return (
    <>
      {/* User Bio */}
      <View style={{ marginTop: 10 }}>
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          mode={mode}
        />

        {/* Tab Content */}
        {activeTab === "personal" ? (
          <PersonalDataTab mode={mode} />
        ) : (
          <SecurityTab mode={mode} />
        )}
      </View>
    </>
  );
};

const PersonalDataTab = ({ mode }) => {
  const [formData, setFormData] = useState({
    fullName: "Geek Spark",
    username: "@geekSpark",
    email: "dev@geekspark.com",
    phone: "+58 412 123 4567",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saving form data:", formData);
      // Handle save logic here
    }
  };

  return (
    <View style={styles.tabContent}>
      <ReusableInput
        label='Nombre completo'
        value={formData.fullName}
        onChangeText={(value) => handleInputChange("fullName", value)}
        placeholder='Ingresa tu nombre completo'
        error={errors.fullName}
        mode={mode}
      />

      <ReusableInput
        label='Nombre de usuario'
        value={formData.username}
        onChangeText={(value) => handleInputChange("username", value)}
        placeholder='@usuario'
        leftIcon='at-sign'
        error={errors.username}
        mode={mode}
      />

      <ReusableInput
        label='Correo electrónico'
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        placeholder='correo@ejemplo.com'
        keyboardType='email-address'
        leftIcon='mail'
        error={errors.email}
        mode={mode}
      />

      <ReusableInput
        label='Teléfono'
        value={formData.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        placeholder='+58 412 123 4567'
        keyboardType='phone-pad'
        leftIcon='phone'
        error={errors.phone}
        mode={mode}
      />

      <View style={styles.buttonSave}>
        <MainBtn title='Guardar cambios' onPress={handleSave} />
      </View>
    </View>
  );
};

const SecurityTab = ({ mode }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    console.log("Cambiar contraseña", formData);
    // Handle password change logic here
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.securityOption}>
        <ReusableInput
          label='Ingresa su contraseña actual'
          value={formData.currentPassword}
          onChangeText={(value) =>
            handlePasswordChange("currentPassword", value)
          }
          placeholder='Contraseña actual'
          leftIcon='lock'
          secureTextEntry={true}
          mode={mode}
        />
        <ReusableInput
          label='Ingresa su nueva contraseña'
          value={formData.newPassword}
          onChangeText={(value) => handlePasswordChange("newPassword", value)}
          placeholder='Nueva contraseña'
          leftIcon='lock'
          secureTextEntry={true}
          mode={mode}
        />
        <ReusableInput
          label='Confirma tu nueva contraseña'
          value={formData.confirmPassword}
          onChangeText={(value) =>
            handlePasswordChange("confirmPassword", value)
          }
          placeholder='Confirmar contraseña'
          leftIcon='lock'
          secureTextEntry={true}
          mode={mode}
        />
      </View>

      <View style={styles.buttonSave}>
        <MainBtn title='Cambiar contraseña' onPress={handleChangePassword} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    marginTop: 10,
    marginBottom: 25,
  },
  saveButton: {
    backgroundColor: "#0284c7",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSave: {
    marginTop: 20,
  },
  securityOption: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  securityOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#f0f9ff",
  },
  securityOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  securityOptionDesc: {
    fontSize: 13,
    color: "#666",
    maxWidth: "90%",
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  logoutIcon: {
    padding: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 300,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 5,
    ...fonts.bold,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    ...fonts.medium,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    ...fonts.medium,
  },
});

export default UserProfile;
