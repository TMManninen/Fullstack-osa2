import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {

    const [countries, setCountries] = useState([])
    const [toShow, setToShow] = useState('')

    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleFiltering = (event) => {
        setToShow(event.target.value)
    }

    const showInfo = (result) => {
        console.log(result)
        console.log(result.flags)
        return (
            <div>
            <h1>{result.name.common}</h1>
                <p>capital {result.capital}</p>
                <p>area {result.area}</p>
                <h3>languages:</h3>
                <ul>
                    {Object.values(result.languages)
                        .map((language, i) =>
                            <li key={i}>{language}</li>
                            )}
                </ul>
                <img src={result.flags.png} alt="Flag" width="250" height="200" />
            </div>
            )
    }

    


    const countriesToShow = () => {
        const result = countries.filter(country => country.name.common.toLowerCase().includes(toShow.toLowerCase()))
        if (result.length > 10) return <p>Too many matches, specify another filter</p>

        if (result.length == 1) return showInfo(result[0])

        return (
            result.map((country) => (
                <div key={country.name.common}>{country.name.common}</div>
             
            ))
        )

    }
    

    return (
        <div>
            filter shown with <input
                value={toShow}
                onChange={handleFiltering}
            />
            {countriesToShow()}
        </div>

    )

}


export default App;
