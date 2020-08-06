import React, {Component, Fragment} from 'react'
import './App.css'

import {FlagProvider, Flag, FlagSwitch} from 'flagger-react'

const apiKey = 'x17i1t1vf7m374ml' // <--------- CHANGE THIS TO YOUR API KEY

class App extends Component {
  state = {
    options: [
      {
        name: 'Select…',
        value: null,
      },
      {
        name: '123456',
        value: '123456',
      },
      {
        name: '654321',
        value: '654321',
      },
    ],
    value: '1',
  }

  handleChange = (event) => {
    this.setState({value: event.target.value})
  }

  render() {
    const {options, value} = this.state

    const entity = {
      id: value,
      name: 'Michael',
      attributes: {
        createdAt: '2014-09-20T00:00:00Z',
      },
    }
    return (
      <div className="App">
        <header className="App-header">
          <Fragment>
            <select onChange={this.handleChange} value={value}>
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            <h1>ID: {value}</h1>
          </Fragment>
          <FlagProvider apiKey={apiKey} entity={entity} logLevel={'debug'}>
            <FlagSwitch flag="best-flag-in-history">
              <Flag case="on">
                <div>The variation is on</div>
              </Flag>

              <Flag case="green">
                <div>The variation is green</div>
              </Flag>
              <Flag case="red">
                <div>The variation is red</div>
              </Flag>
              <Flag case="off">
                <div>This flag is off</div>
              </Flag>
            </FlagSwitch>
          </FlagProvider>
        </header>
      </div>
    )
  }
}

export default App
