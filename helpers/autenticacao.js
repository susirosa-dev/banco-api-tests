const request = require('supertest');
const { expect } = require('chai');
//require('dotenv').config(); 

const obterToken = async (usuario, senha) => {
    const respostaLogin =await request(process.env.BASE_URL)
        .post('/login')
        .set('Content-Type', 'application/json')  // Request body é JSON
        .send({
            username: usuario,
            senha: senha
        });     
   
    return respostaLogin.body.token;           
}   

// Exportar a função para que possa ser utilizada em outros arquivos de teste
module.exports = { obterToken };