import {IEntity} from 'flagger/types/Types'
import {useContext, useMemo} from 'react'

import {flaggerCtx} from './contexts'

export interface IUseVariationResponse {
  codename: string
  entity?: IEntity
  variation: string
  loading: boolean
}

export const useVariation = (
  codename: string,
  entity?: IEntity
): IUseVariationResponse => {
  const {entity: defaultEntity, loading, getVariation, config} = useContext(
    flaggerCtx
  )
  const targetEntity = entity || defaultEntity
  return useMemo<IUseVariationResponse>(() => {
    const variation = getVariation(codename, targetEntity)
    return {
      codename,
      entity: targetEntity,
      variation,
      loading,
    }
  }, [codename, targetEntity, loading, getVariation, config])
}

export interface IUseFlagResponse {
  loading: boolean
  codename: string
  entity?: IEntity
  enabled: boolean
  isSampled: boolean
  variation: string
  payload: any
}

export const useFlag = (codename: string, entity?: IEntity) => {
  const {entity: defaultEntity, loading, getFlagDetails, config} = useContext(
    flaggerCtx
  )
  const targetEntity = entity || defaultEntity
  return useMemo<IUseFlagResponse>(() => {
    const details = getFlagDetails(codename, targetEntity)
    return {
      loading,
      ...details,
      codename,
      entity: targetEntity,
    }
  }, [codename, targetEntity, loading, getFlagDetails, config])
}
