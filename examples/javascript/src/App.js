import React, {
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";
import {
  FlagProvider,
  Flag,
  Variation,
  FlagSwitch,
  withFlag,
  useVariation,
} from "flagger-react";

import "./App.css";

const apiKey = "x17i1t1vf7m374ml"; // <--------- CHANGE THIS TO YOUR API KEY

const flaggerConfig = {
  apiKey: apiKey,
  entity: null,
  logLevel: "debug",
};

const users = [
  {
    id: "100001",
    email: "none@example.com",
    roles: ["user"],
    createdAt: "2015-02-21T00:00:00Z",
  },
  {
    id: "111111",
    email: "johndoe@example.com",
    roles: ["user"],
    createdAt: "2015-02-21T00:00:00Z",
  },
  {
    id: "222222",
    email: "janedoe@example.com",
    roles: ["user"],
    createdAt: "2015-02-20T00:00:00Z",
  },
  {
    id: "333333",
    email: "dev@example.com",
    roles: ["user", "admin"],
    createdAt: "2014-09-20T00:00:00Z",
  },
  {
    id: "444444",
    email: "manager@example.com",
    roles: ["user", "editor"],
    createdAt: "2016-09-20T00:00:00Z",
  },
  { id: "555555", email: "user@example.com", roles: ["user"] },
  {
    id: "666666",
    email: "poni@example.com",
    roles: ["user"],
    createdAt: "2018-09-20T00:00:00Z",
  },
  {
    id: "777777",
    email: "unicorn@example.com",
    roles: ["user"],
    createdAt: "2000-09-20T00:00:00Z",
  },
  {
    id: "888888",
    email: "hedgehog@example.com",
    roles: ["user", "admin", "owner"],
    createdAt: "2014-01-00T00:00:00Z",
  },
  {
    id: "999999",
    email: "admin@example.com",
    roles: ["user", "admin", "owner"],
    createdAt: "2014-09-20T00:00:00Z",
  },
];

const user2entity = (user) => {
  return {
    id: user.id,
    type: "User",
    name: user.email,
    attributes: {
      email: user.email,
      is_user: user.roles.includes("user"),
      is_admin: user.roles.includes("admin"),
      is_owner: user.roles.includes("owner"),
      is_manager: user.roles.includes("manager"),
      is_editor: user.roles.includes("editor"),
      createdAt: user.createdAt,
    },
  };
};

const currentEntityCtx = React.createContext({
  onChange: () => {},
  entity: null,
  options: [],
});

const CurrentEntitySelector = () => {
  const { entity, options, onChange } = useContext(currentEntityCtx);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>User &nbsp;</div>
      <select onChange={onChange} value={entity ? entity.id : ""}>
        <option value="">Select entity...</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Page = ({ children }) => {
  const darkModeFlag = useVariation("dark-mode");
  const newFeatureFlag = useVariation("new-feature");
  const isDarkMode = darkModeFlag.variation === "on";
  const isNewFeature = newFeatureFlag.variation === "on";
  return (
    <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
      <header className="App-header">
        <CurrentEntitySelector />
        Theme: {isDarkMode ? "Dark" : "Light"}
      </header>
      <nav>
        <ul className="nav">
          <li>
            <NavLink to="/with-flag-hoc" activeClassName="active">
              HOC withFlag
            </NavLink>
          </li>
          <li>
            <NavLink to="/hooks" activeClassName="active">
              Hooks
            </NavLink>
          </li>
          <li>
            <NavLink to="/switch" activeClassName="active">
              FlagSwitch
            </NavLink>
          </li>
          <li>
            <NavLink to="/solo-flag" activeClassName="active">
              Solo Flag
            </NavLink>
          </li>
          {isNewFeature && (
            <li>
              <NavLink to="/new-feature" activeClassName="active">
                New Feature
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="App-content">{children}</div>
    </div>
  );
};

const PageWithFlagHoc = React.memo(
  withFlag(
    ({ flags }) => {
      return (
        <Page>
          <h1>HOC withFlag</h1>
          <pre style={{ textAlign: "left" }}>
            {JSON.stringify(flags, null, 2)}
          </pre>
        </Page>
      );
    },
    "dev-only",
    "new-feature",
    "color",
    "dark-mode",
    "best-flag-in-history"
  )
);

const VariationGreen = () => {
  return (
    <p>
      The variation is <code style={{ color: "green" }}>green</code>
    </p>
  );
};
const PageFlagSwitch = () => {
  return (
    <Page>
      <h1>FlagSwitch</h1>
      <h2>Color</h2>
      <FlagSwitch flag="color">
        <Flag case="red">
          The variation is <code style={{ color: "red" }}>red</code>
        </Flag>
        <Flag case="green" component={VariationGreen} />
        <Flag case="blue">
          {() => (
            <p>
              The variation is <code style={{ color: "blue" }}>blue</code>
            </p>
          )}
        </Flag>
        <Flag case="deeppink">
          The variation is <code style={{ color: "deeppink" }}>deeppink</code>
        </Flag>
        <Variation case="off">
          The variation is <code>OFF</code>
        </Variation>
      </FlagSwitch>
      <h2>Dark-mode</h2>
      <FlagSwitch flag="dark-mode">
        {(props) => <pre>{JSON.stringify(props, null, 2)}</pre>}
      </FlagSwitch>
    </Page>
  );
};

const PageNewFeature = () => {
  return (
    <Page>
      <h1>New Feature</h1>
      <p>
        This page is only visible if flag <code>new-feature</code> is <code>on</code>
      </p>
    </Page>
  );
};

const PageHooks = () => {
  const color = useVariation("color");
  return (
    <Page>
      <h1>Hooks</h1>
      <p>
        The variation of flag <code>color</code> is{" "}
        <code style={{ color: color.variation }}>{color.variation}</code>
      </p>
      <p>
        <pre style={{ textAlign: "left" }}>
          {JSON.stringify(color, null, 2)}
        </pre>
      </p>
    </Page>
  );
};

const PageSoloFlag = () => {
  return (
    <Page>
      <Flag flag="dark-mode" case="on">
        Flag <code>dark-mode</code> is ON
      </Flag>
      <Flag flag="dark-mode" case="off">
        Flag <code>dark-mode</code> is OFF
      </Flag>
    </Page>
  );
};

const App = () => {
  const newFeatureFlag = useVariation("new-feature");
  return (
    <Switch>
      <Route path="/with-flag-hoc">
        <PageWithFlagHoc />
      </Route>
      <Route path="/hooks">
        <PageHooks />
      </Route>
      <Route path="/switch">
        <PageFlagSwitch />
      </Route>
      <Route path="/solo-flag">
        <PageSoloFlag />
      </Route>
      {newFeatureFlag.variation === "on" && (
        <Route path="/new-feature">
          <PageNewFeature />
        </Route>
      )}
      <Redirect to="/with-flag-hoc" />
    </Switch>
  );
};

const useLoggedInUser = () => {
  const userId = React.useMemo(
    () => localStorage.getItem("example::user_id"),
    []
  );
  const savedEntity = useMemo(() => {
    const u = users.find((user) => user.id === userId);
    return u ? user2entity(u) : null;
  }, [userId]);

  const [currentEntity, setEntity] = useState(savedEntity);

  useEffect(() => {
    if (currentEntity) {
      localStorage.setItem("example::user_id", currentEntity.id);
    } else {
      localStorage.removeItem("example::user_id");
    }
  }, [currentEntity]);

  const setUserEntity = useCallback(
    (entity) => {
      setEntity(entity);
    },
    [setEntity]
  );
  return [currentEntity, setUserEntity];
};

export const Root = () => {
  const [userEntity, setUserEntity] = useLoggedInUser();
  const [state, setState] = useState({
    options: users.map((user) => ({
      user,
      name: user.email,
      value: user.id,
    })),
    entity: userEntity,
  });

  const onEntityChange = useCallback(
    (event) => {
      const value = event.target.value;
      const option = state.options.find((opt) => opt.value === value);
      const entity = option ? user2entity(option.user) : undefined;
      setUserEntity(entity);
      setState((state) => ({ ...state, entity }));
    },
    [state, setState, setUserEntity]
  );
  return (
    <currentEntityCtx.Provider value={{ ...state, onChange: onEntityChange }}>
      <BrowserRouter>
        <FlagProvider
          apiKey={flaggerConfig.apiKey}
          entity={state.entity}
          logLevel={flaggerConfig.logLevel}
          sourceURL={flaggerConfig.sourceURL}
          sseURL={flaggerConfig.sseURL}
          ingestionURL={flaggerConfig.ingestionURL}
        >
          {({ loading }) => (loading ? "Loading..." : <App />)}
        </FlagProvider>
      </BrowserRouter>
    </currentEntityCtx.Provider>
  );
};

export default () => <Root />;
