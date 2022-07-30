const main = document.querySelector("main")
const header = document.querySelector("header")
const divLevel = document.getElementById("level")
const result = document.getElementById("result")
const loose = document.getElementById("loose")
const btnRetourLevel = document.getElementById("btn_retour_level")
const btnFacile = document.getElementById("btn_facile")
const btnMoyen = document.getElementById("btn_moyen")
const btnDur = document.getElementById("btn_dur")
const progressBar = document.getElementById("progressBar")
const barContainer = document.getElementById('barContainer');
const span = document.getElementById("timeText")
const cardContainer = document.getElementById("card_container")
const divTime = document.getElementById("divTime")
const divTries = document.getElementById("divTries")
const divFound = document.getElementById("divFound")
const divFound2 = document.getElementById("divFound2")
const levelEnd = document.getElementById("levelEnd")

    class GameInit  {
        // initialisation
        constructor (nbCarte, temps, level){
        this.nbCarte = nbCarte;
        this.temps = temps;
        this.refTemps = temps;
        this.cardFound = 0;
        this.level = level;
        this.tries = 0;
        this.idCard = "";
        this.testMatchArray = [];
        this.arrayToClear = [];
        this.idClicked = "";
        this.stockIdFind = [];
        this.partieTimer = null;
        this.resultat = false;
    
        main.style.display = 'block'
        divLevel.style.display = 'none'
        btnRetourLevel.style.display = 'block'
        cardContainer.innerHTML = '';
        progressBar.style.backgroundColor = "#2B7A78"

    }
    sizeForScreen(){

        let screenSize = cardContainer.offsetHeight * cardContainer.clientWidth 
        let border = ((screenSize / (this.nbCarte ))**0.5)/1.8

        if (border > 130){
            border = 130
        }
        let cardWidth = border;
        let cardFontSize = ( cardWidth - (border/10)) ;
        return [cardWidth,cardFontSize]
    }

    createCard(){
         // crop main image to get our 18 game's card.
        //  return an array of our 18 cards in HTML element with class and attribute
        var cropImg = 0;
        var cardArray = [];  
        
        let valFromScreen = this.sizeForScreen();
        let size = valFromScreen[0];
        let fontSize = valFromScreen[1];

        
        for(let i=0; i < 18; i++){
            var cardContainer = document.createElement("div")
            cardContainer.className= "flip-card"
            let cardHtml=
`<div class="flip-card-inner" cardnb="${i} " style="width: ${size}px; height: ${size}px;">
    <div class="flip-card-front" style="width: ${size}px; height: ${size}px;">
        <div style="width: ${size}px; height: ${size}px; font-size: ${fontSize}px;">?</div>
    </div>
    <div class="flip-card-back">
        <img class="front-face" src="./cartes.png" style="object-position: 0% ${cropImg}%; width: ${size}px; height: ${size}px; object-fit: cover;">
    </div>
</div>`
            cardContainer.innerHTML += cardHtml;
            cropImg += (100/17)
            cardArray.push(cardContainer)
        }
        return cardArray
    }

    stockCardEachTurn(){
        // select the number of card needed for the game
        // return an array of x unique card (x depend on the level choosen)
        let arrayToSelectFrom = this.createCard();
        for(let i = 0 ; i < this.nbCarte ; i++){ 
                let displayFirstCard = arrayToSelectFrom[i];
                this.arrayToClear.push(displayFirstCard)
        }
        return this.arrayToClear;
    }

    clearCard(){
        // clear the HTML container
        cardContainer.empty;
    }

    displayCard(){
        this.clearCard();
        let arrayCardDisplay = [];
        this.stockCardEachTurn();

        this.arrayToClear.forEach(element => {
            arrayCardDisplay.push(element);
            var clone = element.cloneNode(true);
            arrayCardDisplay.push(clone);
        }); 

        this.arrayToClear = [];

        while(arrayCardDisplay.length > 0){
            let randomNb = Math.floor(Math.random() * arrayCardDisplay.length);
            let cardToAdd = arrayCardDisplay.splice(randomNb, 1);
            cardContainer.appendChild(cardToAdd[0]);
        }
    };

    testMatch(){
        if (this.testMatchArray.length === 2 ){
            let attribute1 = this.testMatchArray[0].getAttribute("cardNb");
            let attribute2 = this.testMatchArray[1].getAttribute("cardNb");
            if(attribute1 === attribute2 ){                     
                this.testMatchArray[0].classList.remove("C");
                this.testMatchArray[1].classList.remove("C");
                this.testMatchArray[0].className += " X"
                this.testMatchArray[1].className += " X"
                this.testMatchArray =[];
                this.cardFound += 1;                
            }else{
                this.testMatchArray[0].classList.remove("C");
                this.testMatchArray[1].classList.remove("C");
                this.testMatchArray = [];
            }
        }           
        if (this.cardFound === this.nbCarte){
            this.resultat = true
            this.resetEndOfGame();            
        } 
    }

    counter(){  
        var addWidth = (100/this.temps);
        var width = 0;
        var objetGeneral = this;

        this.partieTimer = setInterval(function(){
            objetGeneral.temps -= 1;
            width += addWidth;
            progressBar.style.width = `${width}` + "%"
            if(width >=75){
                    progressBar.style.backgroundColor = "#f03939"
            }
            span.textContent = objetGeneral.temps + "s"
            if (objetGeneral.temps === 0) {               
                objetGeneral.resetEndOfGame()        
            }
            return objetGeneral.temps
        }, 1000);
    } 
    
    stopSetInterval() {
        // to stop setInterval()
         clearInterval(this.partieTimer); 
      }

    resetEndOfGame(){
        // re-initialise the game
        main.style.display = "none"   
        this.stopSetInterval()
        if(this.resultat){
            divTime.textContent =  (this.refTemps - this.temps)
            divFound.textContent =  this.cardFound 
            divTries.textContent = this.tries/2 
            levelEnd.textContent =  this.level
            result.style.display = 'block'
        }else{
            divFound2.textContent =  (this.cardFound>1) ? this.cardFound +" cartes." : this.cardFound +" carte.";
            loose.style.display = "block"
        }        
    }

    playGame(){
        this.counter()
        this.createCard()
        this.displayCard()
        let globalObj = this;
        var flipCardInner = document.querySelectorAll(".flip-card-inner")
        let nbFlipCard = flipCardInner.length

        for (let i = 0; i < nbFlipCard; i++) {
            flipCardInner[i].addEventListener('click',function(ev){
                let cardClicked = this;
                globalObj.tries += 1 ;

                const par = cardClicked.className;
                const regex = /['C']/g;
                const reg = /['X']/g;
                const alreadyClicked = par.match(regex);
                const found = par.match(reg);
               
                setTimeout(function(){
                if(alreadyClicked != null || found != null){
                    }else{
                        globalObj.testMatchArray.push(cardClicked);
                        globalObj.testMatch();
                    }                    
                },1000)
                this.className += " C";
            })
        }

        btnRetourLevel.addEventListener("click", function(){    
            main.style.display = 'none'
            divLevel.style.display = 'block'
            result.style.display = 'none'
            loose.style.display = 'none'
            globalObj.stopSetInterval()
            btnRetourLevel.style.display = 'none'
        })
    }
}

btnFacile.addEventListener("click", function(){
    var objGameFacile = new GameInit(9,120,"facile")
    objGameFacile.playGame()
})

btnMoyen.addEventListener("click", function(){
    var objGameMoyen = new GameInit(13,180,"moyen")
    objGameMoyen.playGame()
})

btnDur.addEventListener("click", function(){
    var objGameDur = new GameInit(18,240,"dur")
    objGameDur.playGame()
})