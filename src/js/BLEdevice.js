let BLEdevice = new Array(5);
let dev_name = new Array(5);
let BLEChars = new Array(5);
let BLEvals = new Array(5);
let conn_devs = 0;
let selectedDevID;
let dup_dev = false;

let options = {     //web-bluetooth filters
    acceptAllDevices: true,
    optionalServices: ['generic_access']
}


function scanBLE(){
    if(conn_devs<5){
        let tempDev;
        navigator.bluetooth.requestDevice(options)
        .then(device => { 
            
            for(let i=0; i<conn_devs; i++){
                if(BLEdevice[i].id==device.id){
                    alert("Device already connected");
                    dup_dev = true;
                    return;
                }
            }

            tempDev = device;
            BLEdevice[conn_devs] = device;
            BLEdevice[conn_devs].addEventListener('gattserverdisconnected', function(){onDisconnect(device.id,0);}); //triggers diconnection event
            
            dev_name[conn_devs] = device.name;
            BLEvals[conn_devs] = "";
            conn_devs++;
    
            return device.gatt.connect();
        })
        .then(server => {/*console.log(server.device);*/ return server.getPrimaryServices();})
        .then(services => {
            // console.log(services);
    
            for(let i=0; i<services.length; i++){
                return services[i].getCharacteristics();
            }
        })
        .then(characteristics =>{
            console.log(characteristics);
            let addedTerm = false;
            for(let i=0; i<characteristics.length; i++){
                BLEChars[conn_devs-1] = characteristics[i];
                if(characteristics[i].properties.notify && characteristics[i].properties.write){
                    if(!addedTerm){
                        addTermTab(dev_name[conn_devs-1], BLEdevice[conn_devs-1].id);
                        addedTerm=true;
                    }
                    return BLEChars[conn_devs-1].startNotifications().then(_=>{
                        // console.log('> Notifications started');
                        BLEChars[conn_devs-1].addEventListener('characteristicvaluechanged', BLEread,true);   //triggers BLEread if data received
                        // console.log(conn_devs);
                    }).catch(e=>{
                        if(BLEdevice[conn_devs-1].gatt.connected){
                            alert("Characteristic Failure: "+e.message+"\n\nTry adding the desired device's UUID (i.e., 0x1234 or generic_attribute)");
                            BLEdevice[conn_devs-1].gatt.disconnect();
                            // onDisconnect(BLEdevice[conn_devs-1].id,1);
                        }
                        console.log("in notification catch");
                    })
                }
            }
        })
        .catch(error => {
            if(dup_dev){
                dup_dev=false;
            }
            else{
                if(error.message!="User cancelled the requestDevice() chooser."){
                    if(error.message.includes("Invalid Service name")){
                        let startIndex = error.message.indexOf("Invalid Service name:");
                        let endIndex = error.message.indexOf("'. It")+1;
                        let tempMsg = "";
                        for(let i=startIndex; i<startIndex+(endIndex-startIndex); i++){
                            tempMsg+=error.message[i];
                        }
                        alert(tempMsg+"\nTry removing or changing the UUID(s) causing the error");
                        return;
                    }
                    if(tempDev){
                        console.log("in connect catch");
                        alert("Connection Failure: "+error.message);
                        if(tempDev.gatt.connected){
                            tempDev.gatt.disconnect();
                        }
                        else{
                            console.log("calling onDisconnect");
                            onDisconnect(tempDev.id,1);
                        }
                    }
                }
            }
        });
    }
}

/*Updates the number of connected devices and the list of connected devices when disconnected*/
function onDisconnect(dev_id,error=0){
    // console.log("disconnect");
    if(conn_devs>0){
        for(let i=0; i<conn_devs; i++){
            if(BLEdevice[i].id==dev_id){
                BLEdevice.splice(i,1);
                BLEChars.splice(i,1);
                BLEvals.splice(i,1);
                dev_name.splice(i,1);
                conn_devs--;
                
                if(!error){
                    alert("Device just got disconnected");
                }
                rmTermTab(dev_id);
            }
        }
    }
}

function disconnectBtn(dev_id){
    for(let i=0; i<conn_devs; i++){
        if(BLEdevice[i].id==dev_id){
            console.log(BLEdevice[i].id);
            return BLEdevice[i].gatt.disconnect();
        }
    }
}

/* Writes data to connected device.
 * If a write attempt fails, then writeBLE() will attempt to write
 * again after 30 milliseconds
 */
async function writeBLE(data){
    // console.log(data);
    if(conn_devs>0){
        let encoder = new TextEncoder('utf-8');
        await BLEChars[conn_devs-1].writeValue(encoder.encode(data))     //writes 'data' to connected device.  if error, then try again after 30ms.
        .catch((error)=>{
            // console.log("in writeBLEindex #36: "+error);
            setTimeout(async function(){await writeBLE(data);},30);
        });
    }
}

/* This function gets triggered after cBLE notification.
 * This function reads the value sent by connected device
 * and parses the value for Volume Level, number of taps,
 * scanned MAC addresses, and for x,y,z acceleration values.
 */
async function BLEread(event){
    let j;
    // console.log(event);
    if(conn_devs>0){
        let this_dev_id = event.currentTarget.service.device.id;
        let this_dev_index;

        for(let i=0; i<conn_devs; i++){
            if(BLEChars[i].service.device.id==this_dev_id){
                this_dev_index = i;
            }
        }

        BLEvals[this_dev_index] = "";
        
        for(j=0; j<BLEChars[this_dev_index].value.byteLength; j++){    //read bytes from received value
            BLEvals[this_dev_index] += String.fromCharCode(BLEChars[this_dev_index].value.getUint8(j)); //convert value to string
        }
            
        // console.log(BLEvals[this_dev_index]);
        terminalLog(0, "terminal1", new Date().toLocaleTimeString(), dev_name[this_dev_index], BLEvals[this_dev_index])
    }
}