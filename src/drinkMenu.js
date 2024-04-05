import './App.css';
import {ActionButton,
  Column,
  Content,
  Cell,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Heading,
  Row,
  TableBody,
  TableView,
  TableHeader,
  Text} from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';

const columns = [
  {id: 'name', name: 'Name'},
  {id: 'recipe', name: ''},
  {id: 'missing', name: 'Can make?'}
];

export function Drinks(props) {
  const {available} = props;
  //let items = available;
    
  return (
    <Flex height={'100%'} width={'100%'}>
      <TableView height={'100%'} width={'100%'}>
        <TableHeader columns={columns}>
          {(column) => (<Column align='center' key={column.id} width={ column.id === 'recipe' ? '30%':'35%'}> {column.name} </Column>)}
        </TableHeader>
        <TableBody items={available} >
          {item =>(
            <Row key={`${item.key}${item.missing.length}`}>
              {columnKey => {
                switch(columnKey){
                    case 'recipe':
                      return (
                        <Cell>
                          <DialogTrigger alignItems={'center'}>
                            <ActionButton> <Info/> </ActionButton>
                            {(close) => (
                              <Dialog isDismissable>
                                <Heading level={5}>{item.name}</Heading>
                                <Content>
                                  <Flex gap={'size-150'} direction={'column'}>
                                    <Text>{item.recipe.map(( v, i) => item.measurements[i] ? 
                                      `${v} : ${item.measurements[i]} ` : v).join('; ')}</Text>
                                    <Divider size='S'/>
                                    <Text>
                                      {item.instructions}
                                    </Text>
                                  </Flex>
                                </Content>
                              </Dialog>
                            )}
                          </DialogTrigger>
                      </Cell>
                      );
                    case 'missing':
                      return <Cell>{item.missing.length > 0 ? `Missing ${item.missing.length} ingredients` : "Can make"} </Cell>; 
                    default:
                      return <Cell>{item[columnKey]}</Cell>;
                }
              }
            }
            </Row>
          )}
        </TableBody>
    </TableView>
    </Flex>
  );
}
