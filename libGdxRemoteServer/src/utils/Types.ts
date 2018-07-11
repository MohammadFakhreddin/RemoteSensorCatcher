export interface IResponseData  {
  statusCode: number,
  res?: any
}

export type ErrResCallback = (err: Error, res: any) => void

export type OnPromiseFulfilled = (data: IResponseData) => void

export type OnPromiseRejected = (error: string) => void

export type ICallback = (err: any, res: any) => void

export interface ITokenData {
  id: string,
  isEmail?: boolean,
  canChangePassword?: boolean,
  isForgotPasswordMode?: boolean
}

export interface ITokenObj {
  exp: number,
  data: ITokenData,
  accessType: number,
  iat: number
}

export interface IReq {
  headers: any,
  body: any,
  tokenData: ITokenData
}
