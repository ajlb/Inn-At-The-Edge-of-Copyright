let allItems;
let allLocations;



























//page init
findAllItems().then(items=>{
    allItems = items;
    console.log(allItems);
    getAllLocations().then(locations => {
        allLocations = locations;
        console.log(locations);
        
    })
})