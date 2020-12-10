import Flagger from 'flagger'
import React from 'react'
import renderer from 'react-test-renderer'

import {FlagProvider} from './index'

const wait = (ms: number): Promise<void> =>
  new Promise((res) => {
    setTimeout(res, ms)
  })

const sourceURL = 'http://someserver.com/'
const apiKey = 'onz2150xjon6pkjr'

describe('<FlagProvider> tests', () => {
  beforeAll(async () => {
    jest.mock('flagger')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  test("calls Flagger.init() if it's not initialized", async () => {
    Flagger.isConfigured = jest.fn(() => false)
    Flagger.init = jest.fn(() => Promise.resolve())

    const initSpy = jest.spyOn(Flagger, 'init')
    const entity = {id: '1'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity} />
    )
    await renderer.act(() => wait(10))

    expect(initSpy).toHaveBeenCalledTimes(1)
  })

  test('does not call Flagger.init() if Flagger is already initialized', async () => {
    Flagger.isConfigured = jest.fn(() => true)
    const initSpy = jest.spyOn(Flagger, 'init')
    const entity = {id: '1'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity} />
    )
    await renderer.act(() => wait(10))

    expect(initSpy).toHaveBeenCalledTimes(0)
  })

  test('subscribes to FlaggerConfigUpdate event on mount', async () => {
    Flagger.isConfigured = jest.fn(() => false)
    Flagger.init = jest.fn(() => Promise.resolve())
    Flagger.addFlaggerConfigUpdateListener = jest.fn()
    const entity = {id: '1'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity} />
    )
    await renderer.act(() => wait(10))

    expect(Flagger.addFlaggerConfigUpdateListener).toBeCalledTimes(1)
  })

  test('unsubscribes from FlaggerConfigUpdate event on unmount', async () => {
    Flagger.removeFlaggerConfigUpdateListener = jest.fn()
    const entity = {id: '1'}

    const component = renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity} />
    )
    component.unmount()

    expect(Flagger.removeFlaggerConfigUpdateListener).toBeCalledTimes(1)
  })

  test('enter loading state during Flagger initialization (children function)', async () => {
    Flagger.isConfigured = jest.fn(() => false)
    const entity = {id: '1'}
    const LoadingView = () => {
      return <div>Loading...</div>
    }
    const renderFn = jest.fn(({loading}) => {
      if (loading) {
        return <LoadingView />
      }
      return <div>Loaded</div>
    })

    const component = renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {renderFn}
      </FlagProvider>
    )
    const json = component.toJSON()
    const laodingViewJson = renderer.create(<LoadingView />).toJSON()

    expect(json).toMatchSnapshot()
    expect(json).toEqual(laodingViewJson)
    expect(renderFn).toBeCalledTimes(1)
    expect(renderFn.mock.calls[0][0].loading).toBe(true)
  })

  test('enter loading state during Flagger initialization (loadingView prop)', async () => {
    Flagger.isConfigured = jest.fn(() => false)
    const entity = {id: '1'}

    const LoadingView = () => {
      return <div>Loading...</div>
    }
    const component = renderer.create(
      <FlagProvider
        apiKey={apiKey}
        sourceURL={sourceURL}
        entity={entity}
        loadingView={<LoadingView />}
      />
    )
    const json = component.toJSON()
    const laodingViewJson = renderer.create(<LoadingView />).toJSON()

    expect(json).toEqual(laodingViewJson)
    expect(json).toMatchSnapshot()
  })

  test('renders children when not in loading state', () => {
    Flagger.isConfigured = jest.fn(() => true)
    const entity = {id: '1'}

    const children = <div>42</div>

    const component = renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {children}
      </FlagProvider>
    )
    const json = component.toJSON()
    const childrenJson = renderer.create(children).toJSON()

    expect(json).toMatchSnapshot()
    expect(json).toEqual(childrenJson)
  })

  test('calls Flagger.getVariation() when getVariation() is called', () => {
    Flagger.isConfigured = jest.fn(() => true)
    const getVariationSpy = jest.spyOn(Flagger, 'getVariation')
    const entity = {id: '1'}
    const entity2 = {id: '2'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {({getVariation}) => {
          getVariation('example')
          getVariation('example', entity2)
          return null
        }}
      </FlagProvider>
    )

    expect(getVariationSpy).toBeCalledTimes(2)
    expect(getVariationSpy.mock.calls[0]).toEqual(['example', entity])
    expect(getVariationSpy.mock.calls[1]).toEqual(['example', entity2])
  })

  test('calls Flagger.getVariation(), .isEnabled(), .isSampled() & .getPayload() when getFlagDetails() is called', () => {
    Flagger.isConfigured = jest.fn(() => true)
    const getVariationSpy = jest.spyOn(Flagger, 'getVariation')
    const isEnabledSpy = jest.spyOn(Flagger, 'isEnabled')
    const isSampledSpy = jest.spyOn(Flagger, 'isSampled')
    const getPayloadSpy = jest.spyOn(Flagger, 'getPayload')
    const entity = {id: '1'}
    const entity2 = {id: '2'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {({getFlagDetails}) => {
          getFlagDetails('example')
          getFlagDetails('example', entity2)
          return null
        }}
      </FlagProvider>
    )

    // getVariation
    expect(getVariationSpy).toBeCalledTimes(2)
    expect(getVariationSpy.mock.calls[0]).toEqual(['example', entity])
    expect(getVariationSpy.mock.calls[1]).toEqual(['example', entity2])
    // isEnabled
    expect(isEnabledSpy).toBeCalledTimes(2)
    expect(isEnabledSpy.mock.calls[0]).toEqual(['example', entity])
    expect(isEnabledSpy.mock.calls[1]).toEqual(['example', entity2])
    // isSampled
    expect(isSampledSpy).toBeCalledTimes(2)
    expect(isSampledSpy.mock.calls[0]).toEqual(['example', entity])
    expect(isSampledSpy.mock.calls[1]).toEqual(['example', entity2])
    // getPayload
    expect(getPayloadSpy).toBeCalledTimes(2)
    expect(getPayloadSpy.mock.calls[0]).toEqual(['example', entity])
    expect(getPayloadSpy.mock.calls[1]).toEqual(['example', entity2])
  })

  test('updates state on addFlaggerConfigUpdateListener callback', async () => {
    Flagger.isConfigured = jest.fn(() => true)
    const childrenFn = jest.fn(() => null)
    // tslint:disable-next-line: no-empty
    let callback = (_config: any) => {}
    Flagger.addFlaggerConfigUpdateListener = jest.fn((cb) => {
      callback = cb
    })
    const entity = {id: '1'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {childrenFn}
      </FlagProvider>
    )
    callback({})

    expect(childrenFn).toBeCalledTimes(2)
    expect(childrenFn.mock.calls[0]).not.toEqual(childrenFn.mock.calls[1])
  })

  test('works with nested FlagProvider', async () => {
    Flagger.isConfigured = jest.fn(() => true)
    const getVariationSpy = jest.spyOn(Flagger, 'getVariation')
    const isEnabledSpy = jest.spyOn(Flagger, 'isEnabled')
    const isSampledSpy = jest.spyOn(Flagger, 'isSampled')
    const getPayloadSpy = jest.spyOn(Flagger, 'getPayload')
    const entity = {id: '1'}
    const entity2 = {id: '2'}

    renderer.create(
      <FlagProvider apiKey={apiKey} sourceURL={sourceURL} entity={entity}>
        {({getFlagDetails}) => {
          getFlagDetails('example')
          return (
            <FlagProvider
              apiKey={apiKey}
              sourceURL={sourceURL}
              entity={entity2}>
              {({getFlagDetails: getFlagDetailsNested}) => {
                getFlagDetailsNested('example')
                return
              }}
            </FlagProvider>
          )
        }}
      </FlagProvider>
    )

    // getVariation
    expect(getVariationSpy).toBeCalledTimes(2)
    expect(getVariationSpy.mock.calls[0]).toEqual(['example', entity])
    expect(getVariationSpy.mock.calls[1]).toEqual(['example', entity2])
    // isEnabled
    expect(isEnabledSpy).toBeCalledTimes(2)
    expect(isEnabledSpy.mock.calls[0]).toEqual(['example', entity])
    expect(isEnabledSpy.mock.calls[1]).toEqual(['example', entity2])
    // isSampled
    expect(isSampledSpy).toBeCalledTimes(2)
    expect(isSampledSpy.mock.calls[0]).toEqual(['example', entity])
    expect(isSampledSpy.mock.calls[1]).toEqual(['example', entity2])
    // getPayload
    expect(getPayloadSpy).toBeCalledTimes(2)
    expect(getPayloadSpy.mock.calls[0]).toEqual(['example', entity])
    expect(getPayloadSpy.mock.calls[1]).toEqual(['example', entity2])
  })
})
