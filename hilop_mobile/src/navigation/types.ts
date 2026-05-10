
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string };
  CategoryProducts: { categoryId: string; categoryName: string };
  AllProducts: { title: string; type: string };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  ProductDetail: { productId: string };
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  Addresses: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};