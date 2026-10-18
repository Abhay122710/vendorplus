import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "hi";

type Translations = Record<string, Record<Lang, string>>;

const t: Translations = {
  // Navbar
  "nav.browseShops": { en: "Browse Shops", hi: "दुकानें देखें" },
  "nav.help": { en: "Help", hi: "सहायता" },
  "nav.admin": { en: "Admin", hi: "एडमिन" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.myOrders": { en: "My Orders", hi: "मेरे ऑर्डर" },
  "nav.login": { en: "Login", hi: "लॉगिन" },
  "nav.signup": { en: "Sign Up", hi: "साइन अप" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट" },
  "nav.cart": { en: "Cart", hi: "कार्ट" },

  // Index page - Hero
  "hero.title1": { en: "Shop Local.", hi: "स्थानीय खरीदें." },
  "hero.title2": { en: "Sell Smart.", hi: "स्मार्ट बेचें." },
  "hero.desc": { en: "Vendor+ connects customers with nearby shops while providing smart demand insights for shop owners.", hi: "Vendor+ ग्राहकों को पास की दुकानों से जोड़ता है और दुकानदारों को स्मार्ट डिमांड इनसाइट्स प्रदान करता है।" },
  "hero.browseShops": { en: "Browse Shops", hi: "दुकानें देखें" },
  "hero.registerShop": { en: "Register Shop", hi: "दुकान रजिस्टर करें" },
  "hero.customerLogin": { en: "Customer Login", hi: "ग्राहक लॉगिन" },
  "hero.shopkeeperLogin": { en: "Shopkeeper Login", hi: "दुकानदार लॉगिन" },

  // How it works
  "how.title": { en: "How Vendor+ Works", hi: "Vendor+ कैसे काम करता है" },
  "how.step1.title": { en: "Browse Shops", hi: "दुकानें देखें" },
  "how.step1.desc": { en: "Find local shops near you with products you love.", hi: "अपने पास की दुकानें खोजें जहाँ आपकी पसंदीदा चीज़ें मिलें।" },
  "how.step2.title": { en: "Place Order", hi: "ऑर्डर करें" },
  "how.step2.desc": { en: "Add to cart and checkout seamlessly online.", hi: "कार्ट में डालें और ऑनलाइन आसानी से चेकआउट करें।" },
  "how.step3.title": { en: "Auto Confirmation", hi: "ऑटो पुष्टि" },
  "how.step3.desc": { en: "Shop owners get instant call notifications to confirm.", hi: "दुकानदारों को पुष्टि के लिए तुरंत कॉल मिलती है।" },
  "how.step4.title": { en: "Get Insights", hi: "इनसाइट्स पाएं" },
  "how.step4.desc": { en: "Shop owners receive ML-powered demand forecasting.", hi: "दुकानदारों को AI-आधारित डिमांड फोरकास्टिंग मिलती है।" },

  // Features
  "features.title": { en: "Platform Features", hi: "प्लेटफ़ॉर्म की विशेषताएं" },
  "feat.shopLocal.title": { en: "Shop Local Businesses", hi: "स्थानीय दुकानों से खरीदें" },
  "feat.shopLocal.desc": { en: "Browse and order from your favourite neighbourhood shops.", hi: "अपनी पसंदीदा पड़ोस की दुकानों से ब्राउज़ करें और ऑर्डर करें।" },
  "feat.analytics.title": { en: "Smart Analytics", hi: "स्मार्ट एनालिटिक्स" },
  "feat.analytics.desc": { en: "Shop owners get real-time sales insights and performance tracking.", hi: "दुकानदारों को रियल-टाइम बिक्री इनसाइट्स और परफॉर्मेंस ट्रैकिंग मिलती है।" },
  "feat.ai.title": { en: "AI Demand Forecasting", hi: "AI डिमांड फोरकास्टिंग" },
  "feat.ai.desc": { en: "Machine learning predicts what products will trend next.", hi: "मशीन लर्निंग बताती है कि कौन से प्रोडक्ट्स ट्रेंड करेंगे।" },
  "feat.heatmap.title": { en: "Area Demand Heatmap", hi: "क्षेत्र डिमांड हीटमैप" },
  "feat.heatmap.desc": { en: "Visualise product demand across your city in real time.", hi: "अपने शहर में प्रोडक्ट डिमांड को रियल-टाइम में देखें।" },
  "feat.secure.title": { en: "Secure Transactions", hi: "सुरक्षित लेनदेन" },
  "feat.secure.desc": { en: "Masked calling and secure order management for everyone.", hi: "सभी के लिए मास्क्ड कॉलिंग और सुरक्षित ऑर्डर मैनेजमेंट।" },
  "feat.competition.title": { en: "Competition Analysis", hi: "प्रतिस्पर्धा विश्लेषण" },
  "feat.competition.desc": { en: "Understand your market position versus nearby shops.", hi: "पास की दुकानों के मुकाबले अपनी बाज़ार स्थिति समझें।" },

  // Footer
  "footer.desc": { en: "Connecting local shops with smart analytics and demand forecasting.", hi: "स्मार्ट एनालिटिक्स और डिमांड फोरकास्टिंग के साथ स्थानीय दुकानों को जोड़ना।" },
  "footer.platform": { en: "Platform", hi: "प्लेटफ़ॉर्म" },
  "footer.company": { en: "Company", hi: "कंपनी" },
  "footer.aboutVendor": { en: "About Vendor+", hi: "Vendor+ के बारे में" },
  "footer.contact": { en: "Contact", hi: "संपर्क" },
  "footer.legal": { en: "Legal", hi: "कानूनी" },
  "footer.privacy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "footer.terms": { en: "Terms of Service", hi: "सेवा की शर्तें" },
  "footer.rights": { en: "© 2026 Vendor+. All rights reserved.", hi: "© 2026 Vendor+. सर्वाधिकार सुरक्षित।" },

  // Chotu
  "chotu.welcome": {
    en: "Namaste! 🙏 I'm **Chotu**, your Vendor+ assistant!\n\nI can help you with:\n- 🛒 How to browse shops & place orders\n- 🏪 Setting up your shop as a shopkeeper\n- 📊 Understanding the analytics dashboard\n- ❓ Any questions about the platform\n\nHow can I help you today?",
    hi: "नमस्ते! 🙏 मैं **छोटू** हूँ, आपका Vendor+ सहायक!\n\nमैं इनमें मदद कर सकता हूँ:\n- 🛒 दुकानें ब्राउज़ करना और ऑर्डर देना\n- 🏪 दुकानदार के रूप में दुकान सेटअप करना\n- 📊 एनालिटिक्स डैशबोर्ड समझना\n- ❓ प्लेटफ़ॉर्म से जुड़े कोई भी सवाल\n\nआज मैं आपकी कैसे मदद कर सकता हूँ?"
  },
  "chotu.placeholder": { en: "Ask Chotu anything...", hi: "छोटू से कुछ भी पूछें..." },
  "chotu.name": { en: "Chotu", hi: "छोटू" },
  "chotu.subtitle": { en: "Vendor+ Assistant", hi: "Vendor+ सहायक" },

  // Language toggle
  "lang.switch": { en: "हिंदी", hi: "English" },

  // Login page
  "login.welcome": { en: "Welcome Back", hi: "वापसी पर स्वागत है" },
  "login.subtitle": { en: "Sign in to your Vendor+ account", hi: "अपने Vendor+ अकाउंट में साइन इन करें" },
  "login.username": { en: "Username", hi: "यूज़रनेम" },
  "login.password": { en: "Password", hi: "पासवर्ड" },
  "login.usernamePlaceholder": { en: "Enter your username", hi: "अपना यूज़रनेम दर्ज करें" },
  "login.passwordPlaceholder": { en: "Enter password", hi: "पासवर्ड दर्ज करें" },
  "login.forgotPassword": { en: "Forgot password?", hi: "पासवर्ड भूल गए?" },
  "login.signIn": { en: "Sign In", hi: "साइन इन" },
  "login.signingIn": { en: "Signing in...", hi: "साइन इन हो रहा है..." },
  "login.noAccount": { en: "Don't have an account?", hi: "अकाउंट नहीं है?" },
  "login.signUp": { en: "Sign up", hi: "साइन अप करें" },
  "login.welcomeBack": { en: "Welcome back!", hi: "वापसी पर स्वागत है!" },
  "login.invalidCreds": { en: "Invalid credentials", hi: "अमान्य क्रेडेंशियल्स" },

  // Signup page
  "signup.title": { en: "Create Account", hi: "अकाउंट बनाएं" },
  "signup.subtitle": { en: "Join Vendor+ as a customer", hi: "Vendor+ पर ग्राहक के रूप में जुड़ें" },
  "signup.fullName": { en: "Full Name", hi: "पूरा नाम" },
  "signup.email": { en: "Email", hi: "ईमेल" },
  "signup.phone": { en: "Phone", hi: "फ़ोन" },
  "signup.username": { en: "Username", hi: "यूज़रनेम" },
  "signup.password": { en: "Password", hi: "पासवर्ड" },
  "signup.namePlaceholder": { en: "Your name", hi: "आपका नाम" },
  "signup.emailPlaceholder": { en: "you@example.com", hi: "you@example.com" },
  "signup.phonePlaceholder": { en: "+91XXXXXXXXXX", hi: "+91XXXXXXXXXX" },
  "signup.usernamePlaceholder": { en: "Choose username", hi: "यूज़रनेम चुनें" },
  "signup.passwordPlaceholder": { en: "Min 6 characters", hi: "कम से कम 6 अक्षर" },
  "signup.createAccount": { en: "Create Account", hi: "अकाउंट बनाएं" },
  "signup.creating": { en: "Creating account...", hi: "अकाउंट बन रहा है..." },
  "signup.maxAccounts": { en: "Max 2 accounts per email or phone number.", hi: "प्रति ईमेल या फ़ोन नंबर अधिकतम 2 अकाउंट।" },
  "signup.haveAccount": { en: "Already have an account?", hi: "पहले से अकाउंट है?" },
  "signup.signIn": { en: "Sign in", hi: "साइन इन करें" },
  "signup.passwordError": { en: "Password must be at least 6 characters", hi: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए" },
  "signup.success": { en: "Account created! Please check your email to verify your account.", hi: "अकाउंट बन गया! कृपया अपना ईमेल वेरिफ़ाई करें।" },
  "signup.failed": { en: "Signup failed", hi: "साइन अप विफल" },

  // Marketplace
  "marketplace.title": { en: "Local Shops", hi: "स्थानीय दुकानें" },
  "marketplace.subtitle": { en: "Discover shops near you", hi: "अपने पास की दुकानें खोजें" },
  "marketplace.searchPlaceholder": { en: "Search shops or categories...", hi: "दुकानें या श्रेणियाँ खोजें..." },
  "marketplace.viewProducts": { en: "View Products", hi: "प्रोडक्ट्स देखें" },
  "marketplace.noShops": { en: "No shops found matching your search.", hi: "आपकी खोज से मेल खाने वाली कोई दुकान नहीं मिली।" },

  // Cart
  "cart.title": { en: "Shopping Cart", hi: "शॉपिंग कार्ट" },
  "cart.empty": { en: "Your cart is empty", hi: "आपका कार्ट खाली है" },
  "cart.browseShops": { en: "Browse Shops", hi: "दुकानें देखें" },
  "cart.itemsFrom": { en: "Items from", hi: "सामान यहाँ से" },
  "cart.total": { en: "Total", hi: "कुल" },
  "cart.placeOrder": { en: "Place Order", hi: "ऑर्डर करें" },
  "cart.robocallNote": { en: "📞 Shop owner will receive an automated call to confirm your order", hi: "📞 दुकानदार को आपके ऑर्डर की पुष्टि के लिए ऑटोमैटेड कॉल मिलेगी" },
  "cart.loginFirst": { en: "Please login first", hi: "कृपया पहले लॉगिन करें" },
  "cart.orderPlaced": { en: "Order placed! 📞 Robocall initiated to shop owner for confirmation.", hi: "ऑर्डर हो गया! 📞 दुकानदार को पुष्टि के लिए रोबोकॉल शुरू हो गई।" },

  // Orders
  "orders.title": { en: "My Orders", hi: "मेरे ऑर्डर" },
  "orders.subtitle": { en: "Track all your orders in one place", hi: "अपने सभी ऑर्डर एक जगह ट्रैक करें" },
  "orders.pending": { en: "Pending", hi: "लंबित" },
  "orders.approved": { en: "Approved", hi: "स्वीकृत" },
  "orders.completed": { en: "Completed", hi: "पूर्ण" },
  "orders.denied": { en: "Denied", hi: "अस्वीकृत" },
  "orders.noOrders": { en: "No {status} orders", hi: "कोई {status} ऑर्डर नहीं" },

  // Shop Page
  "shop.notFound": { en: "Shop not found", hi: "दुकान नहीं मिली" },
  "shop.products": { en: "Products", hi: "प्रोडक्ट्स" },
  "shop.addToCart": { en: "Add to Cart", hi: "कार्ट में डालें" },
  "shop.inStock": { en: "in stock", hi: "स्टॉक में" },
  "shop.outOfStock": { en: "Out of stock", hi: "स्टॉक में नहीं" },
  "shop.onlyLeft": { en: "Only {n} left!", hi: "सिर्फ़ {n} बचे!" },
  "shop.loginToAdd": { en: "Please login to add items to cart", hi: "कार्ट में डालने के लिए लॉगिन करें" },
  "shop.onlyCustomers": { en: "Only customers can add items to cart", hi: "सिर्फ़ ग्राहक कार्ट में सामान डाल सकते हैं" },
  "shop.addedToCart": { en: "added to cart", hi: "कार्ट में जोड़ा गया" },

  // Help
  "help.title": { en: "Help & Complaints", hi: "सहायता और शिकायतें" },
  "help.subtitle": { en: "Tell us about your issue and we'll get back to you", hi: "हमें अपनी समस्या बताएं, हम जल्द जवाब देंगे" },
  "help.received": { en: "We've received your message", hi: "हमें आपका संदेश मिल गया है" },
  "help.yourEmail": { en: "Your Email", hi: "आपका ईमेल" },
  "help.yourMessage": { en: "Your Message", hi: "आपका संदेश" },
  "help.messagePlaceholder": { en: "Describe your issue or complaint...", hi: "अपनी समस्या या शिकायत बताएं..." },
  "help.submit": { en: "Submit Complaint", hi: "शिकायत दर्ज करें" },
  "help.submitting": { en: "Submitting...", hi: "भेज रहे हैं..." },
  "help.loginRequired": { en: "Please login to submit a complaint.", hi: "शिकायत दर्ज करने के लिए लॉगिन करें।" },
  "help.loginFirst": { en: "Please login to submit a complaint", hi: "शिकायत दर्ज करने के लिए लॉगिन करें" },
  "help.fillAll": { en: "Please fill all fields", hi: "कृपया सभी फ़ील्ड भरें" },
  "help.failed": { en: "Failed to submit complaint", hi: "शिकायत दर्ज करने में विफल" },
  "help.success": { en: "Complaint submitted successfully!", hi: "शिकायत सफलतापूर्वक दर्ज हो गई!" },
  "help.submitted": { en: "Your complaint has been submitted. Our team will review and respond soon.", hi: "आपकी शिकायत दर्ज हो गई है। हमारी टीम जल्द समीक्षा करेगी।" },
  "help.submitAnother": { en: "Submit Another", hi: "एक और शिकायत दर्ज करें" },

  // Forgot Password
  "forgot.title": { en: "Forgot Password", hi: "पासवर्ड भूल गए" },
  "forgot.subtitle": { en: "Enter your email to receive a reset link", hi: "रीसेट लिंक प्राप्त करने के लिए ईमेल दर्ज करें" },
  "forgot.checkInbox": { en: "Check your inbox", hi: "अपना इनबॉक्स चेक करें" },
  "forgot.emailLabel": { en: "Email Address", hi: "ईमेल पता" },
  "forgot.sendLink": { en: "Send Reset Link", hi: "रीसेट लिंक भेजें" },
  "forgot.sending": { en: "Sending...", hi: "भेज रहे हैं..." },
  "forgot.sentMsg": { en: "We've sent a password reset link to", hi: "हमने पासवर्ड रीसेट लिंक भेजा है" },
  "forgot.checkEmail": { en: "Please check your email and click the link to reset your password.", hi: "कृपया अपना ईमेल चेक करें और पासवर्ड रीसेट करने के लिए लिंक पर क्लिक करें।" },
  "forgot.sendAgain": { en: "Send again", hi: "फिर से भेजें" },
  "forgot.backToLogin": { en: "Back to login", hi: "लॉगिन पर वापस जाएं" },
  "forgot.success": { en: "Password reset email sent!", hi: "पासवर्ड रीसेट ईमेल भेजा गया!" },
  "forgot.failed": { en: "Failed to send reset email", hi: "रीसेट ईमेल भेजने में विफल" },

  // Reset Password
  "reset.title": { en: "Reset Password", hi: "पासवर्ड रीसेट करें" },
  "reset.subtitle": { en: "Enter your new password", hi: "अपना नया पासवर्ड दर्ज करें" },
  "reset.newPassword": { en: "New Password", hi: "नया पासवर्ड" },
  "reset.confirmPassword": { en: "Confirm Password", hi: "पासवर्ड कन्फ़र्म करें" },
  "reset.update": { en: "Update Password", hi: "पासवर्ड अपडेट करें" },
  "reset.updating": { en: "Updating...", hi: "अपडेट हो रहा है..." },
  "reset.success": { en: "Password updated successfully!", hi: "पासवर्ड सफलतापूर्वक अपडेट हो गया!" },
  "reset.redirecting": { en: "Password updated! Redirecting to login...", hi: "पासवर्ड अपडेट हो गया! लॉगिन पर भेज रहे हैं..." },
  "reset.failed": { en: "Failed to update password", hi: "पासवर्ड अपडेट करने में विफल" },
  "reset.mismatch": { en: "Passwords do not match", hi: "पासवर्ड मेल नहीं खाते" },
  "reset.minLength": { en: "Password must be at least 6 characters", hi: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए" },

  // Register Shop
  "register.title": { en: "Register Your Shop", hi: "अपनी दुकान रजिस्टर करें" },
  "register.step1": { en: "Step 1: Your account details", hi: "चरण 1: आपकी अकाउंट जानकारी" },
  "register.step2": { en: "Step 2: Shop details", hi: "चरण 2: दुकान की जानकारी" },
  "register.ownerDetails": { en: "Owner Details", hi: "मालिक की जानकारी" },
  "register.shopDetails": { en: "Shop Details", hi: "दुकान की जानकारी" },
  "register.fullName": { en: "Full Name", hi: "पूरा नाम" },
  "register.email": { en: "Email", hi: "ईमेल" },
  "register.phone": { en: "Phone", hi: "फ़ोन" },
  "register.username": { en: "Username", hi: "यूज़रनेम" },
  "register.password": { en: "Password", hi: "पासवर्ड" },
  "register.next": { en: "Next → Shop Details", hi: "अगला → दुकान की जानकारी" },
  "register.shopName": { en: "Shop Name", hi: "दुकान का नाम" },
  "register.category": { en: "Category", hi: "श्रेणी" },
  "register.selectCategory": { en: "Select category", hi: "श्रेणी चुनें" },
  "register.description": { en: "Description", hi: "विवरण" },
  "register.descPlaceholder": { en: "Tell customers about your shop", hi: "ग्राहकों को अपनी दुकान के बारे में बताएं" },
  "register.location": { en: "Location", hi: "स्थान" },
  "register.city": { en: "City", hi: "शहर" },
  "register.pincode": { en: "Pincode", hi: "पिनकोड" },
  "register.area": { en: "Area / Locality", hi: "क्षेत्र / मोहल्ला" },
  "register.shopPhone": { en: "Shop Phone", hi: "दुकान का फ़ोन" },
  "register.shopPhonePlaceholder": { en: "Shop contact number (optional)", hi: "दुकान का नंबर (वैकल्पिक)" },
  "register.back": { en: "← Back", hi: "← वापस" },
  "register.submit": { en: "Register Shop", hi: "दुकान रजिस्टर करें" },
  "register.registering": { en: "Registering...", hi: "रजिस्टर हो रहा है..." },
  "register.haveAccount": { en: "Already have an account?", hi: "पहले से अकाउंट है?" },
  "register.signIn": { en: "Sign in", hi: "साइन इन करें" },
  "register.customerSignup": { en: "Want to sign up as a customer?", hi: "ग्राहक के रूप में साइन अप करना चाहते हैं?" },
  "register.customerLink": { en: "Customer signup", hi: "ग्राहक साइन अप" },
  "register.success": { en: "Shop registered! Awaiting admin approval.", hi: "दुकान रजिस्टर हो गई! एडमिन की मंज़ूरी का इंतज़ार है।" },

  // Shop Login
  "shopLogin.title": { en: "Shopkeeper Login", hi: "दुकानदार लॉगिन" },
  "shopLogin.subtitle": { en: "Sign in to manage your shop", hi: "अपनी दुकान प्रबंधित करने के लिए साइन इन करें" },
  "shopLogin.username": { en: "Username", hi: "यूज़रनेम" },
  "shopLogin.password": { en: "Password", hi: "पासवर्ड" },
  "shopLogin.signIn": { en: "Sign In as Shopkeeper", hi: "दुकानदार के रूप में साइन इन करें" },
  "shopLogin.signingIn": { en: "Signing in...", hi: "साइन इन हो रहा है..." },
  "shopLogin.noShop": { en: "Don't have a shop?", hi: "दुकान नहीं है?" },
  "shopLogin.registerShop": { en: "Register your shop", hi: "अपनी दुकान रजिस्टर करें" },
  "shopLogin.customer": { en: "Customer?", hi: "ग्राहक हैं?" },
  "shopLogin.customerLogin": { en: "Customer login", hi: "ग्राहक लॉगिन" },
  "shopLogin.forgotPassword": { en: "Forgot password?", hi: "पासवर्ड भूल गए?" },
  "shopLogin.notShopkeeper": { en: "This account is not registered as a shopkeeper. Please use the customer login.", hi: "यह अकाउंट दुकानदार के रूप में रजिस्टर नहीं है। कृपया ग्राहक लॉगिन का उपयोग करें।" },
  "shopLogin.usernameNotFound": { en: "Username not found", hi: "यूज़रनेम नहीं मिला" },
  "shopLogin.welcomeBack": { en: "Welcome back, Shopkeeper!", hi: "वापसी पर स्वागत है, दुकानदार!" },

  // Common
  "common.total": { en: "Total", hi: "कुल" },
  "common.shop": { en: "Shop", hi: "दुकान" },
  "common.owner": { en: "Owner", hi: "मालिक" },
  "common.phone": { en: "Phone", hi: "फ़ोन" },
  "common.city": { en: "City", hi: "शहर" },
  "common.area": { en: "Area", hi: "क्षेत्र" },
  "common.description": { en: "Description", hi: "विवरण" },
  "common.category": { en: "Category", hi: "श्रेणी" },
  "common.product": { en: "Product", hi: "प्रोडक्ट" },
  "common.price": { en: "Price", hi: "कीमत" },
  "common.stock": { en: "Stock", hi: "स्टॉक" },
  "common.actions": { en: "Actions", hi: "क्रियाएं" },
  "common.unit": { en: "Unit", hi: "इकाई" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.customer": { en: "Customer", hi: "ग्राहक" },
  "common.admin": { en: "Admin", hi: "एडमिन" },
  "common.showAll": { en: "Show all", hi: "सभी दिखाएं" },
  "common.save": { en: "Save", hi: "सेव करें" },
  "common.edit": { en: "Edit", hi: "एडिट करें" },
  "common.delete": { en: "Delete", hi: "हटाएं" },

  // Dashboard
  "dash.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "dash.products": { en: "Products", hi: "प्रोडक्ट्स" },
  "dash.orders": { en: "Orders", hi: "ऑर्डर" },
  "dash.aiHub": { en: "AI Intelligence", hi: "AI इंटेलिजेंस" },
  "dash.competition": { en: "Competition", hi: "प्रतिस्पर्धा" },
  "dash.reports": { en: "Reports", hi: "रिपोर्ट्स" },
  "dash.logout": { en: "Logout", hi: "लॉगआउट" },
  "dash.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "dash.shopOwner": { en: "Shop Owner", hi: "दुकानदार" },
  "dash.totalProducts": { en: "Total Products", hi: "कुल प्रोडक्ट्स" },
  "dash.todaySales": { en: "Today's Sales", hi: "आज की बिक्री" },
  "dash.ordersToday": { en: "Orders Today", hi: "आज के ऑर्डर" },
  "dash.topProduct": { en: "Top Product", hi: "टॉप प्रोडक्ट" },
  "dash.salesTrend": { en: "Sales Trend", hi: "बिक्री ट्रेंड" },
  "dash.topProductsChart": { en: "Top Products", hi: "टॉप प्रोडक्ट्स" },

  // Dashboard products
  "dashProducts.loading": { en: "Loading products...", hi: "प्रोडक्ट्स लोड हो रहे हैं..." },
  "dashProducts.noShop": { en: "No shop found. Your shop may be awaiting approval.", hi: "कोई दुकान नहीं मिली। आपकी दुकान अभी मंज़ूरी का इंतज़ार कर रही हो सकती है।" },
  "dashProducts.title": { en: "Your Products", hi: "आपके प्रोडक्ट्स" },
  "dashProducts.productsTotal": { en: "{count} products total", hi: "कुल {count} प्रोडक्ट्स" },
  "dashProducts.addProduct": { en: "Add Product", hi: "प्रोडक्ट जोड़ें" },
  "dashProducts.editProduct": { en: "Edit Product", hi: "प्रोडक्ट एडिट करें" },
  "dashProducts.productName": { en: "Product Name", hi: "प्रोडक्ट का नाम" },
  "dashProducts.productNamePlaceholder": { en: "Product name", hi: "प्रोडक्ट का नाम" },
  "dashProducts.categoryPlaceholder": { en: "e.g. Chocolates, Fruits", hi: "जैसे: चॉकलेट, फल" },
  "dashProducts.saving": { en: "Saving...", hi: "सेव हो रहा है..." },
  "dashProducts.updateProduct": { en: "Update Product", hi: "प्रोडक्ट अपडेट करें" },
  "dashProducts.productUpdated": { en: "Product updated", hi: "प्रोडक्ट अपडेट हो गया" },
  "dashProducts.productAdded": { en: "Product added", hi: "प्रोडक्ट जोड़ दिया गया" },
  "dashProducts.deleteConfirm": { en: "Delete this product?", hi: "क्या यह प्रोडक्ट हटाना है?" },
  "dashProducts.productDeleted": { en: "Product deleted", hi: "प्रोडक्ट हटा दिया गया" },
  "dashProducts.outOfStock": { en: "Out of Stock", hi: "स्टॉक खत्म" },
  "dashProducts.lowStock": { en: "Low Stock", hi: "कम स्टॉक" },
  "dashProducts.noProductsFilter": { en: "No products in this filter", hi: "इस फ़िल्टर में कोई प्रोडक्ट नहीं है" },
  "dashProducts.noProductsYet": { en: "No products yet. Add your first product!", hi: "अभी कोई प्रोडक्ट नहीं है। अपना पहला प्रोडक्ट जोड़ें!" },

  // Dashboard orders
  "dashOrders.title": { en: "Orders ({count})", hi: "ऑर्डर ({count})" },
  "dashOrders.approve": { en: "Approve", hi: "स्वीकृत करें" },
  "dashOrders.cancel": { en: "Cancel", hi: "रद्द करें" },
  "dashOrders.partial": { en: "Partial", hi: "आंशिक" },
  "dashOrders.delivered": { en: "Mark Delivered", hi: "डिलीवर मार्क करें" },
  "dashOrders.orderApproved": { en: "Order approved!", hi: "ऑर्डर स्वीकृत हो गया!" },
  "dashOrders.orderCancelled": { en: "Order cancelled.", hi: "ऑर्डर रद्द कर दिया गया।" },
  "dashOrders.orderPartial": { en: "Marked as partial.", hi: "ऑर्डर को आंशिक के रूप में मार्क किया गया।" },
  "dashOrders.orderDelivered": { en: "Order marked as delivered!", hi: "ऑर्डर डिलीवर मार्क किया गया!" },
  "dashOrders.tabActive": { en: "Active", hi: "सक्रिय" },
  "dashOrders.tabCompleted": { en: "Completed", hi: "पूर्ण" },

  // Dashboard competition
  "dashCompetition.title": { en: "Competition Analysis", hi: "प्रतिस्पर्धा विश्लेषण" },
  "dashCompetition.insight1": { en: "Milk sells more at Easy Grab General Store than nearby shops.", hi: "Easy Grab General Store में दूध आसपास की दुकानों से ज़्यादा बिकता है।" },
  "dashCompetition.insight2": { en: "Your Samosa sales dominate the Bidholi, UPES area.", hi: "बिढोली, UPES क्षेत्र में आपके समोसे की बिक्री सबसे आगे है।" },
  "dashCompetition.insight3": { en: "Radhe Confectionary is gaining traction in sweets category.", hi: "मिठाइयों की श्रेणी में Radhe Confectionary की मांग बढ़ रही है।" },
  "dashCompetition.chartTitle": { en: "Product Sales Comparison", hi: "प्रोडक्ट बिक्री तुलना" },
  "dashCompetition.yourShop": { en: "Your Shop", hi: "आपकी दुकान" },
  "dashCompetition.easyGrab": { en: "Easy Grab", hi: "Easy Grab" },
  "dashCompetition.radhe": { en: "Radhe", hi: "Radhe" },

  // Dashboard reports
  "dashReports.title": { en: "Reports", hi: "रिपोर्ट्स" },
  "dashReports.weeklySales": { en: "Weekly Sales Report", hi: "साप्ताहिक बिक्री रिपोर्ट" },
  "dashReports.monthlySales": { en: "Monthly Sales Report", hi: "मासिक बिक्री रिपोर्ट" },
  "dashReports.demandAnalytics": { en: "Demand Analytics Report", hi: "डिमांड एनालिटिक्स रिपोर्ट" },
  "dashReports.period.weekly": { en: "Mar 1-7, 2026", hi: "1-7 मार्च, 2026" },
  "dashReports.period.monthly": { en: "February 2026", hi: "फ़रवरी 2026" },
  "dashReports.period.analytics": { en: "Mar 2026", hi: "मार्च 2026" },

  // AI hub
  "aiHub.title": { en: "AI Intelligence Hub", hi: "AI इंटेलिजेंस हब" },
  "aiHub.subtitle": { en: "All AI insights in one place", hi: "सभी AI इनसाइट्स एक ही जगह" },
  "aiHub.demo": { en: "Using demo data", hi: "डेमो डेटा उपयोग में है" },
  "aiHub.offline": { en: "Offline Mode", hi: "ऑफ़लाइन मोड" },
  "aiHub.connected": { en: "AI Connected", hi: "AI कनेक्टेड" },
  "aiHub.smartInsights": { en: "Smart AI Insights", hi: "स्मार्ट AI इनसाइट्स" },
  "aiHub.loading": { en: "Loading AI...", hi: "AI लोड हो रहा है..." },
  "aiHub.demandLevel": { en: "Demand Level", hi: "डिमांड स्तर" },
  "aiHub.trendingProduct": { en: "Trending Product", hi: "ट्रेंडिंग प्रोडक्ट" },
  "aiHub.stockStatus": { en: "Stock Status", hi: "स्टॉक स्थिति" },
  "aiHub.recommendation": { en: "AI Recommendation", hi: "AI सुझाव" },
  "aiHub.reasoning": { en: "AI Reasoning", hi: "AI तर्क" },
  "aiHub.demandInsights": { en: "Demand Insights", hi: "डिमांड इनसाइट्स" },
  "aiHub.trendingInArea": { en: "Trending in Your Area", hi: "आपके क्षेत्र में ट्रेंडिंग" },
  "aiHub.forecastTitle": { en: "AI Demand Forecast", hi: "AI डिमांड फोरकास्ट" },
  "aiHub.forecastChartTitle": { en: "Samosa — Weekly Demand Forecast", hi: "समोसा — साप्ताहिक डिमांड फोरकास्ट" },
  "aiHub.actual": { en: "Actual", hi: "वास्तविक" },
  "aiHub.predicted": { en: "Predicted", hi: "अनुमानित" },
  "aiHub.units": { en: "units", hi: "यूनिट" },
  "aiHub.confidence": { en: "confidence", hi: "विश्वास" },
  "aiHub.mlAnalytics": { en: "ML Analytics", hi: "ML एनालिटिक्स" },
  "aiHub.live": { en: "Live", hi: "लाइव" },
  "aiHub.trendingProducts": { en: "Trending Products", hi: "ट्रेंडिंग प्रोडक्ट्स" },
  "aiHub.trendingScore": { en: "Trending Score", hi: "ट्रेंडिंग स्कोर" },
  "aiHub.restockRecommended": { en: "Restock Recommended", hi: "दोबारा स्टॉक करने की सलाह" },
  "aiHub.categoryDemand": { en: "Category Demand", hi: "श्रेणी डिमांड" },
  "aiHub.weeklyDemandTrends": { en: "Weekly Demand Trends", hi: "साप्ताहिक डिमांड ट्रेंड्स" },
  "aiHub.demandHigh": { en: "High", hi: "उच्च" },
  "aiHub.recommendationText": { en: "Stock up on cold beverages and snacks. Afternoon rush expected due to hot weather and campus proximity.", hi: "ठंडे पेय और स्नैक्स का स्टॉक बढ़ाएं। गर्म मौसम और कैंपस की नज़दीकी के कारण दोपहर में भीड़ की संभावना है।" },
  "aiHub.stockAlertText": { en: "Low stock alert — restock samosas and cold drinks before 2 PM.", hi: "कम स्टॉक अलर्ट — दोपहर 2 बजे से पहले समोसे और ठंडे पेय का स्टॉक भरें।" },
  "aiHub.explain1": { en: "Hot weather drives 40% more cold beverage sales.", hi: "गर्म मौसम में ठंडे पेय की बिक्री 40% तक बढ़ जाती है।" },
  "aiHub.explain2": { en: "Afternoon time slot historically sees peak footfall.", hi: "इतिहास के अनुसार दोपहर के समय सबसे ज़्यादा ग्राहकी होती है।" },
  "aiHub.explain3": { en: "Current stock of 10 units won't last beyond 3 PM at current rate.", hi: "मौजूदा गति से 10 यूनिट स्टॉक दोपहर 3 बजे के बाद नहीं चलेगा।" },
  "aiHub.explain4": { en: "Campus proximity means student crowd peaks at 1-3 PM.", hi: "कैंपस के पास होने से 1-3 बजे के बीच छात्रों की भीड़ चरम पर रहती है।" },
  "aiHub.areaTrend1": { en: "Milk and Bread are trending near UPES campus this week.", hi: "इस हफ्ते UPES कैंपस के पास दूध और ब्रेड ट्रेंड कर रहे हैं।" },
  "aiHub.areaTrend2": { en: "Samosa demand spike detected near Bidholi Gate — consider stocking extra.", hi: "बिढोली गेट के पास समोसे की मांग बढ़ी है — अतिरिक्त स्टॉक रखें।" },
  "aiHub.areaTrend3": { en: "Coffee demand growing 15% week-over-week around UPES.", hi: "UPES के आसपास कॉफी की मांग हफ्ते-दर-हफ्ते 15% बढ़ रही है।" },
  "aiHub.insight1": { en: "Consistently highest demand near Bidholi Gate", hi: "बिढोली गेट के पास लगातार सबसे अधिक मांग" },
  "aiHub.insight2": { en: "Demand increasing ahead of festival season", hi: "त्योहारों के मौसम से पहले मांग बढ़ रही है" },
  "aiHub.insight3": { en: "Steady weekend demand", hi: "वीकेंड पर स्थिर मांग" },
  "aiHub.insight4": { en: "Trending in your area this week", hi: "इस हफ्ते आपके क्षेत्र में ट्रेंड कर रहा है" },

  // Generic statuses and roles
  "status.pending": { en: "Pending", hi: "लंबित" },
  "status.confirmed": { en: "Confirmed", hi: "स्वीकृत" },
  "status.cancelled": { en: "Cancelled", hi: "रद्द" },
  "status.partial": { en: "Partial", hi: "आंशिक" },
  
  "status.open": { en: "Open", hi: "खुला" },
  "status.resolved": { en: "Resolved", hi: "सुलझा" },
  "status.closed": { en: "Closed", hi: "बंद" },
  "status.initiated": { en: "Initiated", hi: "शुरू" },
  "status.completed": { en: "Completed", hi: "पूरा" },
  "status.missed": { en: "Missed", hi: "मिस्ड" },
  "trend.increasing": { en: "increasing", hi: "बढ़ रहा है" },
  "trend.decreasing": { en: "decreasing", hi: "घट रहा है" },
  "trend.stable": { en: "stable", hi: "स्थिर" },
  "role.admin": { en: "admin", hi: "एडमिन" },
  "role.shopowner": { en: "shopowner", hi: "दुकानदार" },
  "role.customer": { en: "customer", hi: "ग्राहक" },

  // Chart labels
  "chart.nextWeek": { en: "Next Week", hi: "अगला सप्ताह" },
  "chart.week1": { en: "Week 1", hi: "सप्ताह 1" },
  "chart.week2": { en: "Week 2", hi: "सप्ताह 2" },
  "chart.week3": { en: "Week 3", hi: "सप्ताह 3" },
  "chart.week4": { en: "Week 4", hi: "सप्ताह 4" },
  "chart.week5": { en: "Week 5", hi: "सप्ताह 5" },
  "chart.week6": { en: "Week 6", hi: "सप्ताह 6" },
  "chart.week7": { en: "Week 7", hi: "सप्ताह 7" },
  "day.mon": { en: "Mon", hi: "सोम" },
  "day.tue": { en: "Tue", hi: "मंगल" },
  "day.wed": { en: "Wed", hi: "बुध" },
  "day.thu": { en: "Thu", hi: "गुरु" },
  "day.fri": { en: "Fri", hi: "शुक्र" },
  "day.sat": { en: "Sat", hi: "शनि" },
  "day.sun": { en: "Sun", hi: "रवि" },

  // Admin Dashboard
  "admin.title": { en: "Admin Panel", hi: "एडमिन पैनल" },
  "admin.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "admin.products": { en: "Products", hi: "प्रोडक्ट्स" },
  "admin.shopRequests": { en: "Shop Requests", hi: "दुकान अनुरोध" },
  "admin.orders": { en: "Orders", hi: "ऑर्डर" },
  "admin.complaints": { en: "Complaints", hi: "शिकायतें" },
  "admin.demandMap": { en: "Demand Map", hi: "डिमांड मैप" },
  "admin.callLogs": { en: "Call Logs", hi: "कॉल लॉग" },
  "admin.totalShops": { en: "Total Shops", hi: "कुल दुकानें" },
  "admin.totalOrders": { en: "Total Orders", hi: "कुल ऑर्डर" },
  "admin.dbProducts": { en: "DB Products", hi: "DB प्रोडक्ट्स" },
  "admin.complaintsCount": { en: "Complaints", hi: "शिकायतें" },
  "admin.addProduct": { en: "Add Product", hi: "प्रोडक्ट जोड़ें" },
  "admin.cancel": { en: "Cancel", hi: "रद्द करें" },
  "admin.newProduct": { en: "New Product", hi: "नया प्रोडक्ट" },
  "admin.productName": { en: "Product Name", hi: "प्रोडक्ट का नाम" },
  "admin.shopId": { en: "Shop ID", hi: "शॉप ID" },
  "admin.categoryLabel": { en: "Category", hi: "श्रेणी" },
  "admin.price": { en: "Price (₹)", hi: "कीमत (₹)" },
  "admin.unit": { en: "Unit", hi: "इकाई" },
  "admin.stock": { en: "Stock", hi: "स्टॉक" },
  "admin.saveProduct": { en: "Save Product", hi: "प्रोडक्ट सेव करें" },
  "admin.noProducts": { en: "No products in database yet. Click \"Add Product\" to start.", hi: "डेटाबेस में अभी कोई प्रोडक्ट नहीं। शुरू करने के लिए \"प्रोडक्ट जोड़ें\" पर क्लिक करें।" },
  "admin.productsInDb": { en: "{count} products in database", hi: "डेटाबेस में {count} प्रोडक्ट्स" },
  "admin.registeredShops": { en: "{count} registered shops in database", hi: "डेटाबेस में {count} रजिस्टर्ड दुकानें" },
  "admin.noShopRequests": { en: "No shop registration requests yet.", hi: "अभी कोई दुकान रजिस्ट्रेशन अनुरोध नहीं।" },
  "admin.approved": { en: "Approved", hi: "स्वीकृत" },
  "admin.pending": { en: "Pending", hi: "लंबित" },
  "admin.complaintsReceived": { en: "{count} complaints received", hi: "{count} शिकायतें प्राप्त" },
  "admin.noComplaints": { en: "No complaints yet.", hi: "अभी कोई शिकायत नहीं।" },
  "admin.resolve": { en: "Resolve", hi: "हल करें" },
  "admin.close": { en: "Close", hi: "बंद करें" },
  "admin.areaDemand": { en: "Area demand overview", hi: "क्षेत्र डिमांड अवलोकन" },
  "admin.top": { en: "Top:", hi: "टॉप:" },
  "admin.totalCalls": { en: "Total Calls", hi: "कुल कॉल" },
  "admin.robocalls": { en: "Robocalls", hi: "रोबोकॉल" },
  "admin.maskedCalls": { en: "Masked Calls", hi: "मास्क्ड कॉल" },
  "admin.save": { en: "Save", hi: "सेव करें" },
  "admin.logout": { en: "Logout", hi: "लॉगआउट" },
  "admin.productRequired": { en: "Product name and shop are required", hi: "प्रोडक्ट का नाम और दुकान आवश्यक हैं" },
  "admin.failedAddProduct": { en: "Failed to add product", hi: "प्रोडक्ट जोड़ने में विफल" },
  "admin.productAddedSuccess": { en: "Product added!", hi: "प्रोडक्ट जोड़ दिया गया!" },
  "admin.failedDelete": { en: "Failed to delete", hi: "हटाने में विफल" },
  "admin.deleted": { en: "Deleted", hi: "हटा दिया गया" },
  "admin.failedUpdateShop": { en: "Failed to update shop", hi: "दुकान अपडेट करने में विफल" },
  "admin.shopUpdated": { en: "Shop updated!", hi: "दुकान अपडेट हो गई!" },
  "admin.failed": { en: "Failed", hi: "विफल" },
  "admin.shopDisapproved": { en: "Shop disapproved", hi: "दुकान की मंज़ूरी हटाई गई" },
  "admin.shopApproved": { en: "Shop approved!", hi: "दुकान स्वीकृत हो गई!" },
  "admin.markedAs": { en: "Marked as {status}", hi: "{status} के रूप में मार्क किया गया" },
  "admin.shopIdPlaceholder": { en: "e.g. s1 or uuid", hi: "जैसे s1 या uuid" },
  "admin.maskedNumber": { en: "Masked #", hi: "मास्क्ड #" },
  "admin.robocallLabel": { en: "Robocall", hi: "रोबोकॉल" },
  "admin.maskedCallLabel": { en: "Masked Call", hi: "मास्क्ड कॉल" },

  // Robocall simulator
  "robocall.incoming": { en: "📞 Incoming Robocall...", hi: "📞 आने वाली रोबोकॉल..." },
  "robocall.speaking": { en: "🔊 Speaking...", hi: "🔊 बोल रहा है..." },
  "robocall.awaiting": { en: "⏳ Awaiting Response", hi: "⏳ जवाब का इंतज़ार" },
  "robocall.ended": { en: "✅ Call Ended", hi: "✅ कॉल समाप्त" },
  "robocall.system": { en: "Automated Order Confirmation System", hi: "ऑटोमेटेड ऑर्डर कन्फर्मेशन सिस्टम" },
  "robocall.voice": { en: "🤖 Automated Voice:", hi: "🤖 ऑटोमेटेड आवाज़:" },
  "robocall.calling": { en: "Calling {number} ({shop})...", hi: "{number} ({shop}) पर कॉल की जा रही है..." },
  "robocall.orderFrom": { en: "Order from {customer}", hi: "{customer} का ऑर्डर" },
  "robocall.selectResponse": { en: "Select response:", hi: "जवाब चुनें:" },
  "robocall.approveOrder": { en: "Approve Order", hi: "ऑर्डर स्वीकृत करें" },
  "robocall.cancelOrder": { en: "Cancel Order", hi: "ऑर्डर रद्द करें" },
  "robocall.itemsUnavailable": { en: "Some Items Unavailable", hi: "कुछ आइटम उपलब्ध नहीं" },
  "robocall.responseRecorded": { en: "Response recorded. Customer notified.", hi: "जवाब दर्ज हो गया। ग्राहक को सूचित कर दिया गया।" },
  "robocall.approvedToast": { en: "Order approved! Customer has been notified.", hi: "ऑर्डर स्वीकृत हो गया! ग्राहक को सूचित कर दिया गया है।" },
  "robocall.cancelledToast": { en: "Order cancelled. Customer has been notified.", hi: "ऑर्डर रद्द कर दिया गया। ग्राहक को सूचित कर दिया गया है।" },
  "robocall.partialToast": { en: "Marked as partial. Customer advised to visit shop.", hi: "ऑर्डर को आंशिक मार्क किया गया। ग्राहक को दुकान आने की सलाह दी गई है।" },

  // MaskedCaller
  "masked.callButton": { en: "Masked Call", hi: "मास्क्ड कॉल" },
  "masked.connecting": { en: "Connecting via masked number {num}...", hi: "मास्क्ड नंबर {num} से कनेक्ट हो रहा है..." },
  "masked.active": { en: "Masked Call Active", hi: "मास्क्ड कॉल चालू" },
  "masked.via": { en: "Via", hi: "द्वारा" },
  "masked.end": { en: "End", hi: "समाप्त" },
  "masked.callEnded": { en: "Call ended. Duration: {duration}", hi: "कॉल समाप्त हुई। अवधि: {duration}" },
  "masked.privacy": { en: "🔒 Neither party can see the other's real phone number.", hi: "🔒 कोई भी पक्ष दूसरे का असली फ़ोन नंबर नहीं देख सकता।" },

  // DashboardInsights (standalone)
  "insights.title": { en: "Demand Insights", hi: "डिमांड इनसाइट्स" },
  "insights.trendingInArea": { en: "Trending in Your Area", hi: "आपके क्षेत्र में ट्रेंडिंग" },

  // DashboardSmartAI (standalone)
  "smartAI.title": { en: "Smart AI Dashboard", hi: "स्मार्ट AI डैशबोर्ड" },
  "smartAI.loading": { en: "Loading Smart AI Insights...", hi: "स्मार्ट AI इनसाइट्स लोड हो रहे हैं..." },
  "smartAI.noData": { en: "No data available", hi: "कोई डेटा उपलब्ध नहीं" },
  "smartAI.retry": { en: "Retry", hi: "पुनः प्रयास करें" },
  "smartAI.connected": { en: "AI Connected", hi: "AI कनेक्टेड" },
  "smartAI.demandLevel": { en: "Demand Level", hi: "डिमांड स्तर" },
  "smartAI.trendingProduct": { en: "Trending Product", hi: "ट्रेंडिंग प्रोडक्ट" },
  "smartAI.stockStatus": { en: "Stock Status", hi: "स्टॉक स्थिति" },
  "smartAI.recommendation": { en: "AI Recommendation", hi: "AI सुझाव" },
  "smartAI.breakdown": { en: "AI Insights Breakdown", hi: "AI इनसाइट्स विवरण" },

  // DashboardAnalytics (standalone)
  "analytics.title": { en: "ML Analytics", hi: "ML एनालिटिक्स" },
  "analytics.live": { en: "Live from ML API", hi: "ML API से लाइव" },
  "analytics.trendingProducts": { en: "Trending Products", hi: "ट्रेंडिंग प्रोडक्ट्स" },
  "analytics.trendingScore": { en: "Trending Score", hi: "ट्रेंडिंग स्कोर" },
  "analytics.confidence": { en: "Confidence", hi: "विश्वास" },
  "analytics.restockRecommended": { en: "Restock Recommended", hi: "दोबारा स्टॉक करने की सलाह" },
  "analytics.categoryDemand": { en: "Category Demand", hi: "श्रेणी डिमांड" },
  "analytics.areaDemand": { en: "Area-Based Demand", hi: "क्षेत्र-आधारित डिमांड" },
  "analytics.weeklyTrends": { en: "Weekly Demand Trends", hi: "साप्ताहिक डिमांड ट्रेंड्स" },
  "analytics.loadingData": { en: "Loading data...", hi: "डेटा लोड हो रहा है..." },
  "analytics.demand": { en: "demand", hi: "डिमांड" },

  // DashboardForecast (standalone)
  "forecast.title": { en: "AI Demand Forecast", hi: "AI डिमांड फोरकास्ट" },
  "forecast.subtitle": { en: "Predictions based on historical sales data", hi: "ऐतिहासिक बिक्री डेटा पर आधारित भविष्यवाणियाँ" },
  "forecast.chartTitle": { en: "Samosa — Weekly Demand Forecast", hi: "समोसा — साप्ताहिक डिमांड फोरकास्ट" },
  "forecast.actual": { en: "Actual", hi: "वास्तविक" },
  "forecast.predicted": { en: "Predicted", hi: "अनुमानित" },
  "forecast.units": { en: "units", hi: "यूनिट" },
  "forecast.confidence": { en: "confidence", hi: "विश्वास" },

  // Navbar profile
  "navbar.user": { en: "User", hi: "उपयोगकर्ता" },

  // Admin shop edit labels
  "admin.shopName": { en: "Shop Name", hi: "दुकान का नाम" },
  "admin.owner": { en: "Owner", hi: "मालिक" },
  "admin.shopCategory": { en: "Category", hi: "श्रेणी" },
  "admin.shopPhone": { en: "Phone", hi: "फ़ोन" },
  "admin.shopCity": { en: "City", hi: "शहर" },
  "admin.shopArea": { en: "Area", hi: "क्षेत्र" },
  "admin.shopPincode": { en: "Pincode", hi: "पिनकोड" },
  "admin.shopDescription": { en: "Description", hi: "विवरण" },

  // Not Found
  "notFound.title": { en: "404", hi: "404" },
  "notFound.message": { en: "Oops! Page not found", hi: "उफ़! पेज नहीं मिला" },
  "notFound.returnHome": { en: "Return to Home", hi: "होम पर वापस जाएं" },
};

export const translations = t;

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  tr: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const tr = (key: string): string => {
    return t[key]?.[lang] || t[key]?.["en"] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  );
}

const translateFromMap = (value: string, map: Record<string, string>, tr: (key: string) => string) => {
  return map[value] ? tr(map[value]) : value;
};

export const translateOrderStatus = (status: string, tr: (key: string) => string) =>
  translateFromMap(status, {
    Pending: "status.pending",
    Confirmed: "status.confirmed",
    Cancelled: "status.cancelled",
    Partial: "status.partial",
    Completed: "status.completed",
  }, tr);

export const translateComplaintStatus = (status: string, tr: (key: string) => string) =>
  translateFromMap(status, {
    open: "status.open",
    resolved: "status.resolved",
    closed: "status.closed",
  }, tr);

export const translateCallStatus = (status: string, tr: (key: string) => string) =>
  translateFromMap(status, {
    initiated: "status.initiated",
    completed: "status.completed",
    missed: "status.missed",
  }, tr);

export const translateTrendDirection = (status: string, tr: (key: string) => string) =>
  translateFromMap(status, {
    increasing: "trend.increasing",
    decreasing: "trend.decreasing",
    stable: "trend.stable",
    up: "trend.increasing",
    down: "trend.decreasing",
  }, tr);

export const translateRole = (role: string, tr: (key: string) => string) =>
  translateFromMap(role, {
    admin: "role.admin",
    shopowner: "role.shopowner",
    customer: "role.customer",
  }, tr);

// Call language translations
export const callLangLabels: Record<string, Record<Lang, string>> = {
  "callLang.title": { en: "📞 Call Language", hi: "📞 कॉल भाषा" },
  "callLang.desc": { en: "Robocall announcements will be in", hi: "रोबोकॉल की घोषणा इस भाषा में होगी" },
  "callLang.english": { en: "English", hi: "अंग्रेज़ी" },
  "callLang.hindi": { en: "Hindi", hi: "हिंदी" },
};

export const useLanguage = () => useContext(LangContext);
