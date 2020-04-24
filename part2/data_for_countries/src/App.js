import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


const Search = ({value, handler}) => {
  return (
    <>
      find countries 
      <input value={value} onChange={handler}/>
      <br></br>
    </>
  )
}

const Countries = ({countries, search}) => {
  const searchCountry = countries
    .filter(country => 
      country.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  const [showCountry, setShowCountry] = useState('')


  if (searchCountry.length > 10) {
    return (
      <>
        Too many matches, specify another filter
      </>
    )
  }

  else if (searchCountry.length > 1) {
    return (
      <>
        {searchCountry.map(country => 
          <div key={country.name}>
            {country.name} <button onClick={() => setShowCountry(country)}>show</button><br></br>
          </div>
        )}
        {showCountry === '' ? '': <Country country={showCountry}/>}
      </>
    )
  }
  else if (searchCountry.length === 1) {
    return(
      <>
        <Country country={searchCountry[0]}/>
      </>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}

const Country = ({country}) => {
  const [weather, setWeather] = useState('')
  
  useEffect(() => {  
    const api_key = process.env.REACT_APP_API_KEY
    axios
      .get('http://api.weatherstack.com/current?access_key='+api_key+'&query='+country.capital)
      .then(response => {
        setWeather(response.data)
      })
  },[])

  const getWeather = () => {
    if (weather === '') {return(<></>)}
    return(
      <>
        <b>temperature:</b> {weather.current.temperature} Celsius<br></br>
        <img src={weather.current.weather_icons}/><br></br>
        <b>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir} </b>
      </>
    )
  }

  return (
    <>
      <h2>{country.name}</h2>
      capital {country.capital}<br></br>
      population {country.population}
      <h3>Spoken languages</h3>
      <ul>
        {country.languages
          .map(language => {
            return(
              <li key={language.name}>{language.name}</li>
            )}
          )
        }
      </ul>
      <img src={country.flag}/>
      <h3>Weather in {country.capital}</h3>
      {getWeather()}
    </>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    axios
      .get('http://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  return (
    <div>
      <Search value={search} handler={handleSearch}/>
      <Countries countries={countries} search={search}/>
    </div>
  );
}

export default App;
