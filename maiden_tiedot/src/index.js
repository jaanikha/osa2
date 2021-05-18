import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Filter = (props) => {
  let countries = props.countries;
  let filterText = props.filter;

  const countriesNew = countries.filter((country) =>
    country.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      Filter shown with{" "}
      <input value={filterText} onChange={props.handleFilter} />
      <CountriesList
        countriesNew={countriesNew}
        showCountry={props.showCountry}
      />
    </div>
  );
};

const CountriesList = (props) => {
  const countriesNewNew = props.countriesNew;
  console.log(countriesNewNew);

  if (countriesNewNew.length === 0) {
    return <p>no matches </p>;
  }

  if (countriesNewNew.length === 1) {
    return (
      <div>
        <h2>{countriesNewNew[0].name}</h2>
        <p>capital {countriesNewNew[0].capital} </p>
        <p>population {countriesNewNew[0].population} </p>
        <h3>languages</h3>
        <ul>
          {" "}
          {countriesNewNew[0].languages.map((language) => (
            <p key={language.name}>
              {" "}
              <li>{language.name}</li>{" "}
            </p>
          ))}{" "}
        </ul>{" "}
        <br />
        <img
          src={countriesNewNew[0].flag}
          alt={countriesNewNew[0].name}
          width="150"
          height="100"
        ></img>
      </div>
    );
  }

  if (countriesNewNew.length <= 10) {
    return (
      <div>
        {countriesNewNew.map((country) => (
          <div key={country.name}>
            <li>
              {country.name}
              <button onClick={() => props.showCountry(country.name)}>
                Country
              </button>
            </li>
          </div>
        ))}
      </div>
    );
  } else {
    return <p> Too many matches, specify the filter </p>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      console.log("promise fulfilled");
      setCountries(response.data);
    });
  }, []);
  console.log("render", countries.length, "countries");

  const handleFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  const showCountry = (name) => {
    console.log("asdasd");
    setNewFilter(name);
  };

  return (
    <div>
      <h1>Countries</h1>
      <ul>
        <Filter
          countries={countries}
          filter={filter}
          handleFilter={handleFilter}
          showCountry={showCountry}
        />
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
