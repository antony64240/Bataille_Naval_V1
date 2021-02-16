$(document).ready( function() {
    $('#Valider').click( function(event) {
        var Identifiant = $('input[name=Id]').val();
        var MotdePasse = $('input[name=Mdp]').val();
        if ((MotdePasse != '')&&(Identifiant!='')){
            alert('La valeur du champ prenom est : ' + Identifiant + 'et le mot des passe est ' + MotdePasse);
            window.location.replace("menu.html");
        }else{
            return false;
        }
        });

    
});
