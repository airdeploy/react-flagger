import React from 'react'
import './App.css'

import {FlagProvider, Flag, FlagSwitch} from 'flagger-react'

const user = {id: '37024558'} // type:User injected by Flagger if type is not provided

const apiKey = 'fvbDhszeSDFC9Yze' // <--------- CHANGE THIS TO YOUR API KEY

// sourceURL, sseURL, ingestionURL is not necessary to provide if you are using Airdeploy
const sourceURL = 'http://localhost:8000/config/v3/' // <--------- CHANGE THIS
const sseURL = `http://localhost:8000/sse/v3?envKey=` // <--------- CHANGE THIS
const ingestionURL = `http://localhost:8000/ingest/v3?envKey=${apiKey}` // <--------- CHANGE THIS

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FlagProvider
          apiKey={apiKey}
          sourceURL={sourceURL}
          entity={user}
          sseURL={sseURL}
          ingestionURL={ingestionURL}
          logLevel={'debug'}>
          <FlagSwitch flag="test">
            <Flag case="blue">
              <div>The variation is blue</div>
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

export default App
