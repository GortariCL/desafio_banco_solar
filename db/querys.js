//Requerimiento 1
const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Feer1985',
    database: 'bancosolar',
    port: 5432
});
//Funcion para registro de usuarios
const registrarUsuario = async (datos) => {
    try {
        const consulta = {
            text: 'INSERT INTO usuarios (nombre, balance, estado) VALUES ($1, $2, true);',
            values: datos,
            rowMode: 'Array'
        }
        const result = await pool.query(consulta);
        return result;
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//Funcion para mostrar usuarios en html
const getUsuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE estado = true');
        return result;
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//Funcion para editar usuario
const editarUsuario = async (datos) => {
    try {
        const consulta = {
            text: `UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1;`,
            values: datos
        }
        const result = await pool.query(consulta);
        return result;
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//Funcion para eliminar usuario
const eliminarUsuario = async (id) => {
    try {
        const result = await pool.query(`UPDATE usuarios SET estado = false WHERE id = ${id};`);
        return result;
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//Funcion para registrar transferencia (Requerimiento 2)
const registrarTransferencia = async (datos) => {
    try {
        const registroTransferencia = {
            text: `INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuarios WHERE nombre = $1),(SELECT id FROM usuarios WHERE nombre = $2), $3, '${moment().format("L")} ${moment().format("LTS")}');`,
            values: [datos[0], datos[1], Number(datos[2])],
        }
        const transferenciaEmisor = {
            text: 'UPDATE usuarios SET balance = balance - $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1);',
            values: [datos[0], Number(datos[2])],
        }
        const transferenciaReceptor = {
            text: 'UPDATE usuarios SET balance = balance + $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1);',
            values: [datos[1], Number(datos[2])],
        }
        try {
            await pool.query('BEGIN');
            await pool.query(registroTransferencia);
            await pool.query(transferenciaEmisor);
            await pool.query(transferenciaReceptor);
            await pool.query('COMMIT');
            return true;
        } catch (err) { //(Requerimiento 4)
            console.log(`El error se encuentra en la tabla: ${err.table}.
            El detalle del error es: ${err.detail}.
            El código de error es: ${err.code}.
            Restricción violada: ${err.constraint}`);
            await pool.query('ROLLBACK');
        }
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}
//Funcion para obtener historial de transferencias
const getTransferencias = async () => {
    try {
        const consulta = {
            text: 'SELECT fecha, usuarios.nombre, (SELECT nombre FROM usuarios WHERE usuarios.id = transferencias.receptor), monto FROM transferencias INNER JOIN usuarios on transferencias.emisor = usuarios.id;',
            rowMode: 'array'
        }
        const result = await pool.query(consulta);
        return result;
    } catch (err) {//(Requerimiento 4)
        console.log(`El error se encuentra en la tabla: ${err.table}.
        El detalle del error es: ${err.detail}.
        El código de error es: ${err.code}.
        Restricción violada: ${err.constraint}`);
    }
}


module.exports = {
    registrarUsuario,
    getUsuarios,
    editarUsuario,
    eliminarUsuario,
    registrarTransferencia,
    getTransferencias
}