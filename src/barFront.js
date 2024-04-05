import './App.css';
import {useEffect, useState} from 'react';
import {Provider, defaultTheme, ProgressCircle} from '@adobe/react-spectrum';
import { Pantry } from './pantry';
import { Drinks } from './drinkMenu';


//The casing of the application
export function BarFront(props) {
    const {allDrinks} = props;
    const [inventory, setInventory] = useState([]);
    const [available, setAvailable] = useState([]);

    useEffect(()=>{
        setAvailable(drinkList(inventory, allDrinks));
    }, [inventory, allDrinks])

    //find what drinks can be made (within 3 ingredients) and list the missing ingredients if any
    function drinkList(pantry, ingr){
        //filter what can be made based of our ingredients
        const drinkable = ingr.filter((item) =>
        {
            let ingredientHave = 0;
            let totalIngredients = 0;

            item.recipe.forEach(el => {
                totalIngredients++;
                pantry.forEach(el2 =>
                {
                    if (el2.name.trim().toUpperCase() === el.toUpperCase()){
                        ingredientHave++;
                    }
                }
                )
            });
            return (totalIngredients - ingredientHave < 3 && ingredientHave > 0);
        })

        //find missing ingredients in the smaller list
        const result = drinkable.map((item) =>
        {
            let missing = []
            let found = false;

            item.recipe.forEach(el => {
                found = false;
                pantry.forEach(el2 =>
                {
                    if (el2.name.trim().toUpperCase() === el.toUpperCase()){
                        found = true;
                    }
                })
                //Add missing ingredient to the a list to be displayed
                if(!found){
                    missing.push(el);
                }
            });
            return {...item, missing: missing}
        })

        //sort based on amount of missing ingredients
        result.sort((a, b) => a.missing.length - b.missing.length);
        return result;
    }
    
    return (
        <Provider theme={defaultTheme} width={'100vw'} height={'100vh'}>
            <div className="App">
                <div className='inventory'>
                    <Pantry inventory={inventory} setInventory={setInventory} canStart={allDrinks.length > 0}/>
                </div>
                <div className="dTable">
                    {allDrinks.length > 0 ? <Drinks available={available} /> : <ProgressCircle aria-label="Loading…" isIndeterminate/>}
                </div>
            </div>
        </Provider>   
    );
}
