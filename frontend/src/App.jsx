import { useEffect, useState } from "react";
import personService from "./services/persons";

const Filter = ({ newFilter, setNewFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={newFilter} onChange={(e) => setNewFilter(e.target.value)} />
    </div>
  );
};

const Form = ({ props }) => {
  const [
    persons,
    setPersons,
    newName,
    setNewName,
    newNumber,
    setNewNumber,
    setNotifyMessage,
    setNotifyColor,
  ] = [...props];

  const addPerson = (e) => {
    e.preventDefault();

    if (!newName) return;
    if (persons.find((p) => p.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updateNumber(persons.find((p) => p.name === newName));
      }
      return;
    }
    personService
      .create({ name: newName, number: newNumber })
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");

        showNotificationFiveSec(`Added ${response.data.name}`);
      });
  };

  const showNotificationFiveSec = (message) => {
    setNotifyColor("green");
    setNotifyMessage(message);
    setTimeout(() => {
      setNotifyMessage(null);
    }, 5000);
  };

  const updateNumber = (person) => {
    const updatedPerson = {
      name: person.name,
      number: newNumber,
    };
    personService.update(person.id, updatedPerson).then(() => {
      personService.getAll().then((response) => setPersons(response));
      setNewName("");
      setNewNumber("");

      showNotificationFiveSec(`Updated number for ${person.name}`);
    });
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({
  persons,
  setPersons,
  newFilter,
  setNotifyMessage,
  setNotifyColor,
}) => {
  const visiblePersons =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  const deletePerson = (delPerson) => {
    if (window.confirm(`Delete ${delPerson.name}`)) {
      personService.remove(delPerson.id).catch(() => {
        setNotifyColor("red");
        setNotifyMessage(
          `Information of ${delPerson.name} has already been removed from this server`
        );
        setTimeout(() => {
          setNotifyMessage(null);
        }, 5000);
      });
      setPersons(persons.filter((p) => p.id !== delPerson.id));
    }
  };

  return (
    <div>
      {visiblePersons.map((person) => {
        return (
          <div key={person.name}>
            <div>
              {person.name} {person.number}{" "}
              <button onClick={() => deletePerson(person)}>delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Notification = ({ message, notifyColor }) => {
  if (message === null) return null;

  const notifyStyle = {
    color: notifyColor,
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={notifyStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [notifyColor, setNotifyColor] = useState("green");

  // useEffect(() => {
  //   fetch("http://localhost:3001/persons")
  //     .then((response) => response.json())
  //     .then((data) => setPersons(data));
  // }, []);

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifyMessage} notifyColor={notifyColor} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      <h2>add a new</h2>
      <Form
        props={[
          persons,
          setPersons,
          newName,
          setNewName,
          newNumber,
          setNewNumber,
          setNotifyMessage,
          setNotifyColor,
        ]}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        setPersons={setPersons}
        newFilter={newFilter}
        setNotifyMessage={setNotifyMessage}
        setNotifyColor={setNotifyColor}
      />
    </div>
  );
};

export default App;
