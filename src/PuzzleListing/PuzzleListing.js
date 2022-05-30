import React, { useState } from "react";
import { IMGCARDS } from '../ImgCards';
// import PuzzleCard from '../PuzzleCard/PuzzleCard';
import "./PuzzleListing.scss";
import Slider from 'react-slick'
import { ethers, BigNumber } from 'ethers';
// import { Settings } from "../commons/settings";
import PuzzlesContractJSON from '../PuzzlesContract.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESSES

const PuzzleListing = ({ puzzlesMinted }) => {
    const [clickable, setClickable] = useState(true);
    const onSliderChange = () => {
        setClickable(true);
    };

    async function handleMint(id) {

        console.log("id:", id)
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                PuzzlesContractJSON.abi,
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

    const options = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,

        afterChange: onSliderChange,
        beforeChange: () => setClickable(false),

        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="puzzle-wrapper">
            <div className="puzzle-list">
                <div className="puzzle-container" >
                    <Slider {...options}>

                        {IMGCARDS.filter(num => !puzzlesMinted.includes(num.id)).map(item => (

                            <div key={item.id} className="card-item">
                                <div className="card-inner">
                                    <div className="card-top" >
                                        <img onClick={() => clickable && handleMint(item.id)} style={{ borderRadius: '10px' }} src={require('../assets/Cards/' + item.src + '.png')} alt={item.id} />
                                    </div>
                                </div>
                            </div>

                        ))
                        }

                    </Slider>
                </div>
            </div>
        </div>
    )

}

export default PuzzleListing;




// const PuzzleListing = () => {

//     let handleList =
//         IMGCARDS.map(item => (
//             <PuzzleCard id={item.id} src={item.src} key={item.id} />
//         )
//         )

//     return (
//         <div className="puzzle-wrapper">
//             <div className="puzzle-list">
//                 <h2>Puzzles</h2>
//                 <div className="puzzle-container" >
//                     <Slider {...Settings}>{handleList}</Slider>
//                 </div>
//             </div>
//         </div>
//     )

// }

// export default PuzzleListing;