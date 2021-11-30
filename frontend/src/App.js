import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Modal from "./components/Modal";
import Habit from "./components/Habit";
import Pomodoro from "./components/Pomodoro";
import AddHabit from "./components/AddHabit";
import hamburger from "./assets/icons/hamburger.svg";
import "./App.scss";

const App = () => {
  const [habitList, setHabitList] = useState([]);
  const [navModal, setNavModal] = useState(false);
  const openNav = () => setNavModal(true);
  const closeNav = () => setNavModal(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (mountedRef.current) {
      window.backend.Habits.GetHabits().then((response) => {
        console.log(response);
        setHabitList(response);
        // TODO: why is this habitList still null? It says it's trying to set state on unmounted component
      });
    }
    return () => (mountedRef.current = false);
  }, []);

  return (
    <div className="app">
      <div className="container">
        <img
          className="hamburger"
          src={hamburger}
          alt="open menu"
          onClick={openNav}
        />
        <Router>
          <Switch>
            {navModal ? (
              <Modal closeModal={closeNav} habitList={habitList} />
            ) : null}
            <Route path="/pomodoro" exact component={Pomodoro} />
            <Route
              path="/new"
              exact
              render={(props) => (
                <AddHabit setHabitList={setHabitList} habitList={habitList} />
              )}
            />
            <Route
              path="/:name"
              render={(props) => <Habit habitList={habitList} />}
            />
            <Route
              path="/"
              exact
              render={(props) => <Habit habitList={habitList} />}
            />
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default App;
