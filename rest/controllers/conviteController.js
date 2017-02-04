var Condominio = require('../models/condominio');
var jwt = require('jsonwebtoken');

exports.registrarConvidado = function(params, callback) {
  Condominio.update(
    {titulares:{$elemMatch:{telefone:params.telefone_morador}}}, // query
    {$push:{ "titulares.$.convidados":{nome_visitante: params.nome_visitante ,telefone_visitante: params.telefone_visitante, tipo_visita: params.tipo_visita, token: params.token} } }, // objeto para salvar
    function (error,response) { // callback
     if(error) {
       callback({type: 'ERROR', mensagem: 'Não foi possivel registrar convidado.'});
     } else {
       callback({type: 'INFO', mensagem: 'Convite enviado com sucesso.'});
     }
   }
 );
};

exports.enviarConvite = function (params, callback){

  // Registra o convite no visitante
  Condominio.update(
    {titulares:{$elemMatch:{telefone:params.telefone_visitante}}}, // query
    {$push:{ "titulares.$.convites": {nome_morador: params.nome_morador, telefone_morador: params.telefone_morador, token: params.token} } }, // objeto para salvar
    function (error,response) { // callback
     if(error) {
       callback({type: 'ERROR', mensagem: 'Não foi possivel gerar convite.'});
     }
     else {
       callback({type: 'INFO', mensagem: 'Convite enviado com sucesso.'});
     }
   }
 );
};

exports.receberConvidado = function (params, callback){
  console.log('receber - morador');

  // Retira o convite no morador que o enviou
  Condominio.update(
    { titulares:{ $elemMatch: { convidados: { $elemMatch: {token : params.token }}}}}, // query
    {$pull:{ "titulares.$.convidados": {token: params.token} } }, // objeto para deletar
    function (error,response){ // callback

      // Se deu algun error
     if(error){
       callback({type: 'ERROR', mensagem: 'Convite inválido.'});


     } else { // Sucesso
         console.log('receber - visitante');

         // Retira convite no visitante
         Condominio.update(
           { titulares:{ $elemMatch:{ convites: { $elemMatch: { token: params.token}}}}}, // query
           {$pull:{ "titulares.$.convites": {token: params.token} }}, // objeto para deletar
           function (error,response){ // callback

             // Error
            if(error){
              callback({type: 'ERROR', mensagem: 'Convite inválido.'});

            // Sucesso
            } else {


              if(params.type) // Se token esta vencido
                callback({type: params.type, mensagem: params.mensagem});
              else // Sucesso
                callback({type: 'INFO', mensagem: 'Convite recebido com sucesso.'});
            }

          }
        );
     }
   }
 );
};

exports.buscarMorador = function (token, callback){
  console.log('controller - busca');

  // Procura pelo token
  Condominio.find({ titulares:{$elemMatch:{convidados: {$elemMatch:{token: token}}}}}, {"titulares.$" : 1, "_id": 0}, function (error, response){

    // Se deu error ou token inixistente
    if((error || response === null) || response.length < 1){
      console.log('deu error');
      callback({type: 'ERROR', mensagem: 'O convite esta inválido.'});

      // Se o token e existente
    } else {
      console.log('sucesso');
      // Verifica se o token está válido e descriptografa
      jwt.verify(token, response[0].titulares[0].uid, function(err, decoded) {
        if (err) {
          console.log('token inválido.');
          callback({type: 'ERROR', mensagem: 'O convite está vencido!'});

        } else {
          console.log('token válido.');
          callback(decoded);

        }
      });
    }
  });
};
