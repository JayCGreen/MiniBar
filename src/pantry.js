import './App.css';
import {useState} from 'react';
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

const columns = [
  {id: 'name', name: 'Name'},
  {id: 'count', name: 'Amount'}
]

export function Pantry(props) {
  console.log(props)
  const {inventory, setInventory} = props
  const [c, setCount] = useState(0);
  console.log(inventory)

  function drinkOptions(name){
    return (
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
          <Item key={25}>25oz (Fifth)</Item>
          <Item key={33}>33oz (Liter)</Item>
          <Item key={60}>60oz (Handle)</Item>
        </Menu>
      </MenuTrigger>
    )
  }
  
  
  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Heading level={5}>Add ingredient</Heading>
          <Flex gap={'size-200'} direction={'column'}>
            <Flex gap={'size-200'}>
              {drinkOptions('Vodka')}
              {drinkOptions('Gin')}
              {drinkOptions('Tequila')}
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

