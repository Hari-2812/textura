import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🔹 Define translations for supported languages
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Textura",
      home: "Home",
      boys: "Boys Collection",
      wishlist: "Wishlist",
      cart: "Cart",
      filter: "Filter",
      contact: "Contact Us",
      about: "About Textura",
      checkout: "Checkout",
      orderPlaced: "🎉 Order placed successfully!",
      total: "Total",
      sendMessage: "Send Message",
      name: "Full Name",
      address: "Address",
      phone: "Phone Number",
      payment: "Payment Method",
      placeOrder: "Place Order",
      chooseLanguage: "Choose Language",
    },
  },
  ta: {
    translation: {
      welcome: "டெக்ஸ்டுராவிற்கு வரவேற்கிறோம்",
      home: "முகப்பு",
      boys: "ஆண்கள் சேகரிப்பு",
      wishlist: "விருப்பப் பட்டியல்",
      cart: "வண்டி",
      filter: "வடிகட்டு",
      contact: "எங்களை தொடர்பு கொள்ளவும்",
      about: "டெக்ஸ்டுரா பற்றி",
      checkout: "செக் அவுட்",
      orderPlaced: "🎉 ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!",
      total: "மொத்தம்",
      sendMessage: "செய்தி அனுப்பு",
      name: "முழு பெயர்",
      address: "முகவரி",
      phone: "தொலைபேசி எண்",
      payment: "கட்டண முறை",
      placeOrder: "ஆர்டர் செய்",
      chooseLanguage: "மொழியைத் தேர்ந்தெடு",
    },
  },
  hi: {
    translation: {
      welcome: "टेक्सचुरा में आपका स्वागत है",
      home: "मुखपृष्ठ",
      boys: "लड़कों का संग्रह",
      wishlist: "इच्छा सूची",
      cart: "कार्ट",
      filter: "फ़िल्टर",
      contact: "संपर्क करें",
      about: "टेक्सचुरा के बारे में",
      checkout: "चेकआउट",
      orderPlaced: "🎉 ऑर्डर सफलतापूर्वक किया गया!",
      total: "कुल",
      sendMessage: "संदेश भेजें",
      name: "पूरा नाम",
      address: "पता",
      phone: "फ़ोन नंबर",
      payment: "भुगतान विधि",
      placeOrder: "ऑर्डर करें",
      chooseLanguage: "भाषा चुनें",
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("preferredLang") || "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
