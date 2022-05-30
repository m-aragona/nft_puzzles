import React, { useState, useEffect } from 'react';
import {
    ChakraProvider,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Text
} from '@chakra-ui/react'
import { ethers } from 'ethers';

const Ranking = ({ contract }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function updateRanking(contract) {
            let arr = [];
            const scoreWallets = await contract.getScoreWallets()

            for (let i = 0; i < scoreWallets.length; i++) {
                let res = await contract.scores(scoreWallets[i]);
                let obj = { wallet: scoreWallets[i], score: ethers.BigNumber.from(res).toNumber() }
                arr.push(obj)
            }
            //console.log(arr)

            const myData = [].concat(arr)
                .sort((a, b) => a.score < b.score ? 1 : -1)

            setScores(myData)
        }

        updateRanking(contract)

    }, [])

    return (
        <>
            <Text fontSize='30px' fontWeight='bold' marginTop='10px'>Global Ranking</Text>
            <div justify='center' align='center'>
                <ChakraProvider >
                    <Box width='50%' p={4}>
                        <Table>
                            {/* <TableCaption>Global Ranking</TableCaption> */}
                            <Thead>
                                <Tr>
                                    <Th>Wallet</Th>
                                    <Th>Score</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {scores.map((item) => (
                                    <Tr key={item.wallet}>
                                        <Td>{item.wallet}</Td>
                                        <Td>{item.score}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </ChakraProvider>
            </div>
        </>
    )
}

export default Ranking;