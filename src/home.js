import './App.css';
import {
  Flex, 
  Heading, 
  Provider,
  defaultTheme,
  Button} from '@adobe/react-spectrum';
import {useNavigate} from 'react-router-dom'

export function Home() {
  const history = useNavigate()
    
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>MiniBar</Heading>
          <Flex gap={'size-200'} direction={'column'}>
            <Button variant='accent' onPress={() => history('/pantry')}>Pantry</Button>
            <Button variant='accent' onPress={() => history('/bar')}>See Drinks</Button>
          </Flex>
        </header>
      </div>
    </Provider>
  );
}

