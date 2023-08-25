import './App.css';
import {useState} from 'react';
import {Pantry} from './pantry'
import { Drinks } from './drinkMenu';
import {Home} from './home'
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom'

async function getDrinks() {
  fetch('https://thecocktaildb.com/api/json/v1/1/search.php?f=a').then((response) => {
    if(response.ok){
      response.json().then((list) => console.log(list))
    }else{
      console.log("error connecting to drink api")
    }
  })
}

function App() {
  const [inventory, setInventory] = useState([]);
  const [c, setCount] = useState(0);
  console.log(inventory)
  getDrinks()
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/pantry' element={<Pantry inventory={inventory} setInventory={setInventory}/>} /> 
        <Route path='/bar' element={<Drinks inventory={inventory} />} /> 
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
