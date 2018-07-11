import {
  Dimensions as NativeDimension
} from 'react-native'

export const deviceWindow = NativeDimension.get('window')
const targetDeviceWidth = 360
const targetDeviceHeight = 592
const targetIosDeviceWidth = 375
const targetIosDeviceHeight = 667
const scaleX = deviceWindow.width / targetDeviceWidth
const scaleY = deviceWindow.height / targetDeviceHeight
const iosScaleX = deviceWindow.width / targetIosDeviceWidth
const iosScaleY = deviceWindow.height / targetIosDeviceHeight

export const Dimension = {
  deviceWidth: deviceWindow.width,
  deviceHeight: deviceWindow.height,
  scaleX,
  scaleY,
  iosScaleX,
  iosScaleY
}
