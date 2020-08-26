import {Flagger} from 'flagger'
import {IEntity, IFlaggerConfiguration} from 'flagger/types/Types'
import React from 'react'

import {flaggerCtx, IFlaggerCtx} from './contexts'

export type IFlagProviderProps = {
  apiKey: string
  sourceURL?: string
  backupSourceURL?: string
  sseURL?: string
  ingestionURL?: string
  logLevel?: 'warn' | 'warning' | 'deb' | 'debug' | 'err' | 'error'
  entity?: IEntity
  loadingView: JSX.Element
} & (
  | {
      loadingView: JSX.Element
      children: React.ReactNode
    }
  | {
      children: (props: IFlaggerCtx) => React.ReactNode
    }
)

interface IFlagProviderState {
  loading: boolean
  entity?: IEntity
  config?: IFlaggerConfiguration
  getVariation: (flag: string, entity?: IEntity) => string
  getFlagDetails: (
    flag: string,
    entity?: IEntity
  ) => {variation: string; enabled: boolean; isSampled: boolean; payload: any}
}

export class FlagProvider extends React.PureComponent<
  IFlagProviderProps,
  IFlagProviderState
> {
  unmounted = true
  static getDerivedStateFromProps(
    nextProps: IFlagProviderProps,
    prevState: IFlagProviderState
  ) {
    return {
      ...prevState,
      entity: nextProps.entity,
    }
  }

  public static defaultProps = {
    children: null,
    loadingView: null,
  }

  state = {
    loading: !Flagger.isConfigured(),
    entity: this.props.entity,
    getVariation: (flag: string, entity?: IEntity) =>
      Flagger.getVariation(flag, entity || this.props.entity),
    getFlagDetails: (flag: string, entity?: IEntity) => ({
      variation: Flagger.getVariation(flag, entity || this.props.entity),
      enabled: Flagger.isEnabled(flag, entity || this.props.entity),
      isSampled: Flagger.isSampled(flag, entity || this.props.entity),
      payload: Flagger.getPayload(flag, entity || this.props.entity),
    }),
  }

  public async configure() {
    await Flagger.init({
      apiKey: this.props.apiKey,
      sourceURL: this.props.sourceURL,
      backupSourceURL: this.props.backupSourceURL,
      sseURL: this.props.sseURL,
      ingestionURL: this.props.ingestionURL,
      logLevel: this.props.logLevel,
      sdkInfo: {
        name: 'react',
        version: '__VERSION__',
      },
    })
  }

  protected onFlaggerConfigUpdate = (config: IFlaggerConfiguration) => {
    this.setState({
      loading: false,
      config,
    })
  }

  public async componentDidMount() {
    this.unmounted = false
    Flagger.addFlaggerConfigUpdateListener(this.onFlaggerConfigUpdate)
    if (Flagger.isConfigured()) {
      this.setState((s) => ({...s, loading: false}))
      return
    }

    await this.configure()
    if (!this.unmounted) {
      this.setState((s) => ({...s, loading: false}))
    }
  }

  public componentWillUnmount() {
    this.unmounted = true
    Flagger.removeFlaggerConfigUpdateListener(this.onFlaggerConfigUpdate)
  }

  public render() {
    if (typeof this.props.children === 'function') {
      return (
        <flaggerCtx.Provider value={this.state}>
          {this.props.children(this.state)}
        </flaggerCtx.Provider>
      )
    }
    return (
      <flaggerCtx.Provider value={this.state}>
        {this.state.loading ? this.props.loadingView : this.props.children}
      </flaggerCtx.Provider>
    )
  }
}
