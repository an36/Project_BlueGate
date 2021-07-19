

let selectedTermID = "AllTerminal";

let ServsInput = document.getElementById("ServsInput");
ServsInput.oninput = rmOptionalServs;
ServsInput.addEventListener("keyup",function(e){
    if(e.key === 'Enter'){
        addOptionalServs();
    }
});

let optionalServs = document.getElementById("optionalServs");

let addRmServsbtn = document.getElementById("addRmServsbtn");
addRmServsbtn.onclick = addOptionalServs;

let connbtn = document.getElementById("connbtn");
connbtn.onclick = scanBLE;

let devlistInner = document.getElementById("devlistInner");

let terminalTabs = document.getElementById("tab");

let terminalWin = document.getElementById("terminals");

let sendtext = document.getElementById("sendtext");
sendtext.addEventListener("keyup",function(e){
    if(e.key === 'Enter'){
        sendBLE();
    }
});

let sendbtn = document.getElementById("sendbtn");
sendbtn.onclick = sendBLE;

function addOptionalServs(){
    if(ServsInput.value.length>0){
        let temp = ServsInput.value;

        if(ServsInput.value.startsWith('0x')){
            temp = parseInt(ServsInput.value,16);
        }

        if(addRmServsbtn.innerHTML=="Add"){
            if(!(options.optionalServices.includes(temp))){
                options.optionalServices.push(temp);
                optionalServs.innerHTML+="<option id=\""+ServsInput.value+"\" value=\""+ServsInput.value+"\">";
            }
        }
        else{
            let tempIndex = options.optionalServices.indexOf(temp);
            options.optionalServices.splice(tempIndex,1);
            document.getElementById(ServsInput.value).remove();
            addRmServsbtn.innerHTML="Add";
            addRmServsbtn.style.backgroundColor= "var(--addbtnClr)";
        }
        savePage('options',JSON.stringify(options));
    }

    ServsInput.value = "";
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

function updateDevList(add=0,BLEdev, BLEchar){
    let curr_properties = "";

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

        if(conn_devs==1){
            devlistInner.innerHTML = "";
        }

        let tempDevIndex = dev_name.indexOf(BLEdev.name);
    
        devlistInner.innerHTML += "<a class=\""+BLEdev.id+"\"><b>"+BLEdev.name+"<img onclick=\"disconnectBtn(this);\" name=\""+BLEdev.id+"\" src=\"/src/public/assets/discon.png\" width=\"17\" height=\"17\"></b>Properties: "+curr_properties+"<br><br><br><br></a>";
        document.getElementsByClassName(BLEdev.id)[0].getElementsByTagName("b")[0].style.color="var(--terminal"+tempDevIndex+"Clr)";
    }
    else{
        if(BLEdev){
            let dev_element = document.getElementsByClassName(BLEdev.id);
            while(dev_element.length>0){
                dev_element[0].parentNode.removeChild(dev_element[0]);
                if(conn_devs==1){
                    devlistInner.innerHTML = "<i>No Connected Devices</i>";
                }
            }
        }
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
        }

        let tempDevIndex = dev_name.indexOf(device_name);

        curr_TermWindow.style.border = "3px solid var(--terminal"+tempDevIndex+"Clr)";

        curr_TermWindow.classList.remove("hidden");
        curr_TermWindow.scrollTop = curr_TermWindow.scrollHeight;

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

function showAllTerminal(){
    let AllTerminal = document.getElementById("AllTerminal");
    let TermWindowns = document.getElementsByClassName("terminal");

    for(let i=0; i<TermWindowns.length; i++){
        TermWindowns[i].classList.add("hidden");
    }

    selectedTermID = "AllTerminal";
    AllTerminal.classList.remove("hidden");
    AllTerminal.scrollTop = AllTerminal.scrollHeight;

    sendbtn.style.backgroundColor = "var(--allTerminalClr)";

}

function sendBLE(){
    if(sendtext.value.length>0){
        writeBLE(sendtext.value);
        terminalLog(1, selectedTermID, new Date().toLocaleTimeString(), selectedTermID, sendtext.value);
        sendtext.value = "";
    }
}

function terminalLog(sending=0,term_id, curr_time, curr_dev_name,val, SCempty=0){
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
                if(SCempty){
                    TermWindowns[i].innerHTML+="Shortcut "+curr_dev_name+" doesn't have a value&#10;";
                }
                else{
                    TermWindowns[i].innerHTML+="["+curr_time+"] sent to All: "+val+"&#10;";
                }
            }
        }
        else{
            if(SCempty){
                curr_teminal.innerHTML+="Shortcut "+curr_dev_name+" doesn't have a value&#10;";
                AllTerminal.innerHTML+="Shortcut "+curr_dev_name+" doesn't have a value&#10;";        
            }
            else{
                curr_teminal.innerHTML+="["+curr_time+"] sent to "+curr_dev_name+": "+val+"&#10;";
                AllTerminal.innerHTML+="["+curr_time+"] sent to "+curr_dev_name+": "+val+"&#10;";
            }
        }
    }

    curr_teminal.scrollTop = curr_teminal.scrollHeight;
    AllTerminal.scrollTop = AllTerminal.scrollHeight;
}

