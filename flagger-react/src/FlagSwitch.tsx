import {IEntity} from 'flagger/types/Types'
import React from 'react'

import {flaggerCtx} from './contexts'
import {IFlagProps} from './Flag'

// const log = new Logger('react/FlagSwitch')

export interface IComponentProps {
  flag: string
  entity?: IEntity
  variation: string
  loading: boolean
}

export type IFlagSwitchInnerProps = {
  codename: string
  entity?: IEntity
  variation: string
  loading: boolean
  children?: ((props: IComponentProps) => React.ReactNode) | React.ReactNode
  component?: React.ComponentType<IComponentProps>
}

const FlagSwitchInner = React.memo((props: IFlagSwitchInnerProps) => {
  const {
    codename: flag,
    entity,
    variation,
    loading,
    component: Component,
    children,
  } = props

  const childrenProps = {
    entity,
    flag,
    variation,
    loading,
  }
  if (typeof children === 'function') {
    return children(childrenProps)
  }
  if (Component) {
    return <Component {...childrenProps} />
  }

  const validChildren = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) &&
      (child.props as IFlagProps).case === variation
  ) as React.ReactElement<IFlagProps>[]

  let i = 0
  const finalChildren = validChildren.map((child) => {
    return React.cloneElement(child, {
      ...child.props,
      isSwitchChild: true,
      key: `${variation}-${i++}`,
      ...childrenProps,
    })
  })
  return <>{finalChildren}</>
})

export type IFlagSwitchProps = {
  flag: string
  entity?: IEntity
  children?: ((props: IComponentProps) => React.ReactNode) | React.ReactNode
  component?: React.ComponentType<IComponentProps>
}

export const FlagSwitch = React.memo(
  ({component, children, flag, entity}: IFlagSwitchProps) => {
    return (
      <flaggerCtx.Consumer>
        {({entity: defaultEntity, loading, getVariation}) => (
          <FlagSwitchInner
            codename={flag}
            entity={entity || defaultEntity}
            loading={loading}
            variation={getVariation(flag, entity || defaultEntity)}
            component={component}
            children={children}
          />
        )}
      </flaggerCtx.Consumer>
    )
  }
)
