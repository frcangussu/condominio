angular.module('app.constants', [])

.constant('CONST', {
    REST: {IP: 'http://192.168.43.197:3000/rest'},
    // REST: {IP: 'http://localhost:3000/rest'},
    MSG:  {
                CAD: {
                    CONDOMINIO: {
                        LOCAL: "localizacao não identificada",
                        ARQUIVO: "Selecione o arquivo com os dados dos moradores para que possamos efetuar o cadastro"
                    }
                }
    }
});