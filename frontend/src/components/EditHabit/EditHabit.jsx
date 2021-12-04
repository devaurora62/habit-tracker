import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import close from "../../assets/icons/remove.svg";
import "./EditHabit.scss";

const EditHabit = ({
  habit,
  setHabit,
  setEditOpen,
  updateHabits,
  habitList,
}) => {
  const [tempHabit, setTempHabit] = useState(habit);
  const history = useHistory();

  const deleteHabit = () => {
    window.backend.MySQLHabitRepository.DeleteHabit(habit.id);
    updateHabits();
    history.push("/");
  };

  const EditHabit = () => {
    window.backend.MySQLHabitRepository.EditHabitFromJSON(
      JSON.stringify(tempHabit)
    )
      .then(() => {
        updateHabits();
      })
      .catch((err) => {
        console.error(err);
      });

    setEditOpen(false);
  };

  const isValidName = () => {
    let exists = habitList.filter((habit) => habit.name === tempHabit.name);
    return tempHabit.name && exists.length === 1;
  };

  const isValidForm = () => {
    if (isValidName() && tempHabit.unit && tempHabit.why) {
      return true;
    }
    return false;
  };

  return (
    <div className="edit-habit">
      <img
        className="edit-habit__close"
        src={close}
        alt="close"
        onClick={() => {
          setEditOpen(false);
        }}
      />
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          EditHabit();
          // TODO: can I remove this setHabit? seems to be needed for current render...
          setHabit({
            name: tempHabit.name,
            unit: tempHabit.unit,
            why: tempHabit.why,
          });
        }}
      >
        <h1 className="form__title">Edit Habit</h1>
        <label className="form__label" htmlFor="name">
          habit name
        </label>
        <input
          className={
            isValidName() ? "form__input" : "form__input form__input--error"
          }
          name="name"
          id="name"
          type="text"
          placeholder="yoga"
          value={tempHabit.name}
          onChange={(e) => setTempHabit({ ...tempHabit, name: e.target.value })}
        />
        <label className="form__label" htmlFor="unit">
          unit of measure
        </label>
        <input
          className={
            tempHabit.unit ? "form__input" : "form__input form__input--error"
          }
          name="unit"
          id="unit"
          type="text"
          placeholder="hours"
          value={tempHabit.unit}
          onChange={(e) => setTempHabit({ ...tempHabit, unit: e.target.value })}
        />
        <label className="form__label" htmlFor="why">
          why
        </label>
        <input
          className={
            tempHabit.why ? "form__input" : "form__input form__input--error"
          }
          name="why"
          id="why"
          type="text"
          placeholder="I want to do yoga because..."
          value={tempHabit.why}
          onChange={(e) => setTempHabit({ ...tempHabit, why: e.target.value })}
        />
        <div className="form__btn-container">
          <button
            className={isValidForm() ? "form__btn" : "form__btn form__btn--error"}
            type="submit"
            disabled={!isValidForm()}
          >
            {isValidForm() ? "save" : "invalid form"}
          </button>
          <button
            className="form__btn form__btn--reset"
            onClick={(e) => {
              e.preventDefault();
              setEditOpen(false);
            }}
          >
            cancel
          </button>
          <button className="form__btn form__btn--delete" onClick={deleteHabit}>
            delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHabit;
