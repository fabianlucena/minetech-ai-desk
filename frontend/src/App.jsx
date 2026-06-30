import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Main from './components/Main';

export default function App() {
  return <>
    <Header />
    <div className="content">
      <Menu />
      <Main />
    </div>
    <Footer />
  </>;
}