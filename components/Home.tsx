import { Image, Text, ScrollView } from 'react-native';
import warehouse from './../assets/warehouse.jpg';
import Stock from './../components/Stock.tsx';
import { Base, Typography } from '../styles';

export default function Home({products, setProducts}) {
  return (
    <ScrollView style={Base.base}>
      <Text style={Typography.header1}>Välkommen till Lager-Appen</Text>
      <Image source={warehouse} style={Base.warehouseimg} />
      <Stock products={products} setProducts={setProducts} />
    </ScrollView>
  );
}

