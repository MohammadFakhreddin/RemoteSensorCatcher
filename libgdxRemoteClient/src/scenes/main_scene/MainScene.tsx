import * as React from 'react'
import {
  PanResponder,
  PermissionsAndroid,
  Text,
  View
} from 'react-native'
import {Accelerometer} from 'react-native-sensors'
import * as SocketIo from 'socket.io-client'
import { EnvironmentVariables } from '../../Constants'
import { PacketFactory } from '../../models/PacketFactory'
import { Accuracy, ClientRule, Events, Urls } from '../../NetworkConstants'
import { Styles } from './MainSceneStyles'

interface IMainSceneState {
  status: string,
  touchEvent: string,
  accelerometerEvent: string,
  geoLocationEvent: string
}

export class MainScene extends React.Component<null, IMainSceneState> {
  public static navigationOptions = {
    header: (
      <View style={Styles.toolbarContainer} />
    )
  }
  public state: IMainSceneState = {
    status: 'Unknown',
    touchEvent: 'touchEvent:Unknown',
    accelerometerEvent: 'accelerometerEvent:Unknown',
    geoLocationEvent: 'geoLocation:Unknown'
  }
  private socket: SocketIOClient.Socket = null
  private isConnected: boolean = false
  private geoLocationWatchId = null
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
    })
    this.socket.on(Events.On.connect, this.onSocketConnect)
    this.socket.connect()
    this.setupAccelerometer()
    this.setupGeoLocation()
  }
  public componentWillUnmount() {
    if (this.isConnected) {
      this.socket.disconnect()
    }
    if (this.geoLocationWatchId != null) {
      navigator.geolocation.clearWatch(this.geoLocationWatchId)
    }
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
        <Text>
          {
            this.state.accelerometerEvent
          }
        </Text>
        <Text>
          {
            this.state.geoLocationEvent
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
              locationX * Accuracy,
              locationY * Accuracy
            ]))
          }
        }
    })
  }
  private setupGeoLocation() {
    return new Promise(async (resolve, reject) => {
      if (EnvironmentVariables.isIos) {
        resolve()
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve()
        } else {
          reject('Getting permission failed')
        }
      }
    }).then(() => {
      if (this.geoLocationWatchId != null) {
        navigator.geolocation.clearWatch(this.geoLocationWatchId)
      }
      navigator.geolocation.getCurrentPosition(this.onGeoLocationDataIsReady)
      this.geoLocationWatchId = navigator.geolocation.watchPosition(
        this.onGeoLocationDataIsReady,
        this.onGeoLocationError
      )
    }).catch((exception) => {
      this.setState({
        geoLocationEvent: exception
      })
    })
  }
  private onGeoLocationDataIsReady = (data) => {
    const accuracy: number = data.coords.accuracy
    const altitude: number = data.coords.altitude
    const heading: number = data.coords.heading
    const latitude: number = data.coords.latitude
    const longitude: number = data.coords.longitude
    const speed: number = data.coords.speed
    this.setState({
      geoLocationEvent: `accuracy:${accuracy},altitude:${altitude},heading:${heading}
latitude:${latitude},longitude:${longitude},speed:${speed}`
    })
    if (this.isConnected) {
      this.socket.emit(Events.Emit.geoLocation, PacketFactory.generatePacketObject([
        accuracy * Accuracy,
        altitude * Accuracy,
        heading * Accuracy,
        latitude * Accuracy,
        longitude * Accuracy,
        speed * Accuracy
      ]))
    }
  }
  private onGeoLocationError = (error) => {
    this.setState({
      geoLocationEvent: `${error.code},${error.message}`
    })
  }
  private onSocketConnect = () => {
    this.setState({
      status: 'Connection successfully'
    })
    this.socket.on(Events.On.readyReceived, () => {
      this.isConnected = true
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
    this.isConnected = false
  }
  private setupAccelerometer() {
    return new Promise(async () => {
      try {
        const observable = await new Accelerometer({
          updateInterval: 100
        })
        observable.subscribe(({x, y, z}) => {
          this.setState({
            accelerometerEvent: `Accelerometer=>
x:${x}
y:${y}
z:${z}`
          })
          if (this.isConnected) {
            this.socket.emit(Events.Emit.accelerometerEvent, PacketFactory.generatePacketObject([
              x * Accuracy,
              y * Accuracy,
              z * Accuracy
            ]))
          }
        })
      } catch (exception) {
        this.setState({
          status: `Accelerometer exception:
  ${JSON.stringify(exception)}`
        })
      }
    })
  }
}
