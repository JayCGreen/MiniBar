import './App.css';
import {useState, useEffect} from 'react';
import {
    Button,
    Column,
    Cell, 
    Divider, 
    Flex, 
    Heading, 
    Provider,
    Row,
    TableBody,
    TableView,
    TableHeader,
    Text,
    defaultTheme, ProgressCircle, darkTheme, DialogContainer, Dialog, Content} from '@adobe/react-spectrum';
import {Pantry} from './pantry'
import {Home} from './home'
import {BrowserRouter, Route, Router, Routes, useNavigate} from 'react-router-dom';
import Switch from '@spectrum-icons/workflow/Switch'

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

function clToOunce(measure){
    let value = parseFloat(measure.split(' ')[0]) *  0.33814;
    let wholeNum = Math.floor(value);
    let decimal = value - wholeNum;
    let fraction ='';
    let nearestFourth = [Math.abs(decimal-.25), Math.abs(decimal-.5), Math.abs(decimal-.75), Math.abs(decimal-1)];
    let minF = 2;
    nearestFourth.forEach((num, i) => {
      if (nearestFourth[minF] > num) minF = i;
    })
    let nearestThird = [Math.abs(decimal-.33), Math.abs(decimal-.66), Math.abs(decimal-1)];
    let minT = 0;
    nearestThird.forEach((num, i) => {
      if (nearestThird[minT] > num) minT = i;
    })
    if(nearestThird[minT] > nearestFourth[minF]){
      switch (minF){
        case 0:
          fraction='1/4'
          if (wholeNum == 0) return '1 tsp'
          break
        case 1:
          fraction = '1/2'
          if (wholeNum == 0) return '1 tbsp'
          break
        case 3:
          fraction = '3/4'
          break
        default:
          wholeNum++;
      } 
    }else{
      switch (minT){
        case 0:
          fraction='1/3'
          if (wholeNum == 0) return '1 tsp'
          break
        case 1:
          fraction = '2/3'
          if (wholeNum == 0) return '1 tblsp'
          break
        default:
          wholeNum++;
      } 
    }

    if (wholeNum == 0 && Math.max(minF, minT) <= 1){
      if (Math.max(minF, minT) == 0){
        return `${parseInt(decimal*6)} tsp`
      }
      return `${parseInt(decimal*2)} tbsp`
    }
    
    return `${wholeNum > 0 ? wholeNum : ''} ${fraction} oz`
}


export function Drinks(props) {
  const {inventory} = props;
  const [options, setOptions] = useState();
  const [available, setAvailable] = useState();
  const [selected, setSelection] = useState(false);
  const history = useNavigate();
  console.log(options);
  
  useEffect(()=>{
    if(!options) {
      getDrinks().then((result) => {
        setOptions(result)
        console.log(result)
        setAvailable(drinkList(result, inventory))
        console.log(available)
      })     
    }
  })
  console.log(available)
  

  function drinkList(totalList, pantry){
    let count = 0
    const ingr = totalList.map((item)=>
      {
        if (!item){
          console.log("Warning flag")
        }
        let parts = new Array()
        let measurements = new Array()
        let i = 1
        while (item[`strIngredient${i}`]){
          parts.push(item[`strIngredient${i}`])
          //console.log(item[`strMeasure${i}`])
          measurements.push(item[`strMeasure${i}`]?.includes(' cl') ? 
            clToOunce(item[`strMeasure${i}`]) : item[`strMeasure${i}`])
          i++;
        }
        return {key: count++, name: item.strDrink, recipe: parts, instructions: item.strInstructions, measurements: measurements}
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
            if (el2.name.toUpperCase() === element.toUpperCase()) ingredientHave++;
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
            if (el2.name.toUpperCase() === element.toUpperCase())
            {
              ingredientHave++;
            }
          }
        )
      });
      return totalIngredients - ingredientHave === 1
    }
    )

    const missing2 = ingr.filter((item) =>
    {
      let ingredientHave = 0;
      let totalIngredients = 0;
      item.recipe.forEach(element => {
        totalIngredients ++;
        pantry.forEach(el2 =>
          {
            if (el2.name.toUpperCase() === element.toUpperCase())
            {
              ingredientHave++;
            }
          }
        )
      });
      return totalIngredients - ingredientHave === 2
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
      <TableView selectionMode="single" selectionStyle="highlight" maxHeight={'500px'} minWidth={'80%'}
      onSelectionChange={(item) => {
        switch (missingX){
          case 0: 
             setSelection(available.possible.find((drink)=> item.currentKey === drink.key))
            break;
          case 1:  
            setSelection(available.missing1.find((drink)=> item.currentKey === drink.key));
            break;
          case 2:  
            setSelection(available.missing2.find((drink)=> item.currentKey === drink.key));
            break;
        }
      }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column align='center'
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
  //console.log(available?.possible.find((item)=> item.key ===selected))
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Button aria-label='Switch to Menu' margin={'5%'} onPress={() => history('/pantry')}>
            <Switch /><Text>Switch to Pantry</Text>
          </Button>
        <Flex gap={'size-150'} direction={ window.innerWidth > 500? 'row' : 'column'} width={'100%'}>
          <Flex direction={'column'} width={window.innerWidth > 500? '32%' : '90vw'} alignItems={'center'}>
          <Heading level={5}>Can make</Heading>
            {available ? displayList(0) : <ProgressCircle aria-label="Loading…" isIndeterminate />}
          </Flex>
          <Divider orientation='vertical' />
          <Flex direction={'column'} width={window.innerWidth > 500? '32%' : '90vw'} alignItems={'center'}>
          <Heading level={5}>Missing One Ingredient</Heading>
            {available ? displayList(1) : <ProgressCircle aria-label="Loading…" isIndeterminate />}
          </Flex>
          <Divider orientation='vertical'/>
          <Flex direction={'column'} width={window.innerWidth > 500? '32%' : '90vw'} alignItems={'safe center'}>
          <Heading level={5}>Missing Two Ingredients</Heading>
            {available ? displayList(2) : <ProgressCircle aria-label="Loading…" isIndeterminate />}
          </Flex>
          <DialogContainer onDismiss={()=>setSelection(false)} isDismissable isKeyboardDismissDisabled={false}>
            {
              selected && (
                <Dialog>
                  <Heading level={5}>{selected.name}</Heading>
                  <Content>
                    <Flex gap={'size-150'} direction={'column'}>
                      <Text>Recipe: {selected.recipe.map(( v, i) => selected.measurements[i] ? 
                        `${selected.measurements[i]} of ${v}` : v).join(', ')}</Text>
                      <Divider size='S'/>
                      <Text>
                        {selected.instructions}
                      </Text>
                    </Flex>
                  </Content>
                </Dialog>
              )
            }

          </DialogContainer>
        </Flex>
        </header>
      </div>
    </Provider>
    
  );
}
