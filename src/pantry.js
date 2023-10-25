import './App.css';
import {useState} from 'react';
import {ActionButton,
  ButtonGroup,
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
  TableHeader,
  Text, defaultTheme, Button, Dialog, DialogTrigger, TextField, Content, darkTheme} from '@adobe/react-spectrum';
import {useNavigate} from 'react-router-dom'
import AddCircle from '@spectrum-icons/workflow/AddCircle'
import Close from '@spectrum-icons/workflow/Close'
import Switch from '@spectrum-icons/workflow/Switch'

const columns = [
  {id: 'name', name: 'Name'},
]

export function Pantry(props) {
  console.log(props)
  const {inventory, setInventory} = props
  const [options, setOptions] = useState([])
  const history = useNavigate();
  let customIngr = '';
  
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
        <Button aria-label='Switch to Menu' marginBottom={'size-200'} onPress={() => history('/bar')}>
          <Switch /><Text>Switch to Drink List</Text>
        </Button>
        <Heading level={5}>Pantry</Heading>
          <Flex gap={'size-400'} width={1000} direction={'column'} alignItems={'center'}>
            
            <Divider />
            <DialogTrigger type='popover'>
                <Button > <AddCircle /> <Text> New Ingredient </Text></ Button>
                {(close)=> (
                <Dialog size='S'>
                  <Heading level={2}>New ingredient</Heading>
                  <Divider />
                  <Content>
                    <TextField autoFocus onChange={(value) => customIngr = value} onKeyDown={e => {
                      if (e.code=== 'Enter'){
                        setOptions([...options, customIngr])
                        setInventory([...inventory, {key: inventory.length+1, name: customIngr, count: 0}]);
                        close()
                      }
                      }}/>
                  </Content>
                  
                  <ButtonGroup>
                    <Button variant="secondary" onPress={close}>Cancel</Button>
                    <Button variant="accent" onPress={() => 
                    {
                      setOptions([...options, customIngr])
                      setInventory([...inventory, {key: c, name: customIngr, count: 0}]);
                      setCount(c+1)
                      close()
                      }}>Add</Button>
                  </ButtonGroup>
                </Dialog>)
                }
            </DialogTrigger>
            <ButtonGroup>
              {inventory.map((item)=> 
              <Button variant="accent" onPress={() => setInventory(inventory.filter((j) => {
                console.log(item.name !== j.name)
                return item.name !== j.name
                
                }))}>
                <Text>{item.name}</Text><Close alignSelf={'center'} size='S'/>
              </Button>)}
            </ButtonGroup>
          </Flex>
        </header>
      </div>
    </Provider>
  );
}

