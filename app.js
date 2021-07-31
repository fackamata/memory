const main = document.querySelector("main")
const header = document.querySelector("header")
const divLevel = document.getElementById("level")
const result = document.getElementById("result")
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
const levelEnd = document.getElementById("levelEnd")

class GameInit  {
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
        this.resultSet = false;
        
        // this.clickOnCard = document.addEventListener("click", this.cardClicked())
        // this.partieTimer = 0;
    
        main.style.display = 'block'
        divLevel.style.display = 'none'
        btnRetourLevel.style.display = 'block'
        cardContainer.innerHTML = '';
        
        
    }
    createCard(){
        // console.log("create Card")
         // on crop l'image contenant la liste des images pour les avoirs en individuelles.
        var cropImg = 0;
         // array pour les cartes
        var cardArray = [];        
        
        for(let i=0; i < 18; i++){
             
             var cardInner = document.createElement("div")
             cardInner.className = "flip-card-inner"
             cardInner.setAttribute("cardNb", i);
            //  var identifiant = 'img' + i;
             
             var cardFront = document.createElement("div")
             cardFront.className = "flip-card-front"
             var cardBack = document.createElement("div")
             cardBack.className = "flip-card-back"
             
             var cardContainer = document.createElement("div")
             cardContainer.className= "memory-card flip-card"
             
             var coverCard = document.createElement("div")
            coverCard.style.width = "100px"
            coverCard.style.height = "100px"
            coverCard.style.backgroundColor = "blue"
            coverCard.textContent = i

            var card = document.createElement("img")
            card.className= "front-face"
            card.setAttribute("src", "./cartes.png")
            var position = "0%" + cropImg + "%"
            // console.log("position : ", position)
            card.style.objectPosition = position
            card.style.width = "100px"
            card.style.height = "100px"
            card.style.objectFit = "cover"

            cardFront.appendChild(coverCard)
            cardBack.appendChild(card)
            cardInner.appendChild(cardFront)
            cardInner.appendChild(cardBack)
            cardContainer.appendChild(cardInner)

            cropImg += (100/17)
            // stock card in cardArray
            // console.log("cropImg :", cropImg)
            cardArray.push(cardContainer)
            // console.log(cardArray)
        }
        return cardArray
    }

    stockCardEachTurn(){

        let arrayToSelectFrom = this.createCard();

        for(let i = 0 ; i < this.nbCarte ; i++){
 
                let displayFirstCard = arrayToSelectFrom[i];

                this.arrayToClear.push(displayFirstCard)
                // console.log(displayFirstCard)

        }

        return this.arrayToClear;
        
    }
    clearCard(){
        cardContainer.empty;
    }

    displayCard(){
        console.log("display card")
        this.clearCard()
        let arrayCardDisplay = [];

        this.stockCardEachTurn()        

        this.arrayToClear.forEach(element => {
            // element.childNodes[0].setAttribute("set", 'a');
            arrayCardDisplay.push(element);
        });
        this.arrayToClear.forEach(element=> {
            // element.childNodes[0].setAttribute("reset", 'b');

            arrayCardDisplay.push(element);
            // Create a copy of it
            var clone = element.cloneNode(true);
            arrayCardDisplay.push(clone)
        });

        this.arrayToClear = [];

            while(arrayCardDisplay.length > 0){
                let randomNb = Math.floor(Math.random() * arrayCardDisplay.length)
                let cardToAdd = arrayCardDisplay.splice(randomNb, 1);
                // console.log(arrayCardDisplay)
                // console.log("card to add :" + cardToAdd)
                cardContainer.appendChild(cardToAdd[0])
                // $(cardToAdd[0]).clone().appendTo("#card_container");
            }
 
    };

    testMatch(){
        // console.log(this.testMatchArray)
        if (this.testMatchArray.length === 2 ){
            let attribute1 = this.testMatchArray[0].getAttribute("cardNb");
            let attribute2 = this.testMatchArray[1].getAttribute("cardNb");
            if(attribute1 === attribute2 ){                
                
                this.testMatchArray[0].classList.remove("clicked");
                this.testMatchArray[1].classList.remove("clicked");
                this.testMatchArray[0].className += " X"
                this.testMatchArray[1].className += " X"
                this.testMatchArray =[];
                this.cardFound += 1;
                
            }else{
                this.testMatchArray[0].classList.remove("clicked");
                this.testMatchArray[1].classList.remove("clicked");
                this.testMatchArray = [];
            }
        }           
        if (this.cardFound === this.nbCarte){
            console.log("win")
            this.resetEndOfGame();
            
        } 
    }


    counter(){
        // count time, fill progress bar
        // var time = this.temps;    
        var addWidth = (100/this.temps);
        // console.log("counter this.temps "+this.temps)
        var width = 0;
        // this.displayCard()
        var objetGeneral = this;
        console.log('l 165 ',this)

        // this.partieTimer = setInterval(function(){
        this.partieTimer = setInterval(function(){

            objetGeneral.temps -= 1;
            width += addWidth;
            progressBar.style.width = `${width}` + "%"
            span.textContent = objetGeneral.temps + "s"
            if (objetGeneral.temps === 0) {
                console.log("fin de partie");                
                objetGeneral.resetEndOfGame()        
            }
            return objetGeneral.temps
        }, 1000);
        // return partieTimer
    } // end of counter
    
    stopSetInterval() {
        clearInterval(this.partieTimer); 
      }

    resetEndOfGame(){
        console.log("end of game !")  
        main.style.display = "none"   
        this.stopSetInterval()
        
        divTime.textContent =  (this.refTemps - this.temps)
        divFound.textContent =  this.cardFound 
        divTries.textContent = this.tries/2 
        levelEnd.textContent =  this.level
        this.resultSet = true;
        result.style.display = 'block'
    }

    playGame(){
        console.log(this)
        this.counter()
        this.displayCard()
        this.createCard()
        // console.log(this.testMatchArray);
        let globalObj = this;
        var flipCardInner = document.querySelectorAll(".flip-card-inner")
        let nbFlipCard = flipCardInner.length
        for (let i = 0; i < nbFlipCard; i++) {
            flipCardInner[i].addEventListener('click',function(ev){
                let clickThis = this
                console.log('test', clickThis.className)
                let cardClicked = this;
                globalObj.tries += 1 ;
                const par = clickThis.className;
                const regex = /['clicked']/g;
                const reg = /['X']/g;
                const alreadyClicked = par.match(regex);
                const found = par.match(reg);
                if(found != null){
                    console.log(found[0])
                }
               
                setTimeout(function(){
                // const alreadyClicked = par.match(regex);
                if(alreadyClicked>5 || found > 6){
                    // if(clickThis.className != 'flip-card-inner clicked'){
                    }else{
                        globalObj.testMatchArray.push(cardClicked);
                        globalObj.testMatch();
                    }
                    
                },1000)
                this.className += " clicked";
                // this.testMatchArray = [];
                
            })
        }
        btnRetourLevel.addEventListener("click", function(){
            main.style.display = 'none'
            divLevel.style.display = 'block'
            result.style.display = 'none'
            globalObj.stopSetInterval()
            btnRetourLevel.style.display = 'none'
        })
    }
}

btnFacile.addEventListener("click", function(){
    var objGameFacile = new GameInit(4,120,"facile")
    objGameFacile.playGame()
})

btnMoyen.addEventListener("click", function(){
    var objGameMoyen = new GameInit(10,180,"moyen")
    objGameMoyen.playGame()
})

btnDur.addEventListener("click", function(){
    var objGameDur = new GameInit(18,240,"dur")
    objGameDur.playGame()
})

/* btnRetourLevel.addEventListener("click", function(){
    main.style.display = 'none'
    divLevel.style.display = 'block'
    result.style.display = 'none'
}) */
