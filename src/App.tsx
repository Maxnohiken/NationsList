import React, { useEffect, useState } from 'react';
import './App.css';

interface CountryData {
  name: { common: string };
  region: string;
  languages: { [key: string]: string };
  latlng: number[];
}

function App() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [favourites, setFavourites] = useState<CountryData[]>([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/region/europe');
        const data: CountryData[] = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
      }
    };

    fetchData();
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  const onChangeFav = () => {
    setChange(true);
  };

  const onChangeList = () => {
    setChange(false);
  };

  const addToFavourites = (country: CountryData) => {
    if (favourites.find((fav) => fav.name.common === country.name.common)) {
      // Se l'elemento è già presente, lo rimuoviamo
      const newFavourites = favourites.filter((fav) => fav.name.common !== country.name.common);
      setFavourites(newFavourites);
      localStorage.setItem('favourites', JSON.stringify(newFavourites));
    } else {
      // Altrimenti, lo aggiungiamo
      const newFavourites = [...favourites, country];
      setFavourites(newFavourites);
      localStorage.setItem('favourites', JSON.stringify(newFavourites));
    }
  };

  const removeFromFavourites = (country: CountryData) => {
    const newFavourites = favourites.filter((fav) => fav.name.common !== country.name.common);
    setFavourites(newFavourites);
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
  }; 

  if (!change) return (
    <div className="container mx-auto px-4">
      <div> 
        <h1 className="text-3xl font-bold my-8">Lista Paesi Europei</h1>
        <button onClick={onChangeFav}>Luoghi visitati</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">{country.name.common}</h2>
            <p><span className="font-semibold">Regione:</span> {country.region}</p>
            <p><span className="font-semibold">Lingue:</span> {Object.values(country.languages).join(', ')}</p>
            <p><span className="font-semibold">Latitudine:</span> {country.latlng[0]}</p>
            <p><span className="font-semibold">Longitudine:</span> {country.latlng[1]}</p>
            <button onClick={() => {addToFavourites(country)}}>
            {favourites.find(fav => fav.name.common === country.name.common) ? "Aggiunto" : "Aggiungi"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

else return (
<div className="container mx-auto px-4">
  <div className=''>
    <h1 className="text-3xl font-bold my-8">Luoghi visitati</h1>
    <button onClick={onChangeList} className=''>Ritorna all'Elenco</button> 
  </div> 
{favourites.map((favourite,index) => (
  <div>
    <div key={index} className="border p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">{favourite.name.common}</h2>
      <p><span className="font-semibold">Regione:</span> {favourite.region}</p>
      <p><span className="font-semibold">Lingue:</span> {Object.values(favourite.languages).join(', ')}</p>
      <p><span className="font-semibold">Latitudine:</span> {favourite.latlng[0]}</p>
      <p><span className="font-semibold">Longitudine:</span> {favourite.latlng[1]}</p>
      <button onClick={()=> {removeFromFavourites(favourite)}}>Rimuovi</button>
    </div>
  </div>
)
)}
</div>
)  
};


export default App;
