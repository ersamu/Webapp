import { render } from '@testing-library/react-native';
import DeliveriesList from '../components/DeliveriesList';

const route = { params: false};
const navigation = () => false;

test('header should exist containing text Inleveranser', async () => {
    const { getByText } = render(<DeliveriesList route={route} navigation={navigation} />);
    const header = await getByText('Inleveranser');

    expect(header).toBeDefined();
});
