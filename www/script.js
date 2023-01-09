let gameBoard = [
    ['x','x','x'],
    ['x','x','x'],
    ['x','x','x'],
];

let gameFinish = false
let socket
let turn = ''
let gameSide = ''
let user = '';

function click(x, y) {
    if ( gameFinish ) { return }
    console.log("click", x, y, turn, gameSide)
    if (gameBoard[x][y] !== ''){
        alert('Nope!')
        return;
    }
    if (gameSide !== turn) {
        alert('This is not your turn');
        return;
    }
    socket.emit('turn', {x, y}, turnHandler);
}

function turnHandler(turnResponse) {
    console.log('Turn response ', turnResponse);
    gameBoard = turnResponse.gameBoard;
    turn = turnResponse.turn;
    show()
    if (turnResponse.winner) {
        finish();
    }
}

function restart(){
    clear();
    show();
    if (socket) {
        socket.disconnect();
        socket.connect();
    }
    const form = document.getElementById('form');
    form.hidden = false;
    form.removeEventListener('submit', submitHandler);
    form.addEventListener('submit', submitHandler);
    document.getElementById('gameBoard').hidden = true;
}

function submitHandler(e) {
    e.preventDefault();
    if (user !== '') {
        return
    }
    if (!socket){
        socket = io();
        socket.on('new-user', (data) => {
            console.log('New user ', data)
            document.getElementById('users').innerHTML = data.connections.map(x => x.user).join(',')
        });
        socket.on('out-user', (data) => {
            console.log('Left us ', data);
            document.getElementById('users').innerHTML = data.connections.map(x => x.user).join(',')
        });
        socket.on('turn', turnHandler);
    }
    const input = document.getElementById('input');
    if (input.value) {
        socket.emit('login', input.value, (loginResponse) =>{
            console.log('Login response ', loginResponse)
            if (loginResponse.error){
                alert('Server error ' + loginResponse.error)
                return
            }
            user = loginResponse.user;
            gameSide = loginResponse.gameSide;
            document.getElementById('user').innerHTML = user + ', you play as ' + gameSide;
            document.getElementById('users').innerHTML = loginResponse.connections.map(x => x.user).join(',')
            document.getElementById('form').hidden = true;
            document.getElementById('gameBoard').hidden = false;
            turn = loginResponse.turn
            show()
        });
        input.value = '';
    }
}

function clear() {
    gameFinish = false
    turn = '';
    gameSide = '';
    user = '';
    document.getElementById('user').innerHTML = '';
    document.getElementById('users').innerHTML = '';
    for(let x=0; x<3 ; x++) {
        for (let y = 0; y < 3; y++) {
            gameBoard[x][y] = ''
        }
    }
}

function finish() {
    gameFinish = true
    if (turn === 'x') {
        turn = 'o'
    } else {
        turn = 'x'
    }
    setTimeout(() => { document.getElementById("info").innerHTML = `winner: ${turn}`}, 1);
}

function show() {
    document.getElementById("turn").innerHTML=turn
    for(let x=0; x<3 ; x++){
        for(let y=0; y<3; y++){
            const atr="p" + x.toString() + y.toString()
            document.getElementById(atr).innerHTML=gameBoard[x][y]
        }
    }
}

