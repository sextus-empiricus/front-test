import {SignUpForm} from './components/SignUpForm/SignUpForm';
import {Route, Routes} from 'react-router-dom';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<h1>Landing page🚀</h1>}/>
            <Route path="/signup" element={<SignUpForm/>}/>
        </Routes>
    )
};

export default App;
