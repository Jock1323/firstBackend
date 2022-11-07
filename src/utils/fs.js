import fs from "fs"
import path from "path"

const read=dir=>JSON.parse(fs.readFileSync(path.join(process.cwd(),"src","model",dir)))

const write=(dir,data)=>{
    fs.writeFileSync(path.join(process.cwd(),"src","model",dir),JSON.stringify(data,null,4))
}
export{
    read,write
}