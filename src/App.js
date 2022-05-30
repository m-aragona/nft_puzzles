import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.scss';
import NavBar from './components/NavBar';
import { GridProvider } from "./components/GridContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import Footer from './Footer/Footer'
import { IMAGES10X10 } from './Images10x10';
import { IMAGES5X5 } from './Images5x5';
import { ethers } from 'ethers';
import PuzzlesContractJSON from './PuzzlesContract.json';

// https://m-aragona.github.io/nft_minting/
// npm run build
// npm run deploy
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESSES
const ALCHEMY_PROVIDER = process.env.REACT_APP_RINKEBY_RPC_URL

function App() {
  const [accounts, setAccounts] = useState([]);
  const [puzzleSize, setPuzzleSize] = useState({ id: 0, name: '5x5', prop1: '0 0 20%', prop2: '100px 100px', length: 25 });

  let provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_PROVIDER)
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    PuzzlesContractJSON.abi,
    provider
  );

  function handlePuzzleSize(_puzzleSize) {
    if (_puzzleSize === '5x5') {
      return IMAGES5X5
    } else if (_puzzleSize === '10x10') {
      return IMAGES10X10
    }
  }

  return (
    <GridProvider puzzleSize={puzzleSize} images={handlePuzzleSize(puzzleSize.name)}>
      <div className="App">
        <Router>
          <NavBar className="NavBar" position='fixed' top='0' accounts={accounts} setAccounts={setAccounts} />
          <div className='container'>
            <Routes>
              <Route path='nft_minting/' element={<Home contract={contract} />} />
              <Route path='nft_minting/ranking' element={<Ranking contract={contract} />} />
              <Route path='nft_minting/profile' element={<Profile account={accounts[0]} setPuzzleSize={setPuzzleSize} puzzleSize={puzzleSize} contract={contract} />} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
          </div>
        </Router>
        <Footer />
      </div >
    </GridProvider >
  );
}

export default App;
