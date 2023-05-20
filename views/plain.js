
console.log('Hellloooo fork plain')
async function distictYears(){
    const a=await fetch('/distictyears')
    const years = await a.json();
    console.log(years)
   }
   
   function filterData(obj){
     console.log(obj)
   }
   