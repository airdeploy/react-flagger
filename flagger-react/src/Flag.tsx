import {IEntity, Logger} from 'flagger'
import React from 'react'

import {FlagSwitch} from './FlagSwitch'
import {Variation} from './Variation'

const log = new Logger('react/Flag')

export interface IFlagProps {
  flag?: string
  case: string
  children?:
    | ((props: {case: string; flag?: string}) => React.ReactNode)
    | React.ReactNode
  component?: React.ComponentType<{
    case: string
    flag?: string
  }>
  entity?: IEntity
  isSwitchChild?: boolean
}

export const Flag = React.memo(
  ({
    component: Component,
    isSwitchChild,
    children,
    case: variation,
    flag,
    entity,
  }: IFlagProps) => {
    if (!isSwitchChild) {
      if (!flag) {
        log.warn(
          'Prop "flag" is empty, but <Flag> is not a child of <FlagSwitch>'
        )
        return null
      }
      return (
        <FlagSwitch flag={flag} entity={entity}>
          <Variation
            case={variation}
            component={Component}
            children={children}
          />
        </FlagSwitch>
      )
    }
    if (!flag) {
      log.warn(
        'Prop "flag" is empty. <Flag> should be used with non-empty "flag" or as a child of <FlagSwitch>'
      )
    }
    if (Component) {
      return <Component case={variation} flag={flag} />
    }
    if (typeof children === 'function') {
      return children({case: variation, flag})
    }
    return children || null
  }
)
