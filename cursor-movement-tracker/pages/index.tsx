import { Provider } from 'react-redux';
import store from '../redux/store';
import ScreenPage from '../screens/screen'

function App() {
  return (
    <Provider store={store}>
      <ScreenPage />
    </Provider>
  );
}

export default App;