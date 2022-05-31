import { Router } from "express";
import { login } from "../repository/usuarioRepository.js";

const server= Router();

server.post('/usuario/login' , async (req, resp) =>{
    try{ 
        const {email,senha} = req.body;
        const resposta= await login(email, senha);

        if(!resposta) throw new Error("Email ou senha inválidos");

        resp.send(resposta)
    } catch(err){
        resp.status(404).send({
            
            erro: err.message
        });
    }
})

export default server;