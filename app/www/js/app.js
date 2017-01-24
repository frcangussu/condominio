// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'app.controllers',

// fluxo inicial
'app.bemVindoAoAPPCtrl',
'app.cadastroDeSindicoCtrl',
'app.cadastroEfetuadoComSucessoCtrl',
'app.cadastroRecepcaoCtrl',
'app.selecioneOSeuPapelCtrl',

// fluxo principal
'app.registrarVisitaCtrl',
'app.side-menu21Ctrl',
'app.alteraDependentesCtrl',
'app.alterarMeusDadosCtrl',
'app.cadastrarCondominioCtrl',
'app.cadastroDeDependentesCtrl',
'app.cadastroDeInquilinoCtrl',
'app.cancelarConviteCtrl',
'app.codigoLiberacaoCtrl',
'app.dependentesCadastradosCtrl',
'app.pessoalCtrl',
'app.profissionalCtrl',
'app.signupCtrl',
'app.ticketsRecebidosCtrl',
'app.tipoDeVisitaCtrl',
'app.trocarSindicoCtrl',
'app.validarPorteirosCtrl',

'app.routes', 'app.directives','app.services', 'app.constants', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  // console.log("app.js >>> ",localStorage);

  $ionicPlatform.ready(function() {

    localStorage.setItem('home', '/home');
    // console.log(" Passou app.js >>>>");

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
