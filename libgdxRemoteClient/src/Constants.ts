import {
  Dimensions,
  Platform
} from 'react-native'

const window = Dimensions.get('window')

export const  EnvironmentVariables = {
  isDev: __DEV__,
  isTest: false,
  isOfflineMode: false,
  isIos: Platform.OS === 'ios',
  isIPhoneX: window.width === 812 || window.height === 812
}

export const Fonts =  {
  oswald_regular: 'Oswald-Regular',
  roboto_regular: 'Roboto-Regular',
  iran_sans_regular: 'IRANSansMobile',
  yekan_regular: 'BYekan'
}

export const Colors = {
  backgroundColor: 'rgba(255,255,255,1)'
}
