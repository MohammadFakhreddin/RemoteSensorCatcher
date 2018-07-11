import {
  Animated,
  Easing
} from 'react-native'
import {
  EnvironmentVariables
} from '../Constants'

export type EventCallback = (type: ActionTypes, targetScene: string, params?: any) => void

export interface IValidActions {
  pop: () => void
  push: (name: string, params?: any) => void
  popTo: (name: string, params?: any) => void
  replace: (name: string, params?: any) => void,
  setEventCallback: (eventCallback: EventCallback) => void,
  reset: (name: string) => void
}

export enum ActionTypes {
  pop,
  push,
  popTo,
  replace,
  reset
}

export const transitionDuration = 300

export const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: transitionDuration,
      easing: Easing.out(Easing.quad),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: (sceneProps) => {
      const { position, scene, layout } = sceneProps
      switch (scene.route.routeName) {
        default:
          const index = scene.index
          const inputRange = [index - 1, index, index + 1]
          const width = layout.initWidth
          const outputRange = [width * +1, 0, width * -1]
          const opacity = position.interpolate({
            inputRange: ([
              index - 1,
              index - 0.99,
              index,
              index + 0.99,
              index + 1
            ]),
            outputRange: ([0, 1, 1, 0.85, 0])
          })
          const translateY = 0
          const translateX = position.interpolate({
            inputRange,
            outputRange
          })
          return {
            opacity,
            transform: [{ translateX }, { translateY }]
          }
      }
    }
  }
}

export const justOpacityTransitionConfig = () => {
  return {
    transitionSpec: {
      duration: transitionDuration,
      easing: Easing.out(Easing.quad),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: (sceneProps) => {
      const { position, scene } = sceneProps
      const thisSceneIndex = scene.index
      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1]
      })
      return { opacity }
    }
  }
}

class ActionsManager implements IValidActions {
  private eventCallback: EventCallback
  // Call this method only from test modules
  public setEventCallback(eventCallback: EventCallback) {
    this.eventCallback = eventCallback
  }
  public pop = (): void => {
    if (this.eventCallback != null) {
      this.eventCallback(ActionTypes.pop, '', '')
    }
    if (EnvironmentVariables.isTest) {return}
    Navigation.Actions.pop()
  }
  public push = (name: string, params?: any): void => {
    if (this.eventCallback != null) {
      this.eventCallback(ActionTypes.push, name, params)
    }
    if (EnvironmentVariables.isTest) {return}
    Navigation.Actions.push(name, {
      ...params
    })
  }
  public popTo = (name: string): void => {
    if (this.eventCallback != null) {
      this.eventCallback(ActionTypes.popTo, name)
    }
    if (EnvironmentVariables.isTest) {return}
    Navigation.Actions.popTo(name)
  }
  public replace = (name: string, params?: any): void => {
    if (this.eventCallback != null) {
      this.eventCallback(ActionTypes.popTo, name, params)
    }
    if (EnvironmentVariables.isTest) {return}
    Navigation.Actions.replace(name, params)
  }
  public reset = (name: string): void => {
    if (this.eventCallback != null) {
      this.eventCallback(ActionTypes.reset, name)
    }
    if (EnvironmentVariables.isTest) {return}
    Navigation.Actions.reset(name)
  }
  public showMissingParameterErrorAndPop = (message: string): void => {
    if (EnvironmentVariables.isDev) {
      // tslint:disable-next-line:no-console
      console.error(message)
    }
    this.pop()
  }
  public refresh = (): void => {
    Navigation.Actions.refresh()
  }
}

export const NavigationActions = new ActionsManager()
export const Navigation = (EnvironmentVariables.isTest) ? {} : require('react-native-router-flux')
