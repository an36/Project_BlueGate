/* TopBarShadow.js - Changes the top navigation bar box-shadow to rgb. 
 *
 */


var config = {
    type: Phaser.WEBGL,
    width: 0,
    height: 0,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let rgbShadow = new Phaser.Game(config);
let CycleRedTurn = true;
let CycleGreenTurn = false;
let CycleBlueTurn = false;
let currCycleRed = 0;
let currCycleGreen = 0;
let currCycleBlue = 0;
let CycleRate = 1.3;
let topNavBar = document.getElementById("topNavBar");

function preload ()
{

}

function create ()
{

}

function update ()
{
    SetRGBCycle();
}

/*Makes the top nav bar shadow Cycle thorugh RGB colors*/
function SetRGBCycle(){
    topNavBar.style.boxShadow = "rgb("+currCycleRed+" "+currCycleGreen+" "+currCycleBlue+") 0px -12px 30px 5px";

    if(CycleRedTurn){
      if(currCycleRed>=255){
        if(currCycleBlue>0){
          currCycleBlue-=CycleRate;
          if(currCycleBlue<0){
            currCycleBlue=0;
          }
          return;
        }
        else{
          CycleGreenTurn = true;
          CycleRedTurn = false;
        }
      }
      else{
          currCycleRed+=CycleRate;
          if(currCycleRed>=255){
            currCycleRed=255;
          }
        return;
      }
    }
    
    if(CycleGreenTurn){
      if(currCycleGreen>=255){
        if(currCycleRed>0){
          currCycleRed-=CycleRate;
          if(currCycleRed<0){
            currCycleRed=0;
          }
          return;
        }
        else{
          CycleGreenTurn = false;
          CycleBlueTurn = true;
        }
      }
      else{
        currCycleGreen+=CycleRate;
        if(currCycleGreen>255){
          currCycleGreen=255;
        }
        return;
      }
    }
  
    if(CycleBlueTurn){
      if(currCycleBlue>=255){
        if(currCycleGreen>0){
          currCycleGreen-=CycleRate;
          if(currCycleGreen<0){
            currCycleGreen=0;
          }
          return;
        }
        else{
          CycleBlueTurn = false;
          CycleRedTurn = true;
          return;
        }
      }
      else{
        currCycleBlue+=CycleRate;
        if(currCycleBlue>255){
          currCycleBlue=255;
        }
        return;
      }
    }
  }