function TerminalSettings(e){
    e = e || window.event;

    let TerminalSettings = document.getElementById("TerminalSettings"); 

    if(e.name=="hidden"){
        e.name = "visible";
        e.src = "/src/public/assets/check.png";
        
        TerminalSettings.style.display = "grid";
    }
    else{
        e.name = "hidden";
        e.src = "/src/public/assets/settings.jpg";

        TerminalSettings.style.display = "none";
    }
}

document.body.onclick = function(e){
    e = e || window.event;
    let TerminalSettingsDiv = document.getElementById("TerminalSettings");
    let TermSettingsElement = false

    for(let i=0; i<TerminalSettingsDiv.children.length; i++){
        if(TerminalSettingsDiv.children[i] == e.target){
            TermSettingsElement = true;
        }
    }

    if(e.target.id == "TerminalSettingsbtn" || e.target.id =="TerminalSettings" || TermSettingsElement){
        return;
    }

    let TerminalSettingsbtn = document.getElementById("TerminalSettingsbtn");
    if(TerminalSettingsbtn.name == "visible"){
        TerminalSettings(TerminalSettingsbtn);
    }
}

function TerminalColors(e){
    e = e || window.event;
    let terminals = terminalWin.getElementsByTagName('textarea');
    
    if(e.name=="TermColor"){
        for(let i=0; i<terminals.length; i++){
            terminals[i].style.backgroundColor = e.value;
        }
    }
    else{
        for(let i=0; i<terminals.length; i++){
            terminals[i].style.color = e.value;
        }
    }
}

function clearTerminal(){
    document.getElementById(selectedTermID).innerHTML = "";
}

function SCsettings(e){
    e = e || window.event;

    let SCbuttons = document.getElementsByClassName("shortcutsInner")[0].getElementsByTagName("button"); 
    let SCsettings = document.getElementsByClassName("shortcutsInputs");

    if(e.name=="hidden"){
        e.name = "visible";
        e.src = "/src/public/assets/check.png";
        
        for(let i=0; i<SCbuttons.length; i++){
            SCbuttons[i].style.display = "none";
            SCsettings[i].style.display = "block";
        }
    }
    else{
        e.name = "hidden";
        e.src = "/src/public/assets/settings.jpg";

        for(let i=0; i<SCsettings.length; i++){
            SCbuttons[i].style.display = "block";

            let SClabel = document.getElementById("labelSC"+i).value;
            let SCvalue = document.getElementById("valueSC"+i).value;
            
            if(SClabel.length>0){
                SCbuttons[i].innerText = SClabel;
            }
            if(SCvalue.length>0){
                SCbuttons[i].value = SCvalue;
            }

            SCsettings[i].style.display = "none";
        }
    }
}

function clearSCsettings(){
    let SCsettings = document.getElementsByClassName("shortcutsInputs");

    for(let i=0; i<SCsettings.length; i++){
        document.getElementById("SC"+i).innerText = "SC"+(i+1);
        document.getElementById("SC"+i).value = "";
        document.getElementById("labelSC"+i).value = "";
        document.getElementById("valueSC"+i).value = "";
    }
}

function SCsettingEnterKey(key_event){
    key_event = key_event || window.event;
    let tempKeyCode = key_event.which || key_event.keyCode;

    if(tempKeyCode==13){
        SCsettings(document.getElementById("SCsettingsbtn"));
    }
}

function shortcutClick(SCbutton){
    let SClabel = SCbutton.innerHTML;
    let SCvalue = SCbutton.value;
    if(SCvalue.length>0){
        writeBLE(SCvalue);
        terminalLog(1, selectedTermID, new Date().toLocaleTimeString(), selectedTermID, SCvalue);
    }
    else{
        terminalLog(1, selectedTermID, new Date().toLocaleTimeString(), SClabel, SCvalue, 1);
    }
}