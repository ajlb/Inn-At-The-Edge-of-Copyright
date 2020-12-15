import React, { useEffect, useState, useContext } from 'react';
import { getPlayers } from "../../../../clientUtilities/adminAPIs";
import "../../css/styles.css";
import AdminInfo from "../../../../clientUtilities/AdminInfo";


function PlayerViewAll() {

    const [PlayerData, setPlayerData] = useState([])
    const adminInfo = useContext(AdminInfo);


    useEffect(() => {
        getPlayers().then(PlayerData => {
            setPlayerData(PlayerData.data);
            // console.log(PlayerData.data);
        }
        )
    }, [])

    return (
        <article id="LocBox">
            {PlayerData.map(player => {
                return (
                    <section
                        key={player.characterName}
                        className={player.race + " " + player.profession}
                        style={adminInfo.isClosed ? { marginLeft: 20 + "px" } : { marginLeft: 130 + "px" }}>
                        <header><h4><strong>Name: </strong>{player.characterName}</h4></header>

                        <div><strong>Is the player alive? </strong>{player.isLiving}</div>

                        <div><strong>Is the player an NPC? </strong>{player.isNPC}</div>

                        <div><strong>Race: </strong>{player.race}</div>

                        <div><strong>Profession: </strong>{player.profession}</div>

                        <div><strong>Abilities: </strong>{player.abilities}</div>

                        <div><strong>Last Location: </strong>{player.lastLocation}</div>

                        <div><strong>Backstory: </strong>{player.backstory}</div>

                        <div><strong>Description: </strong>{player.description}</div>

                        <div><strong>Stats: </strong>
                            <ul>
                                {Object.keys(player.stats).map(stat => {
                                    return (
                                        <li>
                                            {stat}: {player.stats[stat]}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div><strong>Inventory: </strong>
                            <ul>
                                {player.inventory.length === 0 ? "none" : player.inventory.map(item => {
                                    return (
                                        <li>
                                            {item.name}, {item.quantity}, Equipped: {item.equipped}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>
                )
            })}
        </article>
    )
}

export default PlayerViewAll;