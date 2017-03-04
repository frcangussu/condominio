angular.module('app.constants', [])

.constant('PARAMS',{
    VALIDAR: {CPF:false, SENHA: false}
})

.constant('CONST', {
<<<<<<< HEAD
    REST: {IP: 'http://192.168.0.7:3000/rest'},
=======
    // REST: {IP: 'http://192.168.43.197:3000/rest'},
>>>>>>> 2dd2bcb82853968bd1ef7607178c5b7dc90b01b1
    // REST: {IP: 'http://localhost:3000/rest'},
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
