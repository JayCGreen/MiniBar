import './App.css';
import {useState, useEffect} from 'react';
import {ActionButton, 
    Column,
    Cell, 
    Divider, 
    Flex, 
    Heading, 
    Provider,
    Row,
    TableBody,
    TableView,
    TableHeader,defaultTheme, darkTheme} from '@adobe/react-spectrum';
import {Pantry} from './pantry'
import {Home} from './home'
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom';

const columns = [
  {id: 'name', name: 'Name'},
  {id: 'recipe', name: 'Recipe'}
]

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
    let count=0;
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
        return {key: count++, name: item.strDrink, recipe: ans}
      }
    )
    
    const possible = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      
      item.recipe.forEach(element => {
        pantry.forEach(el2 =>
          {
            if (el2.name.toUpperCase() === element.toUpperCase()) {ingredientHave++};
          }
        )
      });
      return item.recipe.length - ingredientHave === 0
    }
    )

    const missing1 = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      let lost = [];
      item.recipe.forEach(element => {
        lost.push(element)
        pantry.forEach(el2 =>
          {
            if (el2.name.toUpperCase() === element.toUpperCase()) {
              ingredientHave++;
              lost.pop()
            }
          }
        )
        
      });
      return item.recipe.length - ingredientHave === 1
    }
    )

    const missing2 = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      let lost = [];
      item.recipe.forEach(element => {
        lost.push(element)
        pantry.forEach(el2 =>
          {
            if (el2.name.toUpperCase() === element.toUpperCase()) {
              ingredientHave++;
              lost.pop()
            }
          }
        )
        
      });
      return item.recipe.length - ingredientHave === 2
    }
    )
    return {possible, missing1, missing2}
  }

  function displayList(missingX){
    let items = []
    switch (missingX){
      case 0: 
        items = available.possible;
        break;
      case 1:  
        items = available.missing1;
        break;
      case 2:  
        items = available.missing2;
        break;
    }
    return (
      <TableView selectionMode="single" selectionStyle="highlight" maxHeight={'500px'}>
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              key={column.id}
            >
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={items}>
          {item =>(
            <Row>
              {columnKey => columnKey==='recipe'?<Cell>{item[columnKey].join(', ')}</Cell> : <Cell>{item[columnKey]}</Cell>}
            </Row>
          )
          }
        </TableBody>
        </TableView>
    )
  }
  console.log(available?.possible)
  console.log(inventory)

  return (
    <Provider theme={darkTheme}>
      <div className="App">
        <header className="App-header">
        <Flex gap={'size-150'} direction={'row'} width={'100%'}>
          <Flex direction={'column'} width={'32%'}>
          <Heading level={5}>Can make</Heading>
            {available ? displayList(0) : null}
          </Flex>
          <Divider orientation='vertical' />
          <Flex direction={'column'} width={'32%'}>
          <Heading level={5}>Missing One Ingredient</Heading>
            {available ? displayList(1) : null}
          </Flex>
          <Divider orientation='vertical'/>
          <Flex direction={'column'} width={'32%'}>
          <Heading level={5}>Missing Two Ingredient</Heading>
            {available ? displayList(2) : null}
          </Flex>
        </Flex>
        </header>
      </div>
    </Provider>
    
  );
}
