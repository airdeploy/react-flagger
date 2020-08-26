import {Logger} from 'flagger'
import React from 'react'

const log = new Logger('react/Variation')

export interface IVariationProps {
  case: string
  flag?: string
  children?:
    | ((props: {case: string; flag?: string}) => React.ReactNode)
    | React.ReactNode
  component?: React.ComponentType<{
    flag?: string
    case: string
  }>
}

export const Variation = React.memo(
  ({
    component: Component,
    children,
    case: variation,
    flag,
  }: IVariationProps) => {
    if (!flag) {
      log.warn(
        'Prop "flag" is empty. Looks like you are using <Variation> outside of <FlagSwitch>'
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
