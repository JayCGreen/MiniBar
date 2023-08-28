import './App.css';
import {useState, useEffect} from 'react';
import {ActionButton, 
    Column,
    Cell, 
    Divider, 
    Flex, 
    Heading, 
    Item, 
    Menu, 
    MenuTrigger,
    Provider,
    Row,
    TableBody,
    TableView,
    TableHeader,defaultTheme} from '@adobe/react-spectrum';
import {Pantry} from './pantry'
import {Home} from './home'
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom'

async function getDrinks() {
    let allDrinks = [];
    let letter = 'a';
    const dataCatcher = (async () => {
      while (letter.charCodeAt(0) !== 'z'.charCodeAt(0) + 1){
        await fetch(`https://thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`).then((response) => {
            if(response.ok){
            response.json().then((list) => {
              allDrinks = list.drinks?.length > 0 ? allDrinks.concat(list.drinks) : allDrinks
            })
            return allDrinks;
            }
        }).catch((error) => console.log(error))
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      }
      return allDrinks
    })
    const data = await dataCatcher();
    return data;
}

export function Drinks(props) {
  const {inventory} = props;
  const [options, setOptions] = useState();
  const [available, setAvailable] = useState();
  console.log(options);
  
  useEffect(()=>{
    if(!options) {
      getDrinks().then((result) => {
        setOptions(result)
        setAvailable(drinkList(result, inventory))
      })     
    }
  })
  console.log(available)
  

  function drinkList(totalList, pantry){
    const ingr = totalList.map((item)=>
      {
        if (!item){
          console.log("Warning flag")
        }
        let ans = new Array()
        let i = 1
        while (item[`strIngredient${i}`]){
          ans.push(item[`strIngredient${i}`])
          i++;
        }
        return {name: item.strDrink, recipe: ans}
      }
    )
    
    const possible = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      let totalIngredients = 0;
      item.recipe.forEach(element => {
        totalIngredients ++;
        pantry.forEach(el2 =>
          {
            if (el2.name === element) ingredientHave++;
          }
        )
      });
      return totalIngredients - ingredientHave === 0
    }
    )

    const missing1 = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      let totalIngredients = 0;
      item.recipe.forEach(element => {
        totalIngredients ++;
        pantry.forEach(el2 =>
          {
            if (el2.name === element) ingredientHave++;
          }
        )
      });
      return totalIngredients - ingredientHave === 1
    }
    )
    return {possible, missing1}
  }

  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>Can make</Heading>
          <Flex gap={'size-200'} direction={'column'}>
            
          </Flex>
        </header>
      </div>
    </Provider>
    
  );
}
