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
  Text, defaultTheme, Button, DialogContainer, Dialog, DialogTrigger, TextField, Content} from '@adobe/react-spectrum';
import AddCircle from '@spectrum-icons/workflow/AddCircle'

const columns = [
  {id: 'name', name: 'Name'},
]

export function Pantry(props) {
  console.log(props)
  const {inventory, setInventory} = props
  const [options, setOptions] = useState([])
  const [c, setCount] = useState(0);
  let customIngr = '';
  console.log(inventory);
  console.log(options);

  function drinkOptions(name){
    return (2
      /*
      <MenuTrigger>
        <ActionButton variant='accent'>{name}</ActionButton>
        <Menu onAction={key =>
          {
            console.log(key)
            if(!inventory.find(item => item.name===name)){
              setInventory([...inventory, {key: c, name: name, count: key.valueOf()}])
              setCount(c+1)
            } else
              setInventory(inventory.map((item) => item.name === name ? {...item, count: parseInt(item.count) + parseInt(key)} : item))

          }
        }>
        </Menu>
      </MenuTrigger>
      */
    )
  }
  
  
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>Add ingredient</Heading>
          <Flex gap={'size-200'} width={1000} direction={'column'}>
            <Flex gap={'size-200'}>
              {options.map((item)=> <Button variant="accent" onPress={() => {
                 if(!inventory.find(s => s.name===item)){
                  setInventory([...inventory, {key: c, name: item, count: 0}]);
                  setCount(c+1);
                }
              }}>{item}</Button>)}
              <DialogTrigger type='popover'>
                <Button> <AddCircle /> <Text> New Ingredient </Text></ Button>
                {(close)=> (
                <Dialog size='S'>
                  <Heading level={2}>New ingredient</Heading>
                  <Divider />
                  <Content>
                    <TextField autoFocus onChange={(value) => customIngr = value}/>
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
            </Flex>
            <Divider />
            <Heading level={5}>Pantry</Heading>
            <TableView selectionMode="single" selectionStyle="highlight">
              <TableHeader columns={columns}>
                {(column) => (
                  <Column
                    key={column.id}
                  >
                    {column.name}
                  </Column>
                )}
              </TableHeader>
              <TableBody items={inventory}>
                {item =>(
                  <Row>
                    {columnKey => <Cell>{item[columnKey]}</Cell>}
                  </Row>
                )
                }
              </TableBody>
            </TableView>
            
            
          </Flex>
        </header>
      </div>
    </Provider>
  );
}

