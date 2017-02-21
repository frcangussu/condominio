var express = require('express');
var jwt = require('jsonwebtoken');
var router  = express.Router();
var conviteController = require('../controllers/conviteController');

router.post('/enviar', function (req, resp){
  req.body.token = jwt.sign({ nome_visitante: req.body.nome_visitante, telefone_visitante: req.body.telefone_visitante, tipo_visita: req.body.tipo_visita }, req.body.uid, { expiresIn: '1 day'});
  // console.log(req.body);

  conviteController.registrarConvidado(req.body, function (response){
    // resp.status(200).json(response);
    if(response.type !== 'ERROR') {
      // Registra visita no
      conviteController.enviarConvite(req.body, function (response){
        resp.status(200).json(response);
      });
    } else {
        resp.status(400).json({type: 'ERROR', mensagem: 'Não foi possivel enviar o convite'});
    }

  });

});

router.delete('/receber', function (req, resp){
// Procurar morador
  conviteController.buscarMorador(req.body.token, function (response){

    if(response.type){
      conviteController.receberConvidado({type: response.type, mensagem: response.mensagem, token: req.body.token}, function (response){
        resp.status(200).json(response);
      });
    } else {
      var dados_visitante = response;
      console.log('receber - router');
      conviteController.receberConvidado({telefone_morador: response.telefone_morador, telefone_visitante: response.telefone_visitante, token: req.body.token}, function (response){
        if(response.type == 'ERROR')
          resp.status(400).json(dados_visitante);
        else
          resp.status(200).json(dados_visitante);
      });
    }

  });

});

router.delete('/cancelar', function (req, resp){
  console.log(req.query.telefone_visitante);
  var params = {
    telefone_visitante: req.query.telefone_visitante,
    telefone_morador: req.query.telefone_morador
  };

  conviteController.cancelar(params, function (response){
    if(response.type == 'ERROR')
      resp.status(400).json(response);
    else
      resp.status(200).json(response);
  } );
});

router.get('/listar', function (req, resp){
    conviteController.listar({telefone: req.query.telefone}, function (response){
      if(response.type)
        resp.status(200).json(response);
      else
        resp.status(200).json(response);
    });
});

module.exports = router;
