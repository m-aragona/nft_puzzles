import React from "react";
import "./PuzzleCard.scss";
import { ethers, BigNumber } from 'ethers';
import PartsCollectionJSON from '../PuzzlesContract.json';

//const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESSES
const contractAddress = '0xf6E13706dC734375C61eCcC98d148Ed03E69292e'


const PuzzleCard = ({ id, src }) => {
    let dragging = false;
    async function handleMint(id) {

        console.log("id:", id)
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // console.log("contract:", contractAddress)
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                PartsCollectionJSON.abi,
                signer
            );

            try {
                const response = await contract.mint(BigNumber.from(id), { value: 100000000000000 }); // Solidity requiere que se lo pase como BigNumber
                await response.wait();
                // Listen Event
            } catch (err) {
                console.log("error: ", err)
            }
        }

    }


    function alerta() {
    }

    console.log(src)
    return (
        <div className="card-item">
            <div className="card-inner">
                <div className="card-top" >
                    <img onClick={(e) => dragging && e.preventDefault && handleMint(id)} style={{ borderRadius: '10px' }} src={require('../assets/Cards/' + src + '.png')} alt={id} />
                </div>
            </div>
        </div>
    )
}

export default PuzzleCard;