import './App.css';
import {useState} from 'react';
import {ActionButton,
  ButtonGroup,
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
  Text, defaultTheme, Button, Dialog, DialogTrigger, TextField, Content, darkTheme} from '@adobe/react-spectrum';
import AddCircle from '@spectrum-icons/workflow/AddCircle'

const columns = [
  {id: 'name', name: 'Name'},
]

export function Pantry(props) {
  console.log(props)
  const {inventory, setInventory} = props
  const [options, setOptions] = useState([])
  let customIngr = '';
  console.log(inventory);
  console.log(options);
  
  return (
    <Provider theme={darkTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>Add ingredient</Heading>
          <Flex gap={'size-200'} width={1000} direction={'column'}>
            <Flex gap={'size-200'}>
              {options.map((item)=> <Button variant="accent" onPress={() => {
                 if(!inventory.find(s => s.name===item)){
                  setInventory([...inventory, {key: inventory.length+1, name: item, count: 0}]);
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
                      setInventory([...inventory, {key: inventory.length+1, name: customIngr, count: 0}]);
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

