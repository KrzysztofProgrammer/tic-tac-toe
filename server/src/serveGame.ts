import { Server } from "socket.io";
import http from "http";

let gameBoard = [
    ['x','x','x'],
    ['x','x','x'],
    ['x','x','x'],
];

export interface connArrItem {
    id: string;
    user: string;
    gameSide: string;
}

export function serveGame(server: http.Server) {
    let turn = 'x'
    let connections: connArrItem[] = []
    clear();
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('user connected', socket.id);
        connections.push({id: socket.id, user:'', gameSide: ''});

        socket.on('login', (user, callback) => {
            if (connections.length > 2){
                console.log('Too many connections')
                callback({error: 'Technical difficulties - too many connections'})
                return
            }
            let gameSide = getGameSide(connections);
            console.log('Login game side', gameSide);
            for (let x=0; x<connections.length; x++){
                if (connections[x].id === socket.id){
                    if (connections[x].user !== ''){
                        console.log('Login already provided')
                        callback({error: 'Login already provided'})
                        return
                    }
                    connections[x].user = user
                    connections[x].gameSide = gameSide
                }
            }
            console.log('user logged: ', user, connections.length)
            const loginResponse = { user, connections, gameSide, turn };
            callback( loginResponse )
            socket.broadcast.emit('new-user', loginResponse )
        });

        socket.on('disconnect', () => {
            let idx = connections.findIndex((item)=>item.id === socket.id)
            const user = connections[idx].user;
            connections.splice(idx, 1)
            console.log('user disconnected, reset', connections);
            socket.broadcast.emit('out-user', { user, connections });
            clear();
        });

        socket.on('turn', (data, callback) => {
            console.log('TURN ', data);
            gameBoard[data.x][data.y] = turn;
            let winner = checkWin();
            if (turn === 'x') {
                turn = 'o';
            } else {
                turn = 'x';
            }
            callback({ gameBoard, turn, winner });
            socket.broadcast.emit('turn', { gameBoard, turn, winner });
        });

    });
}

function clear() {
    for(let x=0; x<3 ; x++) {
        for (let y = 0; y < 3; y++) {
            gameBoard[x][y] = ''
        }
    }
}

function getGameSide(connections: connArrItem[]) {
    for (let x=0; x<connections.length; x++){
        if (connections[x].gameSide === 'x') {
            return 'o'
        }
        if (connections[x].gameSide === 'o') {
            return 'x'
        }
    }
    return 'o'
}

function checkWin(){
    let winner = false;
    for (let x=0; x<3; x++){
        winner = winner || checkColumn(x)
        winner = winner || checkRow(x)
    }
    winner = winner || checkDiagonal()
    return winner;
}

function checkColumn(nr: number){
    return (gameBoard[0][nr] === gameBoard[1][nr] && gameBoard[1][nr] === gameBoard[2][nr] && gameBoard[1][nr] !== '')
}

function checkRow(nr: number){
    return (gameBoard[nr][0] === gameBoard[nr][1] && gameBoard[nr][1] === gameBoard[nr][2] && gameBoard[nr][1] !== '')
}

function checkDiagonal(){
    return (gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2] && gameBoard[1][1] !== '')||(gameBoard[2][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[0][2] && gameBoard[1][1] !== '')
}