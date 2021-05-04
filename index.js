document.addEventListener('DOMContentLoaded',()=>{
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const vienvieciai = document.querySelectorAll('.vienvietis');
    const dvivieciai = document.querySelectorAll('.dvivietis');
    const trivieciai = document.querySelectorAll('.trivietis');
    const keturvieciai = document.querySelectorAll('.keturvietis');
    const startGameButton = document.querySelector('#start');
    const RotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    const chatDisplay = document.querySelector('#chat');
    const inputChat = document.querySelector('#inputchat');
    const userSquares = [];
    const computerSquares =[];
    const width = 10;
    const resetButton = document.querySelector('#reset');
    const nametag = document.querySelector('#nametag');
    let isHorizontal = true;
    let isGameOver = false;
    let currentPlayer = 'user';
    //boards
    var person = prompt("Enter your name", "Player");
    nametag.innerHTML = person;
    function createBoard(grid, squares, width){
        for(let i = 0; i< width*width;i++){
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard(userGrid, userSquares, width);
    createBoard(computerGrid, computerSquares, width);
    var EnemyShips = [
        {id:0,hitsNeeded:1,isAlive:true,hits:0},{id:1,hitsNeeded:1,isAlive:true,hits:0,hits:0},{id:2,hitsNeeded:1,isAlive:true,hits:0},{id:3,hitsNeeded:1,isAlive:true,hits:0},
        {id:4,hitsNeeded:2,isAlive:true,hits:0},{id:5,hitsNeeded:2,isAlive:true,hits:0},{id:6,hitsNeeded:2,isAlive:true,hits:0},
        {id:7,hitsNeeded:3,isAlive:true,hits:0},{id:8,hitsNeeded:3,isAlive:true,hits:0},
        {id:9,hitsNeeded:4,isAlive:true,hits:0}
        ];
        var UserShips = [    
            {id:0,hitsNeeded:1,isAlive:true,hits:0},{id:1,hitsNeeded:1,isAlive:true,hits:0,hits:0},{id:2,hitsNeeded:1,isAlive:true,hits:0},{id:3,hitsNeeded:1,isAlive:true,hits:0},
            {id:4,hitsNeeded:2,isAlive:true,hits:0},{id:5,hitsNeeded:2,isAlive:true,hits:0},{id:6,hitsNeeded:2,isAlive:true,hits:0},
            {id:7,hitsNeeded:3,isAlive:true,hits:0},{id:8,hitsNeeded:3,isAlive:true,hits:0},
            {id:9,hitsNeeded:4,isAlive:true,hits:0}
        ];
    //Ships
    function resetShipInfo(){
        for(var i = 0; i<10;i++){
            EnemyShips[i].hits = 0;
            EnemyShips[i].isAlive=true;
            UserShips[i].hits = 0;
            UserShips[i].isAlive = true;
            turnDisplay.innerHTML = 'Your turn';
            isGameOver = false;
        }
        for(var i = 0; i<width*width;i++){
            computerSquares[i].dataset.shipid="-1";
            computerSquares[i].className="";
            userSquares[i].classList.remove('miss');
            userSquares[i].classList.remove('hit');
            userSquares[i].classList.remove('Exploded');

            //userSquares[i].dataset.shipid="-1";
        }
    }
    function addTextToChat(){
        if(chatDisplay.childElementCount < 7){
            var text = "<br>" + person +": "+ inputChat.value;
            var t = document.createElement('text');
            t.innerHTML = text;
            chatDisplay.appendChild(t);
        }
        else{
            chatDisplay.firstChild.remove();
            var text = "<br>" + person +": "+ inputChat.value;
            var t = document.createElement('text');
            t.innerHTML = text;
            chatDisplay.appendChild(t);
        }
    }
    inputChat.addEventListener('keypress',function(e){
        if(e.key == 'Enter'){
            addTextToChat();
            inputChat.value="";
        }
    });
    const shipArray =[
        {
            name: 'vienvietiss',
            directions:[[0]]
        },
        {
            name: 'dvivietiss',
            directions:[[0,1], [0,width]]
        },
        {
            name:'trivietiss',
            directions:[[0,1,2],[0,width,width*2]]
        },
        {
            name:'keturvietiss',
            directions:[[0,1,2,3],[0,width,width*2,width*3]]
        }
    ]
    function clearComputerShips(){
        for(var i = 0; i<computerSquares.length;i++){

           computerSquares[i].className = "";
        }
    }
    function generate(ship, id){
        var randomDirection = Math.floor(Math.random()*ship.directions.length);
        var current = ship.directions[randomDirection];
        console.log(current);
        var randomStart = Math.floor(Math.random() * (width*width - 0));
        console.log(randomStart);
        var ok = false;
        var numeris = Math.floor(randomStart/10); // kelinta eilute
        const lastIndex = current[current.length-1];
        const currentLength = current.length; 
        var liekana = randomStart%10;
        if(Math.floor((randomStart + lastIndex))<=99 && !computerSquares[randomStart].classList.contains('taken') && !computerSquares[randomStart].classList.contains('core'))
            ok = true;
        else{ok=false;}
        if(randomDirection==0 && ok){ //horizontaliai
            direction = 1;
            if(Math.floor((randomStart + lastIndex)/10)!=numeris)
            //if(!current.some(index => Math.floor((randomStart + index)/10)!=numeris))
                ok = false;
            //if(!current.some(index => Math.floor((randomStart + index)/10)>99))
            if(current.some(index => (computerSquares[index + randomStart].classList.contains('taken') || computerSquares[index + randomStart].classList.contains('core'))))
                ok = false;
        }
        else if(randomDirection==1 && ok){ //vertikaliai
            direction = 10;
            //ok = true;
            if(current.some(index => (computerSquares[index + randomStart].classList.contains('taken') || computerSquares[index + randomStart].classList.contains('core'))))
                ok = false;
        }
        if(ok){
            current.forEach(index => computerSquares[randomStart + index].classList.add('core',ship.name));
            current.forEach(index => computerSquares[randomStart + index].dataset.shipid = id);
            for(var i = 0; i< currentLength;i++){
                var theindex = randomStart + current[i];
                if(randomDirection == 0){
                    if(theindex - width >=0){
                        computerSquares[theindex - width].classList.add('taken');
                        if(theindex - width - 1 >=0 && Math.floor((theindex - width - 1)/10) == numeris - Math.floor(width/10))
                            computerSquares[theindex - width - 1].classList.add('taken');
                        if(theindex - width + 1 >=0 && Math.floor((theindex - width + 1)/10) == numeris - Math.floor(width/10))
                            computerSquares[theindex - width + 1].classList.add('taken');
                    }
                    if(theindex + width <=99){
                        computerSquares[theindex + width].classList.add('taken');
                        if(theindex + width - 1 <=99 && Math.floor((theindex + width - 1)/10) == numeris + Math.floor(width/10))
                            computerSquares[theindex + width - 1].classList.add('taken');
                        if(theindex + width - 1 <=99 && Math.floor((theindex + width + 1)/10) == numeris + Math.floor(width/10))
                            computerSquares[theindex + width + 1].classList.add('taken');
                    }
                    if(theindex - 1 >= 0 && Math.floor((theindex - 1)/10) == numeris)
                        if(!computerSquares[theindex - 1].classList.contains('core'))
                            computerSquares[theindex - 1].classList.add('taken');
                    if(theindex + 1 <= 99 && Math.floor((theindex + 1)/10) == numeris)
                        if(!computerSquares[theindex + 1].classList.contains('core'))
                            computerSquares[theindex + 1].classList.add('taken');
            }
            else{

                if(theindex - 1 >=0 ){
                    if(Math.floor((theindex - 1)/10) == numeris+i){
                        computerSquares[theindex - 1].classList.add('taken');
                        if(theindex - width - 1 >=0 &&((theindex - width - 1)%10 == liekana - 1))
                            computerSquares[theindex - width - 1].classList.add('taken');
                    }
                    if(theindex - width + 1 >=0 && ((theindex - width + 1)%10 == liekana + 1))
                        computerSquares[theindex - width + 1].classList.add('taken');
                }
                if(theindex + 1 <=99 ){
                    if(Math.floor((theindex + 1)/10) == numeris+i){
                        computerSquares[theindex + 1].classList.add('taken');
                        if(theindex + width + 1 <=99 && ((theindex + width + 1)%10 == liekana + 1))
                            computerSquares[theindex + width + 1].classList.add('taken');
                    }
                    if(theindex + width - 1 <=99 && ((theindex + width - 1)%10) == liekana -1)
                        computerSquares[theindex + width - 1].classList.add('taken');
    
                }
                if(theindex - width >= 0)
                    if(!computerSquares[theindex - width].classList.contains('core'))
                        computerSquares[theindex - width].classList.add('taken');
                if(theindex + width <= 99)
                    if(!computerSquares[theindex + width].classList.contains('core'))
                        computerSquares[theindex + width].classList.add('taken');
            }
        }
    }
    else {
        generate(ship,id);
    }
    
    }

    function generateComputerShips(){
        clearComputerShips();
    
        generate(shipArray[3],9);
    
        generate(shipArray[2],8);
        generate(shipArray[2],7);


        generate(shipArray[1],6);
        generate(shipArray[1],5);
        generate(shipArray[1],4);

                
        generate(shipArray[0],3);
        generate(shipArray[0],2);
        generate(shipArray[0],1);
        generate(shipArray[0],0);
    }
    //rotation

    function rotation(){
            vienvieciai[0].classList.toggle('vienvietish');
            vienvieciai[1].classList.toggle('vienvietish');
            vienvieciai[2].classList.toggle('vienvietish');
            vienvieciai[3].classList.toggle('vienvietish');
            vienvieciai[0].classList.toggle('vienvietis');
            vienvieciai[1].classList.toggle('vienvietis');
            vienvieciai[2].classList.toggle('vienvietis');
            vienvieciai[3].classList.toggle('vienvietis');

            dvivieciai[0].classList.toggle('dvivietish');
            dvivieciai[1].classList.toggle('dvivietish');
            dvivieciai[2].classList.toggle('dvivietish');
            dvivieciai[0].classList.toggle('dvivietis');
            dvivieciai[1].classList.toggle('dvivietis');
            dvivieciai[2].classList.toggle('dvivietis');
            
            trivieciai[0].classList.toggle('trivietish');
            trivieciai[1].classList.toggle('trivietish');
            trivieciai[0].classList.toggle('trivietis');
            trivieciai[1].classList.toggle('trivietis');

            keturvieciai[0].classList.toggle('keturvietish');
            keturvieciai[0].classList.toggle('keturvietis');
            isHorizontal = !isHorizontal;
    }
    RotateButton.addEventListener('click', rotation);

    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;
    ships.forEach(ship => ship.addEventListener('mousedown', (e) =>{
        selectedShipNameWithIndex = e.target.id;
    }))
    function dragStart(){
        draggedShip = this;
        shipType=this.classList[1];
        givenID = this.getElementsByTagName('div')[0].dataset.shipid;
        console.log(givenID);
        console.log(draggedShip);
        console.log(this.classList[1]);
        draggedShipLength = parseInt(this.getElementsByTagName('div').length);
    }
    function dragOver(e) {
        e.preventDefault();
    }
    function dragEnter(e){
        e.preventDefault();
    }
    function dragLeave(e){

    }
    function dragEnd(){

    }
    function dragDrop(){
        console.log(this);
        selectedID = parseInt(this.dataset.id);
        var ok = true;
        numeris = Math.floor(selectedID/10);
        liekana = selectedID%10; // kelintas stulpelis
        if(isHorizontal && Math.floor((selectedID+draggedShipLength-1)/10)==Math.floor(selectedID/10)){
            
            for(var i = 0; i<draggedShipLength;i++)
                if(userSquares[selectedID+i].classList.contains('shipElement') || userSquares[selectedID+i].classList.contains('taken'))
                    ok = false;
            if(ok){
                for(var i = 0; i<draggedShipLength;i++){
                    userSquares[selectedID+i].classList.add('shipElement');
                    userSquares[selectedID+i].dataset.shipid = givenID;
                }
                for(var i = 0; i<draggedShipLength;i++){
                    theindex = selectedID+i;
                    if(theindex - width >=0){
                        userSquares[theindex - width].classList.add('taken');
                        if(theindex - width - 1 >=0 && Math.floor((theindex - width - 1)/10) == numeris - Math.floor(width/10))
                            userSquares[theindex - width - 1].classList.add('taken');
                        if(theindex - width + 1 >=0 && Math.floor((theindex - width + 1)/10) == numeris - Math.floor(width/10))
                            userSquares[theindex - width + 1].classList.add('taken');
                    }
                    if(theindex + width <=99){
                        userSquares[theindex + width].classList.add('taken');
                        if(theindex + width - 1 <=99 && Math.floor((theindex + width - 1)/10) == numeris + Math.floor(width/10))
                            userSquares[theindex + width - 1].classList.add('taken');
                        if(theindex + width - 1 <=99 && Math.floor((theindex + width + 1)/10) == numeris + Math.floor(width/10))
                            userSquares[theindex + width + 1].classList.add('taken');
                    }
                    if(theindex - 1 >= 0 && Math.floor((theindex - 1)/10) == numeris)
                        if(!userSquares[theindex - 1].classList.contains('shipElement'))
                            userSquares[theindex - 1].classList.add('taken');
                    if(theindex + 1 <= 99 && Math.floor((theindex + 1)/10) == numeris)
                        if(!userSquares[theindex + 1].classList.contains('shipElement'))
                            userSquares[theindex + 1].classList.add('taken');
                    }
                    console.log("removing..");
                    displayGrid.removeChild(draggedShip);
                }
            }
        else if(!isHorizontal && selectedID+(draggedShipLength-1)*10<=99){
            for(var i = 0; i<draggedShipLength;i++)
                if(userSquares[selectedID+i*10].classList.contains('shipElement') || userSquares[selectedID+i*10].classList.contains('taken'))
                    ok = false;
            if(ok){
                for(var i = 0; i<draggedShipLength;i++){
                    userSquares[selectedID+i*10].classList.add('shipElement');
                    userSquares[selectedID+i*10].dataset.shipid = givenID;
                }
                for(var i = 0; i<draggedShipLength; i++){
                    theindex = selectedID+i*10;
                    console.log((theindex - 1)%10, liekana-1);
                    if(theindex - 1 >=0){
                        if(Math.floor((theindex - 1)/10) == numeris+i){
                            userSquares[theindex - 1].classList.add('taken');
                            if(theindex - width - 1 >=0 && ((theindex - width - 1)%10 == liekana-1))
                                userSquares[theindex - width - 1].classList.add('taken');
                        }
                        
                        if(theindex - width + 1 >=0 && ((theindex - width + 1)%10 == liekana+1))
                            userSquares[theindex - width + 1].classList.add('taken');
                    }
                    console.log(((theindex + width - 1)%10, liekana-1));
                    if(theindex + 1 <=99){
                        if(Math.floor((theindex + 1)/10) == numeris+i){
                            userSquares[theindex + 1].classList.add('taken');
                        if(theindex + width + 1 <=99 && ((theindex + width + 1)%10 == liekana + 1))
                            userSquares[theindex + width + 1].classList.add('taken');
                        }
                        console.log("sitas");
                        console.log((theindex + width - 1)%10);
                        console.log(liekana-1);
                        if(theindex + width - 1 <=99 && ((theindex + width - 1)%10 == liekana-1))
                            userSquares[theindex + width - 1].classList.add('taken');

                    }
                    if(theindex - width >= 0)
                        if(!userSquares[theindex - width].classList.contains('shipElement'))
                            userSquares[theindex - width].classList.add('taken');
                    if(theindex + width <= 99)
                        if(!userSquares[theindex + width].classList.contains('shipElement'))
                            userSquares[theindex + width].classList.add('taken');
                }
                console.log("removing..");
                displayGrid.removeChild(draggedShip);
            }
        }
    }
    function resetShips(){
        turnDisplay.classList.remove('huge');
        computerSquares.forEach(square => square.removeEventListener('click', sendSquare));
        console.log("Veikia");
        var length = userSquares.length;
        for(var i = 0; i<length;i++){
            userSquares[i].className="";
            userSquares[i].dataset.shipid="-1";
            computerSquares[i].className="";
            computerSquares[i].dataset.shipid="-1";
        }
        ships.forEach(ship => displayGrid.appendChild(ship));
        
    }
    resetButton.addEventListener('click', resetShips);
    
    function sendSquare(){
        revealSquare(this);
    }
    var isPlayerWinner;

    function playGame(){
        if(displayGrid.getElementsByTagName('div').length == 0){
            var alive = 0;
            var yourAlive = 0;
            for(var i = 0; i<10;i++){
                if(EnemyShips[i].isAlive == true)
                    alive++;
                if(UserShips[i].isAlive == true)
                    yourAlive++;
            }
            infoDisplay.innerHTML = "Enemy Ships: " + alive + "<br>" + "Your ships: " + yourAlive;
            computerSquares.forEach(square => square.removeEventListener('click', sendSquare));
            if(isGameOver){
                endTheGame()
                return;
            }
            if(currentPlayer == 'user'){
                turnDisplay.innerHTML = 'Your Turn';
                computerSquares.forEach(square => square.addEventListener('click', sendSquare));
            }
            else if(currentPlayer == 'computer'){
                turnDisplay.innerHTML = "Opponent's turn";
                var randomSquare = userSquares[Math.floor(Math.random()*(width*width))];
                if(!randomSquare.classList.contains('miss') && !randomSquare.classList.contains('hit') && !randomSquare.classList.contains('Exploded'))
                    revealSquare(randomSquare);
                else playGame();
            }
        }
        else{
            turnDisplay.innerHTML = "Please drag all ships to the game board!";
        }
    }
    function endTheGame(){
        turnDisplay.classList.add('huge');
        if(isPlayerWinner)
            turnDisplay.innerHTML = 'YOU WIN';
        else turnDisplay.innerHTML = 'YOU LOSE';

    }
    startGameButton.addEventListener('click',resetShipInfo);
    startGameButton.addEventListener('click', generateComputerShips);
    startGameButton.addEventListener('click',playGame);

    function explodeShip(id,isPlayer){
        for(var i = 0; i<width*width;i++){
            if(isPlayer == true){
                if(computerSquares[i].dataset.shipid == id)
                    computerSquares[i].classList.add('Exploded');
            }
            else if (isPlayer == false){
                if(userSquares[i].dataset.shipid == id)
                    userSquares[i].classList.add('Exploded');
            }
        }
    }

    function revealSquare(square){
        if((square.classList.contains('core') || square.classList.contains('shipElement')) && (!square.classList.contains('hit'))){
            square.classList.add('hit');
            shipIndex = parseInt(square.dataset.shipid);
            if(currentPlayer=='user'){
                var hitShip = EnemyShips.find( index => index.id == shipIndex);
                hitShip.hits+=1;
                if(hitShip.hitsNeeded == hitShip.hits){
                    hitShip.isAlive = false;
                    explodeShip(shipIndex, true);
                    if(!EnemyShips.some(index => index.isAlive == true)){
                        isGameOver = true;
                        isPlayerWinner = true;
                        console.log("YOU WIN");
                    
                    }
                }
                console.log(EnemyShips);
            }
            else if(currentPlayer=='computer'){
                var hitShip = UserShips.find( index => index.id == shipIndex);
                hitShip.hits+=1;
                if(hitShip.hitsNeeded == hitShip.hits){
                    hitShip.isAlive = false;
                    explodeShip(shipIndex, false);
                    console.log("OK");
                    if(!UserShips.some(index => index.isAlive == true)){
                        isGameOver = true;
                        isPlayerWinner = false;
                        console.log("YOU LOSE");
                    
                    }
                }
                console.log(UserShips);
            }
            /*
            if(currentPlayer == 'computer')
                currentPlayer = 'user'
            else currentPlayer = 'computer';
            */
        }
        else if(!square.classList.contains('miss') && !square.classList.contains('core') && !square.classList.contains('shipElement')){
            square.classList.add('miss');
            if(currentPlayer == 'computer')
                currentPlayer = 'user'
            else currentPlayer = 'computer';
        }
        playGame();
    }

})
