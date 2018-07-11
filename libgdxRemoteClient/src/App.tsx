import * as React from 'react'
import {
  EnvironmentVariables
} from './Constants'
EnvironmentVariables.isOfflineMode = false
EnvironmentVariables.isTest = false
import {
  I18nManager
} from 'react-native'
import { SceneParams } from './SceneParams'
import {
  MainScene
} from './scenes/main_scene/MainScene'
import {
  Navigation as flux,
  transitionConfig
} from './utils/NavigationActions'

const Actions = flux.Actions
const Router = flux.Router
const Scene = flux.Scene
const Stack = flux.Stack
I18nManager.allowRTL(false)
I18nManager.forceRTL(false)

const scenes = Actions.create(
  <Stack
    key='root'
    transitionConfig={transitionConfig}
  >
    <Scene
      key={SceneParams.mainScene.name}
      component={MainScene}
    />
  </Stack>
)

export default class App extends React.Component {
  public render() {
    return (
      <Router
        scenes={scenes}
      />
    )
  }
}
