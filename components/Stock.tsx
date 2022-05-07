// import { useEffect } from 'react';
import { Text, View } from 'react-native';

// import productModel from '../models/products';
import {Typography} from '../styles';
import StockList from "./StockList";

export default function Stock({products, setProducts}) {
  return (
    <View>
      <Text style={Typography.header2}>Lagerförteckning</Text>
      <StockList products={products} setProducts={setProducts}/>
    </View>
  );
}
