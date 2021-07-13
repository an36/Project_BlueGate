

let selectedTermID = "AllTerminal";

let connbtn = document.getElementById("connbtn");
connbtn.onclick = scanBLE;

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

let devlistInner = document.getElementById("devlistInner");

let terminalTabs = document.getElementById("tab");

let terminalWin = document.getElementById("terminals");

function showAllTerminal(){
    let AllTerminal = document.getElementById("AllTerminal");
    let TermWindowns = document.getElementsByClassName("terminal");

    for(let i=0; i<TermWindowns.length; i++){
        TermWindowns[i].classList.add("hidden");
        console.log(i);
    }

    selectedTermID = "AllTerminal";
    AllTerminal.classList.remove("hidden");

    sendbtn.style.backgroundColor = "var(--allTerminalClr)";

}


let addRmServsbtn = document.getElementById("addRmServsbtn");
addRmServsbtn.onclick = addOptionalServs;


function sendBLE(){
    if(sendtext.value.length>0){
        writeBLE(sendtext.value);
        terminalLog(1, selectedTermID, new Date().toLocaleTimeString(), selectedTermID, sendtext.value);
        sendtext.value = "";
    }
}

function addTermTab(device_name, device_id){
    let tempDevIndex = dev_name.indexOf(device_name);
    terminalTabs.innerHTML+="<button id=\""+device_id+"\">"+device_name+"</button>";
    
    let curr_tabbtn = document.getElementById(device_id); 

    curr_tabbtn.style.border = "1px solid var(--terminal"+tempDevIndex+"Clr)";
    curr_tabbtn.style.backgroundColor = "var(--terminal"+tempDevIndex+"Clr)";

    curr_tabbtn.onclick = function(){
        selectedTermID=device_name;
        let TermWindowns = document.getElementsByClassName("terminal");
        let curr_TermWindow = document.getElementById(device_name);

        for(let i=0; i<TermWindowns.length; i++){
            TermWindowns[i].classList.add("hidden");
            console.log(i);
        }

        let tempDevIndex = dev_name.indexOf(device_name);

        curr_TermWindow.style.border = "3px solid var(--terminal"+tempDevIndex+"Clr)";

        curr_TermWindow.classList.remove("hidden");

        sendbtn.style.backgroundColor = "var(--terminal"+tempDevIndex+"Clr)";
    }

    terminalWin.innerHTML+="<textarea class=\"boxes terminal hidden\" readonly id=\""+device_name+"\"></textarea>";
}

function rmTermTab(device_name, device_id){
    let dev_tab = document.getElementById(device_id);
    let curr_TermWindow = document.getElementById(device_name);
    if(dev_tab){
        dev_tab.remove();
    }
    if(curr_TermWindow){
        curr_TermWindow.remove();
        showAllTerminal();
    }
}

function addOptionalServs(){
    if(ServsInput.value.length>0){
        let temp = ServsInput.value;
        // console.log(temp);

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
            addRmServsbtn.style.backgroundColor= "var(--addbtnClr)";
        }
    }

    ServsInput.value = "";
    // console.log(options.optionalServices);
}

function rmOptionalServs(){
    addRmServsbtn.innerHTML="Add";
    addRmServsbtn.style.backgroundColor= "var(--addbtnClr)";

    if(ServsInput.value.length>0){
        let temp = ServsInput.value;
        if(ServsInput.value.startsWith('0x')){
            temp = parseInt(ServsInput.value,16);
        }
        
        if(options.optionalServices.includes(temp)){
            addRmServsbtn.innerHTML="Remove";
            addRmServsbtn.style.backgroundColor= "var(--rmbtnClr)";
        }
    }
}

function terminalLog(sending=0,term_id, curr_time, curr_dev_name,val){
    let curr_teminal = document.getElementById(term_id);
    let AllTerminal = document.getElementById("AllTerminal");
    if(!sending){
        curr_teminal.innerHTML+="["+curr_time+"] "+curr_dev_name+": "+val+"&#10;";
        AllTerminal.innerHTML+= "["+curr_time+"] "+curr_dev_name+": "+val+"&#10;";
    }
    else{
        if(term_id=="AllTerminal"){
            TermWindowns = document.getElementsByClassName("terminal");
            for(let i=0; i<TermWindowns.length; i++){
                TermWindowns[i].innerHTML+="["+curr_time+"] sent to All: "+val+"&#10;";
            }
        }
        else{
            curr_teminal.innerHTML+="["+curr_time+"] sent to "+curr_dev_name+": "+val+"&#10;";
            AllTerminal.innerHTML+="["+curr_time+"] sent to "+curr_dev_name+": "+val+"&#10;";
        }
    }
    curr_teminal.scrollTop = curr_teminal.scrollHeight;
    AllTerminal.scrollTop = AllTerminal.scrollHeight;
}

function updateDevList(add=0,BLEdev, BLEchar){
    let curr_properties = "";
    // console.log(BLEdev.id);
    // console.log(BLEdev.name);
    // console.log(BLEchar.properties);

    if(add){
        if(BLEchar.properties.read){
            curr_properties += "Read";
        }
        if(BLEchar.properties.write){
            if(curr_properties.length > 0){
                curr_properties += ", ";
            }
            curr_properties += "Write";
        }
        if(BLEchar.properties.notify){
            if(curr_properties.length > 0){
                curr_properties += ", ";
            }
            curr_properties += "Notify";
        }
    
        devlistInner.innerHTML += "<a class=\""+BLEdev.id+"\"><b>"+BLEdev.name+"<img onclick=\"disconnectBtn(this);\" name=\""+BLEdev.id+"\" src=\"/src/assets/Red-incorrect-icon-button-on-transparent-background-PNG-1.png\" width=\"17\" height=\"17\"></b>Properties: "+curr_properties+"<br><br><br><br></a>";
    }
    else{
        if(BLEdev){
            let dev_element = document.getElementsByClassName(BLEdev.id);
            while(dev_element.length>0){
                dev_element[0].parentNode.removeChild(dev_element[0]);
            }
        }
    }

}