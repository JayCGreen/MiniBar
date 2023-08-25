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

async function getDrinks(setOp) {
    let allDrinks;
    fetch('https://thecocktaildb.com/api/json/v1/1/search.php?f=a').then((response) => {
        if(response.ok){
        response.json().then((list) => {
          allDrinks = list
          setOp(allDrinks)
          console.log(allDrinks)
        })
        }else{
        allDrinks = null;
        }
    })
    return allDrinks;
}

export function Drinks(props) {
  const {inventory} = props;
  console.log(inventory)
  const [options, setOptions] = useState()

  async function drinkList(totalList, pantry){
    const ingr = totalList.map((item)=>
      {
        let ans = new Array()
        let i = 1
        while (item[`strIngredient${i}`]){
          ans.push(item[`strIngredient${i}`])
          i++;
        }
        return {name: item.strDrink , recipe: ans}
      }
    )
    
    const possible = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      item.recipe.forEach(element => {
        pantry.forEach(el2 =>
          {
            if (el2.name === element) ingredientHave++;
          }
        )
      });
      return ingredientHave > 0
    }
    )
    return possible
  }

  useEffect(()=>{
    if(!options) {
      getDrinks(setOptions);
    }
    
  })

  const canMake = (options) ? drinkList(options.drinks, inventory).then((result) => (result)) : null
  console.log(canMake)

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
