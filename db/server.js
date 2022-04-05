const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const { registrarUsuario, getUsuarios, editarUsuario, eliminarUsuario, registrarTransferencia, getTransferencias } = require('./querys');

const port = 3000;

http.createServer(async (req, res) => {
    //Disponibilizando html
    if (req.url == '/' && req.method == 'GET') {
        fs.readFile(path.join(__dirname, '..', 'index.html'), (err, html) => {
            if (err) { //(Requerimiento 4)
                res.statusCode = 500; //(Requerimiento 5)
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            }
        });
    }
    //Disponibilizando css
    if (req.url == '/style') {
        fs.readFile(path.join(__dirname, '..', '/assets/css/style.css'), (err, css) => {
            if (err) { //(Requerimiento 4)
                res.statusCode = 500; //(Requerimiento 5)
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/css');
                res.end(css);
            }
        });
    }
    //Disponibilizando javascript 
    if (req.url == '/script') {
        fs.readFile(path.join(__dirname, '..', '/assets/js/script.js'), (err, js) => {
            if (err) { //(Requerimiento 4)
                res.statusCode = 500; //(Requerimiento 5)
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(js);
            }
        });
    }
    //Disponibilizando favicon
    if (req.url == '/favicon') {
        fs.readFile(path.join(__dirname, '..', '/assets/img/favicon_banco.png'), (err, icon) => {
            if (err) { //(Requerimiento 4)
                res.statusCode = 500;//(Requerimiento 5)
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(icon);
            }
        });
    }
    //Disponibilizando logo
    if (req.url == '/logo') {
        fs.readFile(path.join(__dirname, '..', '/assets/img/logo.png'), (err, icon) => {
            if (err) { //(Requerimiento 4)
                res.statusCode = 500;//(Requerimiento 5)
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/javascript');
                res.end(icon);
            }
        });
    }
    //Ruta con metodo POST para registrar nuevo usuario (Requerimiento 3)
    if (req.url == '/usuario' && req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const datos = Object.values(JSON.parse(body));
                const result = await registrarUsuario(datos);
                res.statusCode = 201;//(Requerimiento 5)
                res.end(JSON.stringify(result));
            } catch (err) { //(Requerimiento 4)
                res.statusCode = 500;//(Requerimiento 5)
                res.end('Problema en el servidor => ', err);
            }
        });
    }
    //Ruta con metodo GET para mostrar usuarios (Requerimiento 3)
    if (req.url == '/usuarios' && req.method == 'GET') {
        try {
            const usuarios = await getUsuarios();
            res.statusCode = 201;//(Requerimiento 5)
            res.end(JSON.stringify(usuarios.rows));
        } catch (err) { //(Requerimiento 4)
            res.statusCode = 500;//(Requerimiento 5)
            res.end('Problema en el servidor => ', err);
        }
    }
    //Ruta con metodo PUT para editar un usuario
    if (req.url.startsWith('/usuario') && req.method == 'PUT') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const datos = Object.values(JSON.parse(body));
                const result = await editarUsuario(datos);
                res.statusCode = 201;//(Requerimiento 5)
                res.end(JSON.stringify(result));
            } catch (err) { //(Requerimiento 4)
                res.statusCode = 500;//(Requerimiento 5)
                res.end('Problema en el servidor => ', err);
            }
        });
    }
    //Ruta con metodo DELETE para eliminar del registro al usuario, se realiza UPDATE para cambiar estado de false a true (Requerimiento 3)
    if (req.url.startsWith('/usuario') && req.method == 'DELETE') {
        try {
            const { id } = url.parse(req.url, true).query;
            const result = await eliminarUsuario(id);
            res.statusCode = 201;//(Requerimiento 5)
            res.end(JSON.stringify(result));
        } catch (err) { //(Requerimiento 4)
            res.statusCode = 500;//(Requerimiento 5)
            res.end('Problema en el servidor => ', err);
        }
    }
    //Ruta con metodo post para registrar una nueva transferencia
    if (req.url == '/transferencia' && req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const datos = Object.values(JSON.parse(body));
                const result = await registrarTransferencia(datos);
                if (typeof result == 'string') {
                    const objError = {
                        error: result,
                    }
                    if (result == '23514') {
                        res.end(JSON.stringify(objError));
                    }
                } else {
                    res.statusCode = 201;//(Requerimiento 5)
                    res.end(JSON.stringify(result));
                }
            } catch (err) { //(Requerimiento 4)
                res.statusCode = 500;//(Requerimiento 5)
                res.end('Problema en el servidor => ', err);
            }
        });
    }
    //Ruta con metodo GET para mostrar historial de transferencias en html
    if (req.url == '/transferencias' && req.method == 'GET') {
        try {
            const transferencias = await getTransferencias();
            res.statusCode = 201;//(Requerimiento 5)
            res.end(JSON.stringify(transferencias.rows));
        } catch (err) { //(Requerimiento 4)
            res.statusCode = 500;//(Requerimiento 5)
            res.end('Problema en el servidor => ', err);
        }
    }

}).listen(port, () => console.log(`Server on => ${port}`));