import React from 'react'
import renderer from 'react-test-renderer'

import {flaggerCtx} from './contexts'

describe('contexts.ts tests', () => {
  beforeAll(async () => {
    jest.mock('flagger')
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })

  describe('flaggerCtx tests', () => {
    test('provides default value', () => {
      const component = renderer.create(
        <flaggerCtx.Consumer>
          {({loading, getFlagDetails, getVariation, config, entity}) => (
            <ul>
              <li>loading: {loading}</li>
              <li>
                getVariation:{' '}
                {JSON.stringify(getVariation('any-flag-name'), null, 2)}
              </li>
              <li>
                flagDetails:{' '}
                {JSON.stringify(getFlagDetails('any-flag-name'), null, 2)}
              </li>
              <li>entity: {JSON.stringify(entity, null, 2)}</li>
              <li>config: {JSON.stringify(config, null, 2)}</li>
            </ul>
          )}
        </flaggerCtx.Consumer>
      )

      expect(component.toJSON()).toMatchSnapshot()
    })
  })
})
