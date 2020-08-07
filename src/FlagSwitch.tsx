import React from 'react'
import {Flag} from './Flag'
import {entityCtx} from './FlagProvider'

interface IFlagSwitch {
  flag: string
  children?: JSX.Element[]
  entity?: object
}

export class FlagSwitch extends React.Component<IFlagSwitch> {
  public render() {
    return (
      <entityCtx.Consumer>
        {(entity) => {
          return React.Children.map(this.props.children, (child: any) => {
            if (child.type.prototype instanceof Flag || child.type === Flag) {
              const props: any = {}
              if (!child.props.flag) {
                props.flag = this.props.flag
              }
              if (!child.props.entity && (this.props.entity || entity)) {
                props.entity = this.props.entity || entity
              }
              return React.cloneElement(child, props, child.props.children)
            } else {
              return child
            }
          })
        }}
      </entityCtx.Consumer>
    )
  }
}
