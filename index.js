function userAddRC(){
	$prompt("Command to add: (type ; at the beginning if command is js script.)",(ok,result)=>{
    	if(!ok)return
        addRC(result,true)
    })
}
var rcPath = "/a/manApps/rc/.w93rc"
if(!localStorage.getItem("rcPath")){
	$prompt("Enter RCPath: (Empty for default)",(y,p)=>{
    	if(!y || !p){
        	localStorage.setItem("rcPath",rcPath)
        }else{
        	localStorage.setItem("rcPath",p)
            rcPath = p
        }
    })
}
async function addRC(cmd,promptExecNow=false){
  	var rc = ""
	if($fs.utils.exist(rcPath) === 0){
      	rc = await loadAsPromise(rcPath)
    }
  	rc += "\n"
    rc += cmd
    rc = rc.trim()
    saveAsPromise(rcPath,rc)
    if(promptExecNow){
    	var doit = await confirmAsPromise("Successfully added. Run now?")
        if(!doit)return
        execRC(cmd)
    }
}
function execRC(cmd){
	if(cmd.match(/^;/)){
    	try{
          eval(cmd.replace(";",""))
        }catch(e){
        	$alert.error("RC command failed.\nCommand: "+cmd.replace(";","")+"\nError: "+e)
        }
    }else{
      	$exe(cmd)
    }
}
async function execRCFile(path=false){
	path = path || rcPath
    var file = await loadAsPromise(path)
    file.split("\n").forEach(execRC)
}
execRCFile()
le._apps.rc = {
	category:"Utility",
  	exec:function(args){
    	var cmd = this.arg.arguments[0] || ""
        if(cmd)addRC(cmd,true)
        else userAddRC()
    }
}
