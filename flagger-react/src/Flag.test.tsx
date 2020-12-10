import {Logger} from 'flagger'
import React from 'react'
import renderer from 'react-test-renderer'

import {Flag, FlagSwitch, Variation} from './index'

describe('Flag.ts tests', () => {
  beforeAll(async () => {
    jest.mock('flagger')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('<Flag> tests', () => {
    test('logs a warning message and renders null if prop "isSwitchChild" = false AND prop "flag" is undefined', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn')
      const component = renderer.create(
        <Flag case="off">
          {(props) => <div>{JSON.stringify(props, null, 2)}</div>}
        </Flag>
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(null)
      expect(warnSpy).toBeCalledTimes(1)
      expect(warnSpy.mock.calls[0]).toEqual([
        'Prop "flag" is empty, but <Flag> is not a child of <FlagSwitch>',
      ])
    })

    test('renders FlagSwitch with single Variation if prop "isSwitchChild" = false AND prop "flag" is provided', () => {
      const childrenFn = (props: any) => (
        <div>{JSON.stringify(props, null, 2)}</div>
      )
      const component = renderer.create(
        <Flag case="off" flag="example">
          {childrenFn}
        </Flag>
      )

      const expectedRender = renderer.create(
        <FlagSwitch flag={'example'}>
          <Variation case={'off'} children={childrenFn} />
        </FlagSwitch>
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
    })

    test('logs a warning message if prop "isSwitchChild" = true AND prop "flag" is undefined', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn')
      const component = renderer.create(
        <Flag case="off" isSwitchChild>
          {(props) => <div>{JSON.stringify(props, null, 2)}</div>}
        </Flag>
      )

      const expectedRender = renderer.create(
        <div>{JSON.stringify({case: 'off'}, null, 2)}</div>
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
      expect(warnSpy).toBeCalledTimes(1)
      expect(warnSpy.mock.calls[0]).toEqual([
        'Prop "flag" is empty. <Flag> should be used with non-empty "flag" or as a child of <FlagSwitch>',
      ])
    })

    test('accepts react component as prop "component"', () => {
      const TestComponent = (props: any) => {
        return <div>{JSON.stringify(props, null, 2)}</div>
      }
      const component = renderer.create(
        <Flag
          isSwitchChild
          flag="example"
          case="off"
          component={TestComponent}
        />
      )

      const expectedRender = renderer.create(
        <TestComponent case="off" flag="example" />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
    })

    test('accepts function as children', () => {
      const renderFn = (props: any) => (
        <div>{JSON.stringify(props, null, 2)}</div>
      )

      const component = renderer.create(
        <Flag isSwitchChild flag="example" case="on">
          {renderFn}
        </Flag>
      )

      const expectedRender = renderer.create(
        renderFn({
          case: 'on',
          flag: 'example',
        })
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(expectedRender.toJSON())
    })

    test('renders null if neither children nor component prop provided', () => {
      const component = renderer.create(
        <Flag isSwitchChild flag="example" case="off" />
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(null)
    })
  })
})
