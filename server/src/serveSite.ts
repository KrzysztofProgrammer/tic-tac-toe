import path from "path";
import {Express} from "express";

export function serveSite(app: Express) {
    const wwwDir = path.join(path.resolve(), '..', 'www');

    app.get('/', (req, res) => {
        const indexFile = path.join(wwwDir, 'index.html')
        res.sendFile(indexFile);
        // console.log(indexFile)
    });

    app.get('/socket.io.js', (req, res) => {
        const indexFile = path.join(wwwDir, 'socket.io.js')
        res.sendFile(indexFile);
        // console.log(indexFile)
    });

    app.get('/script.js', (req, res) => {
        const indexFile = path.join(wwwDir, 'script.js')
        res.sendFile(indexFile);
        // console.log(indexFile)
    });

    app.get('/view.css', (req, res) => {
        const indexFile = path.join(wwwDir, 'view.css')
        res.sendFile(indexFile);
        // console.log(indexFile)
    });
}