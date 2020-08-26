import Flagger from 'flagger'
import React from 'react'
import renderer from 'react-test-renderer'

import {flaggerCtx} from './contexts'
import {FlagSwitch} from './index'

jest.mock('flagger')

describe('<FlagSwitch> tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    ;(Flagger as any).mockClear()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  test('accepts function as children', () => {
    const component = renderer.create(
      <FlagSwitch flag="example">
        {(props: any) => <div>{JSON.stringify(props, null, 2)}</div>}
      </FlagSwitch>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('accepts react component as "component" prop', () => {
    const TestComponent = (props: any) => (
      <div>{JSON.stringify(props, null, 2)}</div>
    )
    const component = renderer.create(
      <FlagSwitch flag="example" component={TestComponent} />
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  test('gets "loading" from flaggerCtx', () => {
    const TestComponent = (props: any) => (
      <div>{JSON.stringify(props, null, 2)}</div>
    )
    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          loading: true,
          getVariation: jest.fn(() => 'off'),
          getFlagDetails: jest.fn(),
        }}>
        <FlagSwitch flag="example" component={TestComponent} />
      </flaggerCtx.Provider>
    )
    const expectedRender = renderer.create(
      <TestComponent flag="example" variation="off" loading={true} />
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(component.toJSON()).toEqual(expectedRender.toJSON())
  })

  test('calls "getVariation()" from flaggerCtx', () => {
    const getVariation = jest.fn(() => 'on')
    const TestComponent = (props: any) => (
      <div>{JSON.stringify(props, null, 2)}</div>
    )
    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          loading: false,
          getVariation,
          getFlagDetails: jest.fn(),
        }}>
        <FlagSwitch flag="example" component={TestComponent} />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(getVariation).toBeCalledTimes(1)
    expect(getVariation.mock.calls[0]).toEqual(['example', undefined])
  })

  test('defaults to entity from flaggerCtx', () => {
    const getVariation = jest.fn(() => 'on')
    const defaultEntity = {id: '42'}
    const TestComponent = (props: any) => (
      <div>{JSON.stringify(props, null, 2)}</div>
    )
    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          entity: defaultEntity,
          loading: false,
          getVariation,
          getFlagDetails: jest.fn(),
        }}>
        <FlagSwitch flag="example" component={TestComponent} />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(getVariation).toBeCalledTimes(1)
    expect(getVariation.mock.calls[0]).toEqual(['example', defaultEntity])
  })

  test('uses entity from prop "entity" if provided', () => {
    const getVariation = jest.fn(() => 'on')
    const defaultEntity = {id: '42'}
    const expectedEntity = {id: '9001'}
    const TestComponent = (props: any) => (
      <div>{JSON.stringify(props, null, 2)}</div>
    )
    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          entity: defaultEntity,
          loading: false,
          getVariation,
          getFlagDetails: jest.fn(),
        }}>
        <FlagSwitch
          flag="example"
          component={TestComponent}
          entity={expectedEntity}
        />
      </flaggerCtx.Provider>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(getVariation).toBeCalledTimes(1)
    expect(getVariation.mock.calls[0]).toEqual(['example', expectedEntity])
  })

  test('filters children that has prop "case" equal to current flag variation', () => {
    const entity = {id: '9001'}
    const Child = (props: any) => <div>{JSON.stringify(props, null, 2)}</div>

    const component = renderer.create(
      <flaggerCtx.Provider
        value={{
          loading: false,
          getVariation: jest.fn(() => 'red'),
          getFlagDetails: jest.fn(),
        }}>
        <FlagSwitch flag="color" entity={entity}>
          <Child case="red" other="prop 1" />
          <Child case="red" other="prop 1.2" />
          <Child case="green" other="prop 2" />
          <Child case="blue" other="prop 3" />
        </FlagSwitch>
      </flaggerCtx.Provider>
    )
    const expectedRender = renderer.create(
      <>
        <Child
          case="red"
          other="prop 1"
          isSwitchChild={true}
          entity={entity}
          flag="color"
          variation="red"
          loading={false}
        />
        <Child
          case="red"
          other="prop 1.2"
          isSwitchChild={true}
          entity={entity}
          flag="color"
          variation="red"
          loading={false}
        />
      </>
    )

    expect(component.toJSON()).toMatchSnapshot()
    expect(component.toJSON()).toEqual(expectedRender.toJSON())
  })
})
