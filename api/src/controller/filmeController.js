import { Router } from "express";
import { con } from "../repository/connection.js";
import { cadastrarFilme, buscarfilmes, buscarfilmeId, buscarfilmeNome, removerFilme, alterarFilme, adicionarImagem, } from "../repository/filmeRepository.js";
import multer from 'multer'

const server= Router();
const upload= multer({dest:'storage/capasFilmes' })

server.post('/filme', async (req, resp) =>{
    try{
        const filmeInserido= req.body;

        if(!filmeInserido.nome) throw new Error('coloque um nome');
        if(!filmeInserido.sinopse) throw new Error('Adicione uma sinopse');
        if(filmeInserido.avaliacao== undefined || filmeInserido.avaliacao>10 || filmeInserido.avaliacao<0) throw new Error('adicione uma avaliação válida!');
        if(!filmeInserido.lancamento) throw new Error('coloque uma data');
        if(!filmeInserido.disponivel) throw new Error('filme indefinido');
        const filme = await cadastrarFilme(filmeInserido);

        resp.send(filme);
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme' , async (req,resp)=>{
    try{
        const resposta= await buscarfilmes();
        resp.send(resposta)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})


server.get('/filme/busca' , async (req,resp)=>{
    try{
        const { nome } = req.query;

        const resposta= await buscarfilmeNome(nome);

        if(resposta.length ==0)
        resp.status(404).send({
            ops:"filme não encontrado!"
        })
        else
        resp.send(resposta)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/:id' , async (req,resp)=>{
    try{
        const id= Number(req.params.id);

        const resposta= await buscarfilmeId(id);

        if(!resposta)
        resp.status(404).send({
            ops:"filme não encontrado!"
        })
        else
        resp.send(resposta)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp)=>{
    try{
    const {id}= req.params;
    const resposta= await removerFilme(id);
    
    if(resposta != 1) throw new Error('filme não pode ser removido');

    resp.status(204).send();
} catch(err){
    resp.status(404).send({
        erro:err.message
    })
}
})

server.put('/filme/:id', (req, resp)=>{
    try{
    const filmeAlterado= req.body;
    const {id}= req.params;

    if(!filmeAlterado.nome) throw new Error('coloque um nome');
    if(!filmeAlterado.sinopse) throw new Error('Adicione uma sinopse');
    if(filmeAlterado.avaliacao== undefined || filmeAlterado.avaliacao>10 || filmeAlterado.avaliacao<0) throw new Error('adicione uma avaliação válida!');
    if(!filmeAlterado.lancamento) throw new Error('coloque uma data');
    if(filmeAlterado.disponivel==undefined) throw new Error('filme indefinido');

    const filme= alterarFilme(id, filmeAlterado);
    resp.send(filme)
}catch(err){
    resp.status(400).send({
        erro:err.message
    })
}
})

server.put('/filme/:id/imagem',upload.single('capa'), async (req, resp)=>{
    try{
        const { id } = req.params;
        const imagem= req.file.path;
        const resposta= await adicionarImagem(imagem,id);
        if(resposta != 1)
         throw new Error('A imagem não pode ser salva')
    
         resp.status(204).send()

    } catch(err){
        resp.status(404).send({
            erro: err.message
        })
    }
})

export default server