import './App.css';
import {useState} from 'react';
import {
  Flex, 
  Heading, 
  Provider,
  defaultTheme,
  Button} from '@adobe/react-spectrum';
import {useNavigate} from 'react-router-dom'

export function Home() {
  const [inventory, setInventory] = useState([]);
  const [c, setCount] = useState(0);
  console.log(inventory)
  const history = useNavigate()
    
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>MiniMix</Heading>
          <Flex gap={'size-200'} direction={'column'}>
            <Button variant='accent' onPress={() => history('/pantry')}>Pantry</Button>
            <Button variant='accent'>See Drinks</Button>
          </Flex>
        </header>
      </div>
    </Provider>
  );
}

