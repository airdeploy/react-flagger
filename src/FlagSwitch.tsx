import React from 'react'
import {Flag} from './Flag'

interface IFlagSwitch {
  flag: string
  children?: JSX.Element[]
  entity?: object
}

export class FlagSwitch extends React.Component<IFlagSwitch> {
  public render() {
    return React.Children.map(this.props.children, (child: any) => {
      if (child.type.prototype instanceof Flag || child.type === Flag) {
        const props: any = {}
        if (!child.props.flag) {
          props.flag = this.props.flag
        }
        if (!child.props.entity && this.props.entity) {
          props.entity = this.props.entity
        }
        return React.cloneElement(child, props, child.props.children)
      } else {
        return child
      }
    })
  }
}
