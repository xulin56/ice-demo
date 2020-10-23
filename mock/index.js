const fs = require('fs');
const path = require('path')
;

const mockFiles = fs.readdirSync(path.join(__dirname, 'data'));
const result = {};
mockFiles.map(item=>{
  try{
    result[item.replace(/\|/g,'/')] = JSON.parse(fs.readFileSync(path.join(__dirname,'data', item)).toString());
  }catch(e){
    // console.log('mock file format error.');
    // console.log(`filename: ${item}`);
  }
});

console.log(result)
module.exports = result;