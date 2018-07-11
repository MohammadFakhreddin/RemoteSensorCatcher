import * as React from 'react'
import {
  PanResponder, Text, View
} from 'react-native'
import * as SocketIo from 'socket.io-client'
import { PacketFactory } from '../../models/PacketFactory'
import { ClientRule, Events, Urls } from '../../NetworkConstants'
import { Styles } from './MainSceneStyles'

interface IMainSceneState {
  status: string,
  touchEvent: string
}

export class MainScene extends React.Component<null, IMainSceneState> {
  public static navigationOptions = {
    header: (
      <View style={Styles.toolbarContainer} />
    )
  }
  public state: IMainSceneState = {
    status: 'Unknown',
    touchEvent: ''
  }
  private socket: SocketIOClient.Socket = null
  private isConnected: boolean = false
  public constructor(props) {
    super(props)
  }
  public componentDidMount(): void {
    this.socket = SocketIo(Urls.baseUrl, {
      transports: ['websocket']
    })
    this.setState({
      status: 'Trying to connect'
    })
    this.socket.on(Events.On.connectError, (data) => {
      this.setState({
        status: 'Connection failed'
      })
      // tslint:disable-next-line:no-console
      console.log('Connection failed:\n' + data)
    })
    this.socket.on(Events.On.connect, this.onSocketConnect)
    this.socket.connect()
  }
  public render(): JSX.Element {
    const touchGesture = this.generatePanResponder(this)
    return (
      <View
        {...touchGesture.panHandlers}
        style={Styles.root}
      >
        <Text>
          {
            this.state.status
          }
        </Text>
        <Text>
          {
            this.state.touchEvent
          }
        </Text>
      </View>
    )
  }
  private generatePanResponder = (self: MainScene) => {
    return PanResponder.create({
        onStartShouldSetPanResponder() {
            return true
        },
        onStartShouldSetPanResponderCapture() {
            return true
        },
        onMoveShouldSetPanResponder() {
            return true
        },
        onMoveShouldSetPanResponderCapture() {
            return true
        },
        onPanResponderTerminationRequest() {
            return true
        },
        onPanResponderGrant: (e, gestureState) => {
          const locationX = e.nativeEvent.locationX
          const locationY = e.nativeEvent.locationY
          this.setState({
            touchEvent : `locationX:${locationX},
locationY:${locationY}`
          })
          if (this.isConnected) {
            this.socket.emit(Events.Emit.touchEvent, PacketFactory.generatePacketObject([
              locationX,
              locationY
            ]))
          }
        }
    })
  }
  private onSocketConnect = () => {
    this.isConnected = true
    this.setState({
      status: 'Connection successfully'
    })
    this.socket.on(Events.On.readyReceived, () => {
      if (isReadyMessageInterval != null) {
        clearInterval(isReadyMessageInterval)
      }
      this.socket.on(Events.On.disconnect, this.onSocketDisconnect)
    })
    const isReadyMessageInterval = setInterval(() => {
      this.socket.emit(Events.Emit.isReady, PacketFactory.generatePacketObject([ClientRule]))
    }, 1000)
  }
  private onSocketDisconnect = () => {
    this.setState({
      status: 'Socket disconnected'
    })
    // TODO
    this.isConnected = false
  }
}
