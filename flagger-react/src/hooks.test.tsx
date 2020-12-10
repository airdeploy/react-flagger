import React from 'react'
import renderer from 'react-test-renderer'

import {flaggerCtx} from './contexts'
import {useFlag, useVariation} from './index'

const ViewJson = (props: any) => <div>{JSON.stringify(props, null, 2)}</div>

describe('hooks.ts tests', () => {
  beforeAll(async () => {
    jest.mock('flagger')
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('useFlag() tests', () => {
    test('uses data from flaggerCtx', () => {
      const HookComponent = () => {
        const results = useFlag('example')
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          loading={false}
          variation="some"
          enabled={true}
          isSampled={true}
          payload={{}}
          codename="example"
          entity={entity}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getFlagDetails).toBeCalledTimes(1)
      expect(getFlagDetails.mock.calls[0]).toEqual(['example', entity])
    })

    test('uses provided entity', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useFlag('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          loading={false}
          variation="some"
          enabled={true}
          isSampled={true}
          payload={{}}
          codename="example"
          entity={entity2}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getFlagDetails).toBeCalledTimes(1)
      expect(getFlagDetails.mock.calls[0]).toEqual(['example', entity2])
    })

    test('does not recalculate results if nothing changes', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useFlag('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )
      component.update(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          loading={false}
          variation="some"
          enabled={true}
          isSampled={true}
          payload={{}}
          codename="example"
          entity={entity2}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getFlagDetails).toBeCalledTimes(1)
    })

    test('recalculates results if something changes', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useFlag('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const config = {
        hashKey: '',
        sdkConfig: {
          SDK_INGESTION_INTERVAL: 100,
          SDK_INGESTION_MAX_CALLS: 10,
        },
      }
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )
      component.update(
        <flaggerCtx.Provider
          value={{
            entity,
            config,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          loading={false}
          variation="some"
          enabled={true}
          isSampled={true}
          payload={{}}
          codename="example"
          entity={entity2}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getFlagDetails).toBeCalledTimes(2)
    })
  })

  describe('useVariation() tests', () => {
    test('uses data from flaggerCtx', () => {
      const HookComponent = () => {
        const results = useVariation('example')
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'hey')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          codename="example"
          entity={entity}
          variation="hey"
          loading={false}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getFlagDetails).not.toBeCalled()
      expect(getVariation).toBeCalledTimes(1)
      expect(getVariation.mock.calls[0]).toEqual(['example', entity])
    })

    test('uses provided entity', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useVariation('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          codename="example"
          entity={entity2}
          variation="some"
          loading={false}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getVariation).toBeCalledTimes(1)
      expect(getVariation.mock.calls[0]).toEqual(['example', entity2])
    })

    test('does not recalculate variation if nothing changes', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useVariation('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )
      component.update(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          codename="example"
          entity={entity2}
          variation="some"
          loading={false}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getVariation).toBeCalledTimes(1)
      expect(getVariation.mock.calls[0]).toEqual(['example', entity2])
    })

    test('recalculates variation if something changes', () => {
      const entity2 = {id: '2'}
      const HookComponent = () => {
        const results = useVariation('example', entity2)
        return <ViewJson {...results} />
      }

      const entity = {id: '1'}
      const config = {
        hashKey: '',
        sdkConfig: {
          SDK_INGESTION_INTERVAL: 100,
          SDK_INGESTION_MAX_CALLS: 10,
        },
      }
      const getFlagDetails = jest.fn(() => {
        return {
          variation: 'some',
          enabled: true,
          isSampled: true,
          payload: {},
        }
      })
      const getVariation = jest.fn(() => 'some')

      const component = renderer.create(
        <flaggerCtx.Provider
          value={{
            entity,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )
      component.update(
        <flaggerCtx.Provider
          value={{
            entity,
            config,
            loading: false,
            getVariation,
            getFlagDetails,
          }}>
          <HookComponent />
        </flaggerCtx.Provider>
      )

      const expectedRender = renderer.create(
        <ViewJson
          codename="example"
          entity={entity2}
          variation="some"
          loading={false}
        />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(getVariation).toBeCalledTimes(2)
    })
  })
})
