import Flagger, {Logger} from 'flagger'
import React from 'react'
import renderer from 'react-test-renderer'

import {Variation} from './index'

jest.mock('flagger')

describe('Variation.ts tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    ;(Flagger as any).mockClear()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('<Variation> tests', () => {
    test('logs a warning message if prop "flag" is undefined', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn')
      const component = renderer.create(
        <Variation case="off">
          {(props) => <div>{JSON.stringify(props, null, 2)}</div>}
        </Variation>
      )

      expect(component.toJSON()).toMatchSnapshot()
      expect(warnSpy).toBeCalledTimes(1)
      expect(warnSpy.mock.calls[0]).toEqual([
        'Prop "flag" is empty. Looks like you are using <Variation> outside of <FlagSwitch>',
      ])
    })

    test('accepts react component as prop "component"', () => {
      const TestComponent = (props: any) => {
        return <div>{JSON.stringify(props, null, 2)}</div>
      }
      const component = renderer.create(
        <Variation flag="example" case="off" component={TestComponent} />
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
        <Variation flag="example" case="on">
          {renderFn}
        </Variation>
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
      const component = renderer.create(<Variation flag="example" case="off" />)

      expect(component.toJSON()).toMatchSnapshot()
      expect(component.toJSON()).toEqual(null)
    })
  })
})
