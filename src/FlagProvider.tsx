import {Flagger, IEntity} from 'flagger'
import React from 'react'

interface IFlagProvider {
  apiKey: string
  sourceURL?: string
  backupSourceURL?: string
  sseURL?: string
  ingestionURL?: string
  logLevel?: 'warn' | 'warning' | 'deb' | 'debug' | 'err' | 'error'
  entity: IEntity
  loadingView: JSX.Element
}

interface IFlagProviderState {
  loading: boolean
}

export class FlagProvider extends React.Component<
  IFlagProvider,
  IFlagProviderState
> {
  public static defaultProps = {
    children: null,
    loadingView: null,
  }

  constructor(props: IFlagProvider) {
    super(props)

    this.state = {
      loading: !Flagger.isConfigured(),
    }
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
    if (this.props.entity) {
      Flagger.setEntity(this.props.entity)
    }
  }

  public async componentDidMount() {
    if (Flagger.isConfigured()) {
      this.setState({loading: false})
      return
    }

    await this.configure()
    this.setState({loading: false})
  }

  public render() {
    return this.state.loading ? this.props.loadingView : this.props.children
  }
}

export function withFlag(
  WrappedComponent: React.ElementType,
  ...flagNames: string[]
) {
  // tslint:disable-next-line: max-classes-per-file
  return class FlaggedComponent extends React.Component<{entity?: IEntity}> {
    state = {
      flags: this.reduceFlagNames(),
    }

    public updateFlags = () => {
      this.setState({flags: this.reduceFlagNames()})
    }

    public componentDidMount() {
      Flagger.addFlaggerConfigUpdateListener(this.updateFlags)
    }

    public componentWillUnmount() {
      Flagger.removeFlaggerConfigUpdateListener(this.updateFlags)
    }

    public reduceFlagNames() {
      return flagNames.reduce((reducedFlags, flagName) => {
        const enabled = Flagger.isEnabled(flagName, this.props.entity)
        const isSampled = Flagger.isSampled(flagName, this.props.entity)
        const variation = Flagger.getVariation(flagName, this.props.entity)
        const payload = Flagger.getPayload(flagName, this.props.entity)

        return {
          ...reducedFlags,
          [flagName]: {
            enabled,
            isSampled,
            variation,
            payload,
          },
        }
      }, {})
    }

    public render() {
      if (flagNames.length === 0) {
        // tslint:disable-next-line: no-console
        console.warn('withFlag did not receive a valid flag name')
        return <WrappedComponent flags={{}} {...this.props} />
      }
      return <WrappedComponent flags={this.state.flags} {...this.props} />
    }
  }
}
