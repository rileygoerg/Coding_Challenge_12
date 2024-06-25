function main(){
   d3.dsv(',','mock_stock_data.csv', d3.autoType).then(
    function(d){
        for (let index = 0; index < d.length; index++) {
            const element = d[index];
        }
    }
   )
}