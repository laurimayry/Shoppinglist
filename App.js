import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';



export default function App() {
const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [list, setList] = useState([]);


const db = SQLite.openDatabase('tuotedb.db');


// CREATE DB IF NOT EXISTS
useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists tuote (id integer primary key not null, product text, amount text);');
  }, () => console.error("Error when creating DB"), updateProduct);
}, []);

// SAVE PRODUCT

const saveProduct = () => {
  db.transaction(tx => {
      tx.executeSql('insert into tuote (product, amount) values (?, ?);', [product, amount]);    
    }, null, updateProduct
  )
}


// UPDATE PRODUCT

const updateProduct = () => {
  db.transaction(tx => {
    tx.executeSql('select * from tuote;', [], (_, { rows }) =>
      setList(rows._array)
    );
    console.log(list);
  });
}

const deleteProduct = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(`delete from tuote where id = ?;`, [id]);
    }, null, updateProduct
  )
}

const listSeparator = () => {
  return (
    <View
      style={{
        height: 5,
        width: "80%",
        backgroundColor: "#fff",
        marginLeft: "10%"
      }}
    />
  );
};

return(
  <View style={styles.container}>
    <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
      onChangeText={(product) => setProduct(product)}
      value={product}/>
    <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveProduct} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Products</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteProduct(item.id)}>Bought</Text></View>} 
        data={list} 
        ItemSeparatorComponent={listSeparator} 
      />      
  </View>
);
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });