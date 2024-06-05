//import logo from './logo.svg';
import './App.css';
import BankCrud from './CRUD/bankCrud';
//import AssignmentCrud from './CRUD/assignmentCrud';
//import Crudoperations from './CRUD/crudoperations';
//import Component1 from './Component/myComponent';
//import Componentc1 from './Component/yourComponent';

function App() {
  return (
    <div>
      {/* <Component1/>,
      <Componentc1/> */}
      <BankCrud/>
      {/* <Crudoperations/> */}
      {/* <AssignmentCrud/> */}
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
