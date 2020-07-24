import {Flagger, IEntity, Logger} from 'flagger'
import React from 'react'

const log = new Logger('react/Flag')

interface IFlag {
  flag?: string
  case: string
  children?: React.ReactNode
  entity?: IEntity
}

export class Flag extends React.Component<IFlag> {
  public static defaultProps = {
    children: null,
  }

  public componentDidMount() {
    Flagger.addFlaggerConfigUpdateListener(this.handleChange)
  }
  public componentWillUnmount() {
    Flagger.removeFlaggerConfigUpdateListener(this.handleChange)
  }

  public render() {
    if (!this.props.flag) {
      log.warn('<Flag> component missing flag name')
      return null
    }
    const variation = Flagger.getVariation(this.props.flag, this.props.entity)
    if (variation !== this.props.case) {
      return null
    }
    return this.props.children
  }

  private handleChange = () => {
    this.forceUpdate()
  }
}
