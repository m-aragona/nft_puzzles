import black_frame from '../assets/black_frame.png';
import React, { useState, useEffect, useContext, useImperativeHandle, useRef } from "react"
import DragItem from "./DragItem";
import { Grid, GridImage, GridItem } from "./Grid";
import GridContext from "./GridContext";
import { ethers, Wallet, BigNumber } from 'ethers';
import PuzzlesContractJSON from '../PuzzlesContract.json';
import "./Picture.scss"
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESSES
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY
const ALCHEMY_PROVIDER = process.env.REACT_APP_RINKEBY_RPC_URL

//{ puzzleId, puzzleSize }
const Picture = ({ puzzleId, puzzleSize, account }, ref) => {
    let { items, moveItem } = useContext(GridContext);
    const [imgsLoaded, setImgsLoaded] = useState(false)
    const [claimPoints, setClaimPoints] = useState(false)

    useImperativeHandle(ref, () => ({
        handleClaim() {
            handleClaim();
        }
    }));

    async function handleClaim() {
        for (let i = 0; i < items.length - 1; i++) {
            if (items[i + 1].id !== items[i].id + 1) {
                return alert('Puzzle not completed yet!')
            }
        }

        setClaimPoints(true)
        let provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_PROVIDER);
        const signer = new Wallet(PRIVATE_KEY, provider)
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PuzzlesContractJSON.abi,
            signer
        );

        try {
            // const tx = await contract.setScore(account, puzzleId.id, puzzleSize.name, puzzleSize.length, { gasLimit: 4000000 });
            const tx = await contract.setScore(account, puzzleId.id + puzzleSize.name, puzzleSize.length, { gasLimit: 4000000 });
            await tx.wait();

            alert('Congratulations! You can check your new score on Global Ranking')
        } catch (err) {
            console.log(err)
            alert('Puzzle already claimed!')
        }

        setClaimPoints(false)
        // let res2 = await contract.scoresRequire(account, (puzzleId.id + puzzleSize.id).toString());
        // console.log(ethers.BigNumber.from(res2).toNumber())

        //const res = contract.filters.scoreWallets(account, puzzleId, puzzleSize)
        //const _logs = await contract.queryFilter(res, 0)
        // if (console.log('LOGS:', _logs[0].args[3].toString()) > 0) {
        //     alert('You have already completed this puzzle!')
        //     // Carefull reentrancy. Maybe do a require on the contract
        // } else {
        //     const tx = await contract.setScore(account, puzzleId.id, puzzleSize.id, puzzleSize.length, { gasLimit: 4000000 });
        //     await tx.wait();
        //     alert('!')
        // }

        // contract.on("scoreWallets", (_user, _puzzleId, _puzzleSize, _score) => {
        //     alert('Congratulations! You have completed the puzzle! ' + _user + _puzzleId.toString() + _puzzleSize.toString() + _score)
        // })

        //const res = contract.filters.scoreWallets(account)
        //const _logs = await contract.queryFilter(res, 0)
        // console.log('LOGS:', _logs[0].args[0].toString())
        // console.log('LOGS:', _logs[0].args[1].toString())
        // console.log('LOGS:', _logs[0].args[2].toString())
        // console.log('LOGS:', _logs[0].args[3].toString())
    }


    useEffect(() => {
        let loadingTime = 0

        const loadImage = image => {

            if (puzzleId.ext === '.gif') {
                loadingTime = 5000
            }
            return new Promise((resolve, reject) => {
                const loadImg = new Image()
                loadImg.src = require('../assets/Pictures/' + puzzleId.folder + '/' + puzzleSize.name + '/' + image.src + puzzleId.ext)

                loadImg.onload = () =>
                    setTimeout(() => {
                        resolve(require('../assets/Pictures/' + puzzleId.folder + '/' + puzzleSize.name + '/' + image.src + puzzleId.ext))
                    }, loadingTime)

                loadImg.onerror = err => reject(err)
            })
        }

        for (let i = 0; i < 2; i++) {
            Promise.all(items.map(image => loadImage(image)))
                .then(() => { if (i == 1) { setImgsLoaded(true) } })
                .catch(err => console.log("Failed to load images", err))
        }


    }, [])

    return (
        <main className="images">
            <div style={{
                position: 'relative', display: 'flex', justifyContent: 'center',
                alignItems: 'center', margin: 'auto'
            }}>
                <img alt="framePuzzle" style={{
                    position: 'relative', display: 'flex'
                }} src={black_frame}>
                </img>

                <div style={{
                    width: 500, height: 500, fontSize: 0, position: 'absolute'
                }}>
                    {imgsLoaded ?
                        (<Grid >
                            {items.map(item => (
                                <DragItem key={item.id} id={item.id} onMoveItem={moveItem} puzzleIdFormat={puzzleId.format}>
                                    <GridItem id={item.id} _flex={puzzleSize.prop1}>
                                        <GridImage b_size={puzzleSize.prop2} src={require('../assets/Pictures/' + puzzleId.folder + '/' + puzzleSize.name + '/' + item.src + puzzleId.ext)} ></GridImage>
                                    </GridItem>
                                </DragItem>
                            ))

                            }
                        </Grid>)
                        :
                        (<Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open >
                            {/* <CircularProgress color="inherit" /> */}
                        </Backdrop>)
                    }
                </div>
                {claimPoints ? (<Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open >
                    <CircularProgress color="inherit" />
                </Backdrop>) : null}
            </div>
        </main >

    )
}

export default React.forwardRef(Picture);