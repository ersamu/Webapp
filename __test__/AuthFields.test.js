import { render } from '@testing-library/react-native';
import AuthFields from '../components/auth/AuthFields';

let auth = {};
const setAuth = (newAuth) => {
    auth = newAuth;
};

const mockSubmit = jest.fn();
const navigation = () => false;

test('tests that the title Registrera exists two times', async () => {
    const title = "Registrera";
    const { getAllByText } = render(<AuthFields
        auth={auth}
        setAuth={setAuth}
        submit={mockSubmit}
        title="Registrera"
        navigation={navigation}
    />);

    const titleElements = await getAllByText(title);

    expect(titleElements.length).toBe(2);
});

test('tests that there are fields for e-mail and password', async() => {
    const title = "Registrera";
    const { getByTestId } = render(<AuthFields
        auth={auth}
        setAuth={setAuth}
        submit={mockSubmit}
        title="Registrera"
        navigation={navigation}
    />);

    const emailField = await getByTestId("email-field");
    const passwordField = await getByTestId("password-field");

    expect(emailField).toBeDefined();
    expect(passwordField).toBeDefined();
})
