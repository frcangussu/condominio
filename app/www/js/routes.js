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
    controller: 'bemVindoAoAPPCtrl', controllerAs: 'vm'
  })

  .state('selecioneOSeuPapel', {
    url: '/selecione',
    templateUrl: 'templates/inicio/selecioneOSeuPapel.html',
    controller: 'selecioneOSeuPapelCtrl', controllerAs: 'vm'
  })

  .state('cadastroDeSindico', {
    url: '/cadSindico',
    templateUrl: 'templates/inicio/cadastroDeSindico.html',
    controller: 'cadastroDeSindicoCtrl', controllerAs: 'vm'
  })

  .state('cadastroRecepcao', {
    url: '/cadRecepcao',
    templateUrl: 'templates/inicio/cadastroRecepcao.html',
    controller: 'cadastroRecepcaoCtrl', controllerAs: 'vm'
  })

  .state('cadastroEfetuadoComSucesso', {
    url: '/sucessoRecepcao',
    templateUrl: 'templates/inicio/cadastroEfetuadoComSucesso.html',
    controller: 'cadastroEfetuadoComSucessoCtrl', controllerAs: 'vm'
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
        controller: 'registrarVisitaCtrl',
        controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.tipoDeVisita', {
    url: '/tipoVisita',
    views: {
      'tab1': {
        templateUrl: 'templates/tipoDeVisita.html',
        controller: 'tipoDeVisitaCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('alterarMeusDados', {
    url: '/alterarPerfil',
    templateUrl: 'templates/alterarMeusDados.html',
    controller: 'alterarMeusDadosCtrl', controllerAs: 'vm'
  })

  .state('cadastroDeDependentes', {
    url: '/cadDependentes',
    templateUrl: 'templates/cadastroDeDependentes.html',
    controller: 'cadastroDeDependentesCtrl', controllerAs: 'vm'
  })

  .state('alteraDependentes', {
    url: '/alteraDependente',
    templateUrl: 'templates/alteraDependentes.html',
    controller: 'alteraDependentesCtrl', controllerAs: 'vm'
  })

  .state('dependentesCadastrados', {
    url: '/page12',
    templateUrl: 'templates/dependentesCadastrados.html',
    controller: 'dependentesCadastradosCtrl', controllerAs: 'vm'
  })

  .state('cadastroDeInquilino', {
    url: '/cadInquilino',
    templateUrl: 'templates/cadastroDeInquilino.html',
    controller: 'cadastroDeInquilinoCtrl', controllerAs: 'vm'
  })

  .state('cadastrarCondominio', {
    url: '/cadCondominio',
    templateUrl: 'templates/cadastrarCondominio.html',
    controller: 'cadastrarCondominioCtrl', controllerAs: 'vm'
  })

  .state('tabsController.codigoLiberacao', {
    url: '/qrcode',
    views: {
      'tab2': {
        templateUrl: 'templates/codigoLiberacao.html',
        controller: 'codijgoLiberacaoCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.liberaOEnviada', {
    url: '/sucesso-liberacao',
    views: {
      'tab1': {
        templateUrl: 'templates/liberaOEnviada.html',
        controller: 'liberaOEnviadaCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.ticketsRecebidos', {
    url: '/visitante',
    views: {
      'tab2': {
        templateUrl: 'templates/ticketsRecebidos.html',
        controller: 'ticketsRecebidosCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.pessoal', {
    url: '/visitaPessoal/:contato',
    views: {
      'tab1': {
        templateUrl: 'templates/pessoal.html',
        controller: 'pessoalCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.cancelarConvite', {
    url: '/cancelarConvite',
    views: {
      'tab1': {
        templateUrl: 'templates/cancelarConvite.html',
        controller: 'cancelarConviteCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('tabsController.profissional', {
    url: '/visitaProfissional',
    views: {
      'tab1': {
        templateUrl: 'templates/profissional.html',
        controller: 'profissionalCtrl', controllerAs: 'vm'
      }
    }
  })

  .state('infoConvite', {
    url: '/infoConvite',
    templateUrl: 'templates/infoConvite.html',
    controller: 'infoConviteCtrl', controllerAs: 'vm'
  })

  .state('validarPorteiros', {
    url: '/validarRecepcao',
    templateUrl: 'templates/validarPorteiros.html',
    controller: 'validarPorteirosCtrl', controllerAs: 'vm'
  })

  .state('trocarSindico', {
    url: '/page15',
    templateUrl: 'templates/trocarSindico.html',
    controller: 'trocarSindicoCtrl', controllerAs: 'vm'
  })

  .state('signup', {
    url: '/page20',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl', controllerAs: 'vm'
  });

  // console.log(localStorage.home);
  // $urlRouterProvider.otherwise('/tabs/registrarVisita')
  // console.log("routes.js >>> ",localStorage);
  // $urlRouterProvider.otherwise(localStorage.home);

  var home = localStorage.home || "/home";

  $urlRouterProvider.otherwise(home);
  // $urlRouterProvider.otherwise('/tabs/registrarVisita');
  // $urlRouterProvider.otherwise(localStorage.home);
  // $urlRouterProvider.otherwise('/tabsController.profissional');

});
