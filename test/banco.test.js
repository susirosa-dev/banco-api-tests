const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('../helpers/autenticacao'); // Importar a função de autenticação
require('dotenv').config();

// Trocar essa linha no package.json: "test": "mocha ./test/**/transferencias.test.js --timeout 200000 --reporter mochawesome"
// para: "test": "mocha ./test/**/*.test.js --timeout 200000 --reporter mochawesome"

describe('Testes de Transferência com login autorizado', () => {
    
    let token;    
    before(async () => {
        token = await obterToken(process.env.BANCO_USUARIO, process.env.BANCO_SENHA); // Obter o token usando a função de autenticação
    });
        
    it('Deve criar uma transferência', async () => {

        const response = await request(process.env.BASE_URL)
            .post('/transferencias')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)  // Set é para Headers
            .send({
                contaOrigem: 1,
                contaDestino: 2,
                valor: 100
            });

        expect(response.status).to.equal(201);
        //console.log('Transferência criada:', response.body);

    });

    it('Deve listar as transferências', async () => {

        const response = await request(process.env.BASE_URL)
            .get('/transferencias')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        console.log('Transferências:', response.body);
    });
});