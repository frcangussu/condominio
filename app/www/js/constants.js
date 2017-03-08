angular.module('app.constants', [])

.constant('PARAMS',{
    VALIDAR: {CPF:false, SENHA: false}
})

.constant('CONST', {
    REST: {IP: 'http://localhost:3000/api'},
    COORDENADAS:{LATITUDE:-15.794087,LONGITUDE:-47.887905}, //coordenadas de brasília
    MSG:  {
                CAD: {
                    CONDOMINIO: {
                        LOCAL: "localizacao não identificada",
                        ARQUIVO: "Selecione o arquivo com os dados dos moradores para que possamos efetuar o cadastro"
                    }
                }
    }
});
