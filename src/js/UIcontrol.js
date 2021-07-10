


let connbtn = document.getElementById("connbtn");
connbtn.onclick = scanBLE;

let discobtn = document.getElementById("discobtn");
discobtn.onclick = function(){disconnectBtn(selectedDevID)};

let ServsInput = document.getElementById("ServsInput");
ServsInput.oninput = rmOptionalServs;

let optionalServs = document.getElementById("optionalServs");

let sendbtn = document.getElementById("sendbtn");
sendbtn.onclick = sendBLE;

let sendtext = document.getElementById("sendtext");
sendtext.addEventListener("keyup",function(e){
    if(e.key === 'Enter'){
        sendBLE();
    }
});

let terminalTabs = document.getElementById("tab");

let addRmServsbtn = document.getElementById("addRmServsbtn");
addRmServsbtn.onclick = addOptionalServs;


function sendBLE(){
    if(sendtext.value.length>0){
        writeBLE(sendtext.value);
        terminalLog(1, "terminal1", new Date().toLocaleTimeString(), "All", sendtext.value);
        sendtext.value = "";
    }
}

function addTermTab(device_name, device_id){
    terminalTabs.innerHTML+="<button id=\""+device_id+"\">"+device_name+"</button>";
    document.getElementById(device_id).onclick = function(){
        selectedDevID=device_id;
    }
}

function rmTermTab(device_id){
    let dev_tab = document.getElementById(device_id)
    if(dev_tab){
        dev_tab.remove();
    }
}

function addOptionalServs(){
    if(ServsInput.value.length>0){
        let temp = ServsInput.value;
        console.log(temp);

        if(addRmServsbtn.innerHTML=="Add"){
            if(ServsInput.value.startsWith('0x')){
                temp = parseInt(ServsInput.value,16);
            }
            
            if(!(options.optionalServices.includes(temp))){
                options.optionalServices.push(temp);
                optionalServs.innerHTML+="<option id=\""+ServsInput.value+"\" value=\""+ServsInput.value+"\">";
            }
        }
        else{
            let tempIndex = options.optionalServices.indexOf(temp);
            options.optionalServices.splice(tempIndex,1);
            document.getElementById(temp).remove();
            addRmServsbtn.innerHTML="Add";
        }
    }

    ServsInput.value = "";
    console.log(options.optionalServices);
}

function rmOptionalServs(){
    if(ServsInput.value.length>0){
        let temp = ServsInput.value;
        if(ServsInput.value.startsWith('0x')){
            temp = parseInt(ServsInput.value,16);
        }
        
        if(options.optionalServices.includes(temp)){
            addRmServsbtn.innerHTML="Remove";
        }
        else{
            addRmServsbtn.innerHTML="Add";
        }
    }
}

function terminalLog(sending=0,term_id, curr_time, curr_dev_name,val){
    let curr_teminal = document.getElementById(term_id);

    if(!sending){
        curr_teminal.innerHTML+="["+curr_time+"] "+curr_dev_name+": "+val+"&#10;";
    }
    else{
        curr_teminal.innerHTML+="["+curr_time+"] sent to "+curr_dev_name+": "+val+"&#10;";
    }
    curr_teminal.scrollTop = curr_teminal.scrollHeight;
}