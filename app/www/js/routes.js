angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('paginaEmBranco', {
    url: '/branco',
    templateUrl: 'templates/paginaEmBranco.html',
    controller: 'paginaEmBrancoCtrl'
  })

  .state('tabsController.tipoDeVisita', {
    url: '/tipoVisita',
    views: {
      'tab1': {
        templateUrl: 'templates/tipoDeVisita.html',
        controller: 'tipoDeVisitaCtrl'
      }
    }
  })

  .state('alterarMeusDados', {
    url: '/alterarPerfil',
    templateUrl: 'templates/alterarMeusDados.html',
    controller: 'alterarMeusDadosCtrl'
  })

  .state('cadastroDeDependentes', {
    url: '/cadDependentes',
    templateUrl: 'templates/cadastroDeDependentes.html',
    controller: 'cadastroDeDependentesCtrl'
  })

  .state('alteraDependentes', {
    url: '/alteraDependente',
    templateUrl: 'templates/alteraDependentes.html',
    controller: 'alteraDependentesCtrl'
  })

  .state('dependentesCadastrados', {
    url: '/page12',
    templateUrl: 'templates/dependentesCadastrados.html',
    controller: 'dependentesCadastradosCtrl'
  })

  .state('cadastroDeInquilino', {
    url: '/cadInquilino',
    templateUrl: 'templates/cadastroDeInquilino.html',
    controller: 'cadastroDeInquilinoCtrl'
  })

  .state('cadastrarCondominio', {
    url: '/cadCondominio',
    templateUrl: 'templates/cadastrarCondominio.html',
    controller: 'cadastrarCondominioCtrl'
  })

  .state('tabsController.codigoLiberacao', {
    url: '/qrcode',
    views: {
      'tab2': {
        templateUrl: 'templates/codigoLiberacao.html',
        controller: 'codijgoLiberacaoCtrl'
      }
    }
  })

  .state('tabsController.liberaOEnviada', {
    url: '/sucesso-liberacao',
    views: {
      'tab1': {
        templateUrl: 'templates/liberaOEnviada.html',
        controller: 'liberaOEnviadaCtrl'
      }
    }
  })

  .state('criarEvento', {
    url: '/criar-evento',
    templateUrl: 'templates/criarEvento.html',
    controller: 'criarEventoCtrl'
  })

  .state('tabsController.ticketsRecebidos', {
    url: '/visitante',
    views: {
      'tab2': {
        templateUrl: 'templates/ticketsRecebidos.html',
        controller: 'ticketsRecebidosCtrl'
      }
    }
  })

  .state('tabsController.registrarVisita', {
    url: '/registrarVisita',
    views: {
      'tab1': {
        templateUrl: 'templates/registrarVisita.html',
        controller: 'registrarVisitaCtrl'
      }
    }
  })

  .state('tabsController.pessoal', {
    url: '/visitaPessoal',
    views: {
      'tab1': {
        templateUrl: 'templates/pessoal.html',
        controller: 'pessoalCtrl'
      }
    }
  })

  .state('tabsController.cancelarConvite', {
    url: '/cancelarConvite',
    views: {
      'tab1': {
        templateUrl: 'templates/cancelarConvite.html',
        controller: 'cancelarConviteCtrl'
      }
    }
  })

  .state('tabsController.profissional', {
    url: '/visitaProfissional',
    views: {
      'tab1': {
        templateUrl: 'templates/profissional.html',
        controller: 'profissionalCtrl'
      }
    }
  })

  .state('page23', {
    url: '/compartilhar',
    templateUrl: 'templates/page23.html',
    controller: 'page23Ctrl'
  })

  .state('infoConvite', {
    url: '/infoConvite',
    templateUrl: 'templates/infoConvite.html',
    controller: 'infoConviteCtrl'
  })

  .state('validarPorteiros', {
    url: '/validarPortaria',
    templateUrl: 'templates/validarPorteiros.html',
    controller: 'validarPorteirosCtrl'
  })

  .state('trocarSindico', {
    url: '/page15',
    templateUrl: 'templates/trocarSindico.html',
    controller: 'trocarSindicoCtrl'
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('signup', {
    url: '/page20',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

$urlRouterProvider.otherwise('/page1/registrarVisita')

  

});