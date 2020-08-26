import {IEntity} from 'flagger'
import {
  Flag,
  FlagProvider,
  FlagSwitch,
  useFlag,
  useVariation,
  Variation,
} from 'flagger-react'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import './App.css'
import config from './config'
import Counter from './Counter'
import logo from './logo.svg'

const mockUsers = [
  {
    id: '111111',
    type: 'User',
    name: 'admin@example.com',
    attributes: {
      email: 'admin@example.com',
      is_admin: true,
      is_user: true,
    },
  },
  {
    id: '222222',
    type: 'User',
    name: 'user@example.com',
    attributes: {
      email: 'user@example.com',
      is_admin: false,
      is_user: true,
    },
  },
  {
    id: '333333',
    type: 'User',
    name: 'qa@example.com',
    attributes: {
      email: 'qa@example.com',
      is_admin: true,
      is_user: true,
    },
  },
  {
    id: '444444',
    type: 'User',
    name: 'dev@example.com',
    attributes: {
      email: 'dev@example.com',
      is_admin: true,
      is_user: true,
    },
  },
  {
    id: '555555',
    type: 'User',
    name: 'johndoe@example.com',
    attributes: {
      email: 'johndoe@example.com',
      is_admin: false,
      is_user: true,
    },
  },
  {
    id: '666666',
    type: 'User',
    name: 'janedoe@example.com',
    attributes: {
      email: 'janedoe@example.com',
      is_admin: false,
      is_user: true,
    },
  },
]

const entityCtx = createContext<{
  entity: IEntity | null
  setEntity: (entity: IEntity | null) => void
}>({
  entity: null,
  // tslint:disable-next-line: no-empty
  setEntity: () => {},
})

const Box = ({
  style,
  children,
}: React.PropsWithChildren<{style?: React.CSSProperties}>) => {
  return (
    <div
      style={{
        border: '1px solid var(--text)',
        display: 'block',
        margin: '20px 0',
        padding: 20,
        borderRadius: 8,
        ...style,
      }}>
      {children}
    </div>
  )
}

function App() {
  const {entity, setEntity} = useContext(entityCtx)
  const darkModeFlag = useVariation('dark-mode')
  const newFeatureFlag = useFlag('new-feature')
  const devOnlyFlag = useFlag('dev-only')
  const onUserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      const user = mockUsers.find((u) => u.id === value)
      setEntity(user || null)
    },
    [setEntity]
  )
  return (
    <div
      className={`App ${darkModeFlag.variation === 'on' ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <p>
          Select user to see flags in action&nbsp;
          <select value={entity ? entity.id : ''} onChange={onUserChange}>
            <option value="">Select...</option>
            {mockUsers.map((user) => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </p>

        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{
            animationDuration: devOnlyFlag.variation === 'on' ? '5s' : '20s',
          }}
        />

        <Flag flag="dev-only" case="on">
          <div>
            Flag <code>dev-only</code>
          </div>
          <p>
            Developer! Edit <code>src/App.tsx</code> and save to reload.
          </p>
        </Flag>
        <a
          className="App-link"
          href={config.dashboardLink}
          target="_blank"
          rel="noopener noreferrer">
          Open dashboard
        </a>
        <FlagSwitch flag="color">
          {({variation}) => (
            <Box
              style={{
                borderColor: variation,
                color: variation,
              }}>
              Flag <code>color</code> is {variation}
            </Box>
          )}
        </FlagSwitch>

        <FlagSwitch flag="new-feature">
          <Variation case="on">
            <Box>
              Visible only if flag <code>new-feature</code> is <code>on</code>
              <Counter />
            </Box>
          </Variation>
          <Variation case="off">
            <Box>
              <code>new-feature</code> flag is <code>off</code>
            </Box>
          </Variation>
        </FlagSwitch>

        <Box>
          <h3>
            Flag <code>{newFeatureFlag.codename}</code>
          </h3>
          <pre style={{textAlign: 'left'}}>
            {JSON.stringify(newFeatureFlag, null, 2)}
          </pre>
        </Box>
      </header>
    </div>
  )
}

const AppSpinner = () => (
  <div className="App">
    <div className="App-spinner">Loading...</div>
  </div>
)

export const Root = () => {
  // retrieve perssted user id
  const persistedEntityId = useMemo(
    () => localStorage.getItem('example::user_id'),
    []
  )
  const [entity, setEntity] = useState<IEntity | null>(
    mockUsers.find((user) => user.id === persistedEntityId) || null
  )
  // persist current user id
  useEffect(() => {
    if (entity) {
      localStorage.setItem('example::user_id', entity.id)
    } else {
      localStorage.removeItem('example::user_id')
    }
  }, [entity])
  return (
    <entityCtx.Provider value={{entity, setEntity}}>
      <FlagProvider
        apiKey={config.apiKey}
        entity={entity || undefined}
        logLevel="debug"
        loadingView={<AppSpinner />}>
        <App />
      </FlagProvider>
    </entityCtx.Provider>
  )
}

export default Root
