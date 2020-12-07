//import setChatHistory from '../ChatPanel'


function showStats(user, setChatHistory) {
    console.log(user)
    const statsArray = [];

    for (const param in user.stats) {

        statsArray.push(`${param}:  ${user.stats[param]}`);
    }



    const deletedItems = statsArray.slice(0, 4);
    const newDeletedItems = statsArray.slice(8, 10);

    const newArray = deletedItems.concat(newDeletedItems)

  //  const hpString = newArray.slice(3,4);

    const redSpan = {color:'red', text: `${newArray[3]}`};
    
   
//    'span  style="color:green"></span>',
//     'span style="color:orange"></span>'];
 
   // newArray.push(redSpan);
    //    if (newArray[3] < 5) 
    //        newArray.push(redSpan);
    //    else if (newArray[3] === 50 ) {
    //        newArray.push(redSpan);
    //    }
    //    else if (newArray[3] > 5 ) {
    //        newArray.push(redSpan);
    //    }

    //text: `${newArray[3]}`
    //{ type:

    newArray.forEach((user) => {
        let currentColor = 'display-stat';
     //   if ()

     const userDisplay = {type: correctColor, text:`${user}`}

        setChatHistory(prevState => [...prevState,  userDisplay]);
         console.log(redSpan);

    });
//}
}
export {
    showStats
}