import {IEntity, IFlaggerConfiguration} from 'flagger/types/Types'
import React from 'react'

export interface IFlaggerCtx {
  entity?: IEntity
  config?: IFlaggerConfiguration
  loading: boolean
  getVariation: (codename: string, entity?: IEntity) => string
  getFlagDetails: (
    codename: string,
    entity?: IEntity
  ) => {variation: string; enabled: boolean; isSampled: boolean; payload: any}
}

export const flaggerCtx = React.createContext<IFlaggerCtx>({
  loading: false,
  getVariation: () => 'off',
  getFlagDetails: () => ({
    variation: 'off',
    enabled: false,
    isSampled: false,
    payload: null,
  }),
})
