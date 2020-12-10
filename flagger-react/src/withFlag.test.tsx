import {Logger} from 'flagger'
import React from 'react'
import renderer from 'react-test-renderer'

import {flaggerCtx} from './contexts'
import {withFlag} from './index'

function TestComponent(props: any) {
  return <div>{JSON.stringify(props, null, 2)}</div>
}

describe('withFlag() tests', () => {
  beforeAll(async () => {
    jest.mock('flagger')
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  test('logs a warning message and renders wrapped component with empty flags prop if no flags provided', async () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn')
    const getFlagDetails = jest.fn()
    const getVariation = jest.fn()
    const entity = {id: '1'}

    const WrappedComponent = withFlag(TestComponent)

    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          loading: false,
          getVariation,
          getFlagDetails,
        }}>
        <WrappedComponent entity={entity} />
      </flaggerCtx.Provider>
    )
    const expectedRender = renderer.create(
      <TestComponent loading={false} flags={{}} entity={entity} />
    )

    const json = component.toJSON()
    expect(json).toMatchSnapshot()
    expect(json).toEqual(expectedRender.toJSON())
    expect(warnSpy).toBeCalledTimes(1)
    expect(warnSpy.mock.calls[0]).toEqual([
      'withFlag did not receive a valid flag name',
    ])
  })

  test('calls getFlagsDetails() from flaggerCtx', () => {
    const getFlagDetails = jest.fn()
    const getVariation = jest.fn()
    const entity = {id: '1'}

    const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          loading: false,
          getVariation,
          getFlagDetails,
        }}>
        <WrappedComponent entity={entity} />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('uses default entity if not provided', () => {
    const getFlagDetails = jest.fn()
    const getVariation = jest.fn()
    const entity = {id: '1'}
    const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          entity,
          loading: false,
          getVariation,
          getFlagDetails,
        }}>
        <WrappedComponent />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(getFlagDetails.mock.calls[0]).toEqual(['bitcoin-pay', entity])
  })

  test('prop entity overrides default one', () => {
    const getFlagDetails = jest.fn()
    const getVariation = jest.fn()
    const entity = {id: '1'}
    const entity2 = {id: '2'}
    const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          entity,
          loading: false,
          getVariation,
          getFlagDetails,
        }}>
        <WrappedComponent entity={entity2} />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(getFlagDetails.mock.calls[0]).toEqual(['bitcoin-pay', entity2])
  })
})
