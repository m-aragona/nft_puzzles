import React, { useState, useEffect, Suspense, useRef } from 'react';
import { IMGCARDS } from '../ImgCards';
import "./Profile.scss"
import { Flex, Button, Box, Text } from '@chakra-ui/react';
import lazy from 'react-lazy-with-preload'

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESSES
// const SCREEN_HEIGHT = window.innerHeight - 30

const Profile = ({ account, setPuzzleSize, puzzleSize, contract }) => {
    const [arrPuzzles, setArrPuzzles] = useState([])
    const [puzzleId, setPuzzleId] = useState()

    const childRef = useRef();

    const Picture = lazy(() => import('../components/Picture'));

    console.log('Datos en Profile:', puzzleSize.name, puzzleSize.prop1, puzzleSize.prop2)

    const arrPuzzleSize = [
        { id: 0, name: '5x5', prop1: '0 0 20%', prop2: '100px 100px', length: 25, rows: 5 },
        { id: 1, name: '10x10', prop1: '0 0 10%', prop2: '50px 50px', length: 100, rows: 10 },
        // { id: 2, name: '100x100', prop1: '0 0 20%', prop2: '100px 100px', length: 10000 }
    ]

    useEffect(() => {
        async function updateUserPuzzles(account, contract) {
            let arr = [];

            for (let i = 1; i < 13; i++) {
                try {
                    let puzzles = await contract.ownerOf(i);
                    if (puzzles.toString().toUpperCase() === account.toUpperCase()) {
                        arr.push(IMGCARDS[i - 1])
                    }
                } catch (err) { }
            }
            console.log(arr)
            setArrPuzzles(arr)
        }

        updateUserPuzzles(account, contract)

    }, [])

    const handleChange = (e) => {
        setPuzzleId(IMGCARDS[e.target.options[e.target.options.selectedIndex].id - 1]);
    };

    const handleSize = (e) => {
        setPuzzleSize(arrPuzzleSize[e.target.options.selectedIndex])

    }

    function handleClaimPoints() {
        childRef.current.handleClaim()

    }

    function handleMintPic() {


    }

    return (

        <>
            <Text fontSize='30px' fontWeight='bold' marginTop='10px' marginBottom='20px' paddingLeft='30px'>Profile</Text>

            <div className="select">
                <select id="standard-select" defaultValue='default' onChange={handleChange}>
                    <option value='default' disabled hidden>Select your puzzle ...</option>
                    {arrPuzzles.map(option => <option key={option.id} id={option.id} value={option.name}>{option.name}</option>)}
                </select>
                <span className="focus"></span>
            </div>

            <div className="select">
                {puzzleId ? (<select value={arrPuzzleSize.name} onChange={handleSize} >
                    {arrPuzzleSize.map(option => <option key={option.id} value={option.name}>{option.name}</option>)}
                </select>) : null
                }
                <span className="focus"></span>
            </div>

            {puzzleId ? (<Flex paddingTop='10px' justify="space-between">

                <Box width='30%' alignContent='center' >
                    <img width='75%' src={require('../assets/Cards/' + puzzleId.src + '.png')} alt='pic'></img>
                </Box>

                <Box width='40%' alignContent='center'>
                    <Suspense fallback={<h2>Loading puzzle...</h2>}>
                        {puzzleId ? <Picture ref={childRef} puzzleId={puzzleId} puzzleSize={puzzleSize} account={account} /> : null}
                    </Suspense>
                </Box>

                <Box width='30%' >
                    <Button width='80%' height='50px' float='center' cursor='pointer' onClick={handleClaimPoints} borderRadius='10px' border='solid'>CLAIM POINTS!</Button>
                    {/* <Button width='80%' height='50px' float='center' cursor='pointer' onClick={handleMintPic} borderRadius='10px' border='solid' >MINT PIC!</Button> */}
                </Box>

            </Flex>) : null}

        </>
    )
}

export default Profile;