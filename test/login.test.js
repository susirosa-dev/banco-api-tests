const request = require('supertest');
const { expect } = require('chai');


// Trocar essa linha no package.json: "test": "mocha ./test/**/transferencias.test.js --timeout 200000 --reporter mochawesome"
// para: "test": "mocha ./test/**/*.test.js --timeout 200000 --reporter mochawesome"

describe('Login Tests', () => {
    describe('POST /login', () => {
        it('Deve retornar 200 com um token em string, com credenciais validas', async () => {
            const response = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'julio.lima',
                    senha: '123456'
                });
            
            // Log the response body and status for debugging
            //console.log('Response body:', response.body); // Log the response body for debugging        
            //console.log('Response status:', response.status); // Log the response status for debugging  

            expect(response.status).to.equal(200);            
            expect(response.body.token).to.be.a('string').and.not.be.empty;
        })
    })
});