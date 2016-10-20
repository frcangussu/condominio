angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  
  /**
   * FLUXO INICIAL
   * @description: cadastro inicial pós instalação 
   */

  .state('bemVindoAoAPP', {
    url: '/home',
    templateUrl: 'templates/inicio/bemVindoAoAPP.html',
    controller: 'bemVindoAoAPPCtrl'
  })

  .state('selecioneOSeuPapel', {
    url: '/selecione',
    templateUrl: 'templates/inicio/selecioneOSeuPapel.html',
    controller: 'selecioneOSeuPapelCtrl'
  })

  .state('cadastroDeSNdico', {
    url: '/cadSindico',
    templateUrl: 'templates/inicio/cadastroDeSNdico.html',
    controller: 'cadastroDeSNdicoCtrl'
  })

  .state('cadastroPortaria', {
    url: '/cadPortaria',
    templateUrl: 'templates/inicio/cadastroPortaria.html',
    controller: 'cadastroPortariaCtrl'
  })

  .state('cadastroEfetuadoComSucesso', {
    url: '/sucessoPortaria',
    templateUrl: 'templates/inicio/cadastroEfetuadoComSucesso.html',
    controller: 'cadastroEfetuadoComSucessoCtrl'
  })

  /**
   * FLUXO PRINCIPAL
   * @description: utilização do APP pós cadastro (pós fluxo inicial)
   */
  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
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

  .state('tabsController.ticketsRecebidos', {
    url: '/visitante',
    views: {
      'tab2': {
        templateUrl: 'templates/ticketsRecebidos.html',
        controller: 'ticketsRecebidosCtrl'
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

  .state('signup', {
    url: '/page20',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  // console.log(localStorage.home);
  // $urlRouterProvider.otherwise('/tabs/registrarVisita')
  // $urlRouterProvider.otherwise(localStorage.home)
  $urlRouterProvider.otherwise('/home');

});