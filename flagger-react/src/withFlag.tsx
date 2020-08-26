import {Logger} from 'flagger'
import {IEntity} from 'flagger/types/Types'
import React from 'react'

import {flaggerCtx, IFlaggerCtx} from './contexts'

const log = new Logger('react/withFlag')

export function withFlag(
  WrappedComponent: React.ElementType,
  ...flagNames: string[]
) {
  const getFlagsDetails = (
    getDetails: IFlaggerCtx['getFlagDetails'],
    entity?: IEntity
  ) => {
    return flagNames.reduce(
      (reducedFlags, flagName) => ({
        ...reducedFlags,
        [flagName]: getDetails(flagName, entity),
      }),
      {}
    )
  }
  return class FlaggedComponent extends React.PureComponent<{
    entity?: IEntity
  }> {
    public render() {
      return (
        <flaggerCtx.Consumer>
          {({entity: defaultEntity, loading, getFlagDetails}) => {
            if (flagNames.length === 0) {
              // tslint:disable-next-line: no-console
              log.warn('withFlag did not receive a valid flag name')
              return (
                <WrappedComponent
                  loading={loading}
                  flags={{}}
                  {...this.props}
                />
              )
            }
            return (
              <WrappedComponent
                loading={loading}
                flags={getFlagsDetails(
                  getFlagDetails,
                  this.props.entity || defaultEntity
                )}
                {...this.props}
              />
            )
          }}
        </flaggerCtx.Consumer>
      )
    }
  }
}

export default withFlag
