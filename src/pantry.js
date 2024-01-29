import './App.css';
import {useState} from 'react';
import {ActionButton,
  ButtonGroup,
  Column,
  Cell, 
  Divider, 
  Flex,
  Form, 
  Heading, 
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
  console.log(inventory);
  console.log(options);
  
  return (
    <Provider theme={darkTheme}>
      <div className="App" maxHeight={'90vh'} maxWidth={'100vw'}>
        <header className="App-header">
        <Button aria-label='Switch to Menu' marginBottom={'2%'} onPress={() => history('/bar')}>
          <Switch /><Text>Switch to Drink List</Text>
        </Button>
        <Heading level={5}>Pantry</Heading>
          <Flex gap={'5vh'} direction={'column'} alignItems={'center'}>
            
            <Divider />
            <DialogTrigger type='modal' alignItems={'center'}>
                <Button > <AddCircle /> <Text> New Ingredient </Text></ Button>
                {(close)=> (
                <Dialog size='S' maxWidth={'25vh'} minHeight={'20vh'}>
                  <Heading level={2}>New ingredient</Heading>
                  <Divider />
                  <Content>
                  <Form onSubmit={(e)=>{
                      e.preventDefault()
                      if(customIngr){
                        setInventory([...inventory, {key: inventory.length+1, name: customIngr, count: 0}]);
                        setOptions([...options, customIngr])
                      }
                      close()
                    }
                    }>
                    <TextField autoFocus onChange={(val) => customIngr = val}/>
                  <ButtonGroup>
                    <Button variant="secondary" onPress={close}>Cancel</Button>
                    <Button variant="accent" type='submit'>Add</Button>
                  </ButtonGroup>
                  </Form>
                  </Content>
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

