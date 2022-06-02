import React, { useState, useEffect } from 'react';
import PuzzleListing from '../PuzzleListing/PuzzleListing';
import "./Home.scss"
import { Text, Box, Link } from '@chakra-ui/react';

const Home = ({ contract }) => {
    const [puzzlesMinted, setPuzzlesMinted] = useState([]);

    useEffect(() => {
        async function updatePuzzlesMinted(contract) {
            let arr = [];
            const resPuzzlesMinted = await contract.tokensMinted()

            for (let i = 0; i < resPuzzlesMinted.length; i++) {
                arr.push(resPuzzlesMinted[i].toNumber())
            }
            setPuzzlesMinted(arr)
        }

        updatePuzzlesMinted(contract)

    }, [])

    
    return (
        <>
            <Text fontSize='30px' fontWeight='bold' marginTop='10px'> Mint Puzzles </Text>
            <PuzzleListing puzzlesMinted={puzzlesMinted} />

            <Box>
                <div style={{ background: "#ECECEC", padding: '5px', borderRadius: '10px' }}>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Text fontWeight='bold' fontSize="23px" textStyle='bold' >How to mint and play:</Text>
                        <Text className='usage'>1. Connect your <b>Metamask</b> to this <b>webpage</b>.</Text>
                        <Text className='usage' >2. In your <b>Metamask</b>, connect to <b>Rinkeby Network</b>.</Text>
                        <Text className='usage' >3. Get some <b>fake ETH</b> from here: <Link href="https://rinkebyfaucet.com" isExternal="true">https://rinkebyfaucet.com</Link></Text>
                        <Text className='usage' >4. Select any NFT of the list above and mint it.</Text>
                        <Text className='usage' >5. Go to MyPuzzles, select your minted NFT and complete the puzzle.</Text>
                        <Text className='usage' >6. Remember you can sell your NFT in <b><Link href="https://testnets.opensea.io" isExternal="true">Opensea</Link></b>.</Text>
                        <Text className='usage' >7. Once you complete the puzzle you can claim points and you will be listed on the Global Ranking.</Text>
                    </div>
                </div>
            </Box>
        </>
    )
}

export default Home;