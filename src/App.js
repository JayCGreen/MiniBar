import './App.css';
import {useState, useEffect} from 'react';
import {BarFront} from './barFront';
import {Home} from './home'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

async function getDrinks() {
  //Get the drinks
  const dataCatcher = (async () => {
    let all = [];
    let letter = 'a';
    while (letter.charCodeAt(0) !== 'z'.charCodeAt(0) + 1){
      await fetch(`https://thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`).then((response) => {
          if(response.ok){
            response.json().then((list) => {
              all = list.drinks?.length > 0 ? all.concat(list.drinks) : all;
            })
            return all;
          }
      }).catch((error) => console.log(error))
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    }
    return all;
  })
  const data = await dataCatcher();
  let count = 0

  //format the data
  const ingr = data.map((item)=>
  {
      if (!item){
        console.log("Warning flag")
      }
      let parts = []
      let measurements = []
      let i = 1
      while (item[`strIngredient${i}`]){
        parts.push(item[`strIngredient${i}`])
        measurements.push(item[`strMeasure${i}`]);
        i++;
      }
      return {key: count++, name: item.strDrink, recipe: parts, instructions: item.strInstructions, measurements: measurements, missing: []}
  }
  )
  return ingr;
}


function App() {
  const [allDrinks, setAll] = useState([]);

  useEffect(()=>{
    if(allDrinks.length === 0) {
      getDrinks().then((result)=>{
        console.log("ready")
        setAll(result);
      })
    }
  })
  
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/bar' element={<BarFront allDrinks={allDrinks}/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
