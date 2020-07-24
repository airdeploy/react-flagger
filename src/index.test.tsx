import nock from 'nock'
import React from 'react'
import renderer from 'react-test-renderer'

import Flagger from 'flagger'
import {Flag, FlagSwitch, withFlag} from './index'

const sourceURL = 'http://someserver.com/'

const api = nock(sourceURL)
const apiKey = 'onz2150xjon6pkjr'
const config = {
  sdkConfig: {
    SDK_INGESTION_INTERVAL: 60,
    SDK_BROWSER_INGESTION_INTERVAL: 15,
    SDK_INGESTION_MAX_CALLS: 500,
    SDK_BROWSER_MAX_CALLS: 1,
  },
  hashKey: '2779',
  flags: [
    {
      subpopulations: [
        {
          entityType: 'User',
          samplingPercentage: 1,
          filters: [],
        },
      ],
      variations: [
        {
          codename: 'off',
          probability: 0,
        },
        {
          codename: 'on',
          probability: 1.0,
          payload: {
            a: 'b',
          },
        },
      ],
      whitelist: [
        {
          type: 'User',
          id: '1',
          variation: 'on',
        },
      ],
      killSwitchEngaged: false,
      codename: 'bitcoin-pay',
    },
    {
      subpopulations: [
        {
          filters: [],
          samplingPercentage: 0,
          entityType: 'User',
        },
      ],
      variations: [
        {
          treatmentId: '37',
          codename: 'off',
          probability: 0,
        },
        {
          treatmentId: '38',
          probability: 1,
          codename: 'default',
        },
        {
          treatmentId: '39',
          probability: 0,
          codename: 'variation-1',
        },
        {
          treatmentId: '40',
          probability: 0,
          codename: 'variation-2',
        },
      ],
      whitelist: [
        {
          type: 'User',
          id: '1',
          variation: 'default',
        },
        {
          type: 'User',
          id: '2',
          variation: 'variation-1',
        },
        {
          type: 'User',
          id: '3',
          variation: 'variation-2',
        },
      ],
      killSwitchEngaged: false,
      codename: 'treatment',
    },
  ],
}

let scope: any
describe('Flagger react tests', () => {
  beforeAll(async () => {
    scope = api.get('/' + apiKey).reply(200, config)
    Flagger.setEntity({id: '1'})

    await Flagger.init({apiKey, sourceURL})
  })

  afterAll(async () => {
    scope.done()
    await Flagger.shutdown()
  })

  describe('withFlag tests', () => {
    test('withFlag adds flags.<name>.enabled property', () => {
      function TestComponent(props: any) {
        return <div>{props.flags['bitcoin-pay'].enabled.toString()}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

      const component = renderer.create(<WrappedComponent />)

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('withFlag adds flags.<name>.isSampled property', () => {
      function TestComponent(props: any) {
        return <div>{props.flags['bitcoin-pay'].isSampled.toString()}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

      const component = renderer.create(<WrappedComponent />)

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('withFlag adds flags.<name>.variation property', () => {
      function TestComponent(props: any) {
        return <div>{props.flags['bitcoin-pay'].variation.toString()}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

      const component = renderer.create(<WrappedComponent entity={{id: '1'}} />)

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('withFlag adds flags.<name>.payload property', () => {
      function TestComponent(props: any) {
        return <div>{JSON.stringify(props.flags['bitcoin-pay'].payload)}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

      const component = renderer.create(<WrappedComponent />)

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('withFlag wrapped components accept entity prop', () => {
      function TestComponent(props: any) {
        return <div>{props.flags['bitcoin-pay'].enabled.toString()}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'bitcoin-pay')

      const component = renderer.create(<WrappedComponent entity={{id: '2'}} />)

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('withFlag wrapped components handles invalid flag name', () => {
      function TestComponent(props: any) {
        return <div>{props.flags['unreal-flag'].enabled.toString()}</div>
      }

      const WrappedComponent = withFlag(TestComponent, 'unreal-flag')

      const component = renderer.create(<WrappedComponent entity={{id: '2'}} />)

      expect(component.toJSON()).toMatchSnapshot()
    })
  })

  describe('FlagSwitch tests', () => {
    test('FlagSwitch accepts entity prop', () => {
      const component = renderer.create(
        <FlagSwitch flag="bitcoin-pay" entity={{id: '2'}}>
          <Flag case="on">On!</Flag>
          <Flag case="off">Off!</Flag>
        </FlagSwitch>
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('Flag can inherit flag prop from FlagSwitch', () => {
      const component = renderer.create(
        <FlagSwitch flag="bitcoin-pay">
          <Flag case="on">On!</Flag>
          <Flag case="off">Off!</Flag>
        </FlagSwitch>
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('Flag can override flag prop from FlagSwitch', () => {
      const component = renderer.create(
        <FlagSwitch flag="bitcoin-pay">
          <Flag flag="treatment" case="default">
            Default
          </Flag>
          <Flag flag="treatment" case="variation-1">
            Variation 1
          </Flag>
          <Flag flag="treatment" case="variation-2">
            Variation 1
          </Flag>
          <Flag flag="treatment" case="off">
            Off
          </Flag>
        </FlagSwitch>
      )

      expect(component.toJSON()).toMatchSnapshot()
    })

    test('Flag accepts entity prop', () => {
      const component = renderer.create(
        <>
          <Flag flag="treatment" entity={{id: '2'}} case="default">
            Default
          </Flag>
          <Flag flag="treatment" entity={{id: '2'}} case="variation-1">
            Variation 1
          </Flag>
          <Flag flag="treatment" entity={{id: '2'}} case="variation-2">
            Variation 2
          </Flag>
          <Flag flag="treatment" entity={{id: '2'}} case="off">
            Off
          </Flag>
        </>
      )

      expect(component.toJSON()).toMatchSnapshot()
    })
  })
})
