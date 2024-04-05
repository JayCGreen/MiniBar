import './App.css';
import {useState} from 'react';
import {
  ButtonGroup,
  Divider, 
  Flex,
  Footer,
  Form,
  Heading, 
  Text, Button, Dialog, DialogTrigger, TextField, Content} from '@adobe/react-spectrum';
import AddCircle from '@spectrum-icons/workflow/AddCircle';
import Edit from '@spectrum-icons/workflow/Edit';

export function Pantry(props) {
  const {inventory, setInventory, canStart} = props;
  const [ingredient, setIngredient] = useState('');
  
  return (
      <DialogTrigger alignItems={'center'}>
          <Button variant={'accent'} isDisabled={!canStart}> <Text>See Ingredients</Text></ Button>
          {(close)=> (
            <Dialog size={'L'} isDismissable>
              <Heading>Available Ingredients</Heading>
              <Divider />
              <Content>
                <ButtonGroup>
                  {inventory?.map((item)=> 
                    <Button key={item.key} variant="accent" onPress={() => {
                        setInventory(inventory.filter((el) => item.name !== el.name));
                        setIngredient(item.name);
                      }}>
                      <Text>{item.name} </Text> <Edit justifySelf={'start'} alignSelf={'end'} size='S'/>
                    </Button>)
                  }
                </ButtonGroup>
              </Content>
              <Footer>
                <Form onSubmit={(e)=>{
                    e.preventDefault()
                    if(ingredient){
                      setInventory([...inventory, {key: inventory.length+1, name: ingredient}]);
                      setIngredient('');
                    }
                  }
                  }>
                  <Flex direction={'row'}>
                  <TextField autoFocus value={ingredient} onChange={(val)=> setIngredient(val)} label={'Add New Ingredient'}/>
                  <ButtonGroup alignSelf={'end'} marginStart={5}>
                    <Button variant="accent" type='submit'> <AddCircle justifySelf={'start'} alignSelf={'end'} /> Add</Button>
                  </ButtonGroup>
                  </Flex>
                </Form>
              </Footer>
            </Dialog>)
          }
      </DialogTrigger>
  );
}

