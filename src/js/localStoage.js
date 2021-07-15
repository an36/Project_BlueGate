

let userLocalStorage;   //will hold StorageEvent upon page load.
let userInProgress;
let pages;


/* <------------------------------------ User localStorage functions ------------------------------------> */
/*window event listeners to handle localStorage between taps and upon connection */
if (window.addEventListener) {
    window.addEventListener("storage", handle_storage, false);
} else {
    window.attachEvent("onstorage", handle_storage);
};

window.onload = function(){
    if(!resumePage()){
    // console.log("newPage() it is...");
        newPage();
    }
    else{
        pages++;
        savePage('pages',pages);
    }
}

window.onunload = function(){
    resumePage();
    if(pages>0){
        pages--;
        savePage('pages',pages);
    }
}

/*If there's no local storage, then initialize new local storage*/
function newPage(){
    userInProgress = 1;
    pages = 1
    savePage('pages',pages);
    savePage('options',JSON.stringify(options));
}

/*stores desired variables and app state on localStorage */
function savePage(index = undefined, value = undefined){
    if (!supportsLocalStorage()) { return false; }
    // console.log("in savePage()");
    localStorage.setItem('userInProg', userInProgress);
    
    if((typeof(index) !== 'string') || (value==undefined)){
        return;
    }
    else{
        localStorage.setItem(index, value);
    }
}

/*loads all of the stored variables and app state from localStorage */
function resumePage() {
    if (!supportsLocalStorage()) { return false; }
    userInProgress = parseInt(localStorage.getItem('userInProg')); 
    if (!isInt(userInProgress)) { return false; }
    // console.log("in resumePage()");
    
    /******load stuff in vars/arrays (as strings) here*******/
    pages = parseInt(localStorage.getItem('pages')); 
    
    options = JSON.parse(localStorage.getItem('options', options) || "[]");

    if(options.optionalServices.length > 1){
        for(let i=1; i<options.optionalServices.length; i++){
            let tempVal = options.optionalServices[i];
            optionalServs.innerHTML+="<option id=\""+tempVal+"\" value=\""+tempVal+"\">";
        }
    }

    return true;
}


/* <------------------------------------ Helper functions ------------------------------------> */
/*gets StorageEvent, and has a IE fallback mech.*/
function handle_storage(storageEvent) {
    if (!storageEvent) { storageEvent = window.event; } //fallback for IE 
    userLocalStorage = storageEvent;
}

/*Returns true if current browser supports localStorage */
function supportsLocalStorage() {
    return ('localStorage' in window) && window['localStorage'] !== null;
}

/*return true if passed argument is of type Integer */
function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}