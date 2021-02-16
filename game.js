var plateau=[];
var navires=[0,5,4,3,3,2];
var touches=0;
var finPartie=false;
var nbCoups=0;
var message=[];


message[0]="A l'eau !";
message[1]="Porte-avion touché !";
message[2]="Croiseur touché !";
message[3]="Contre-torpilleur touché !";
message[4]="Sous-marin touché !";
message[5]="Torpilleur touché !";
message[6]="Case déjà jouée !";
message[11]="Porte-avion coulé !";
message[12]="Croiseur coulé !";
message[13]="Contre-torpilleur coulé !";
message[14]="Sous-marin coulé !";
message[15]="Torpilleur coulé !";



var jouer=document.getElementById("jouer");

$(document).ready( function() {
  placeBateaux();

  
  $('td').click(function(){  // Des qu'il y a un TD qui est cliqué dans le html, 
    var x = $(this).attr('id'); // On captures l'ID du TD pour qu'il soit décomposé
    console.log(x.charCodeAt(0));
    jouerCoup(x); // On execute la fonction jouéCoup en lui envoyant comme paramètres l'ID
  });



  function conversion(position){ 
    var colonne=position.charCodeAt(0)-65; // recupere la premiere lettre (charCodeAT(0)) au rang 0, celui ci étant en ASCI majuscule, la lettre A commencant par 65, je lui retire 65 pour avoir un nombre entier. H se trouvant a la 73 position 8 eme position, il me renvoit 73 - 65 = 8
    var ligne=parseInt(position.slice(1))-1; // pareil pour la seconde lettre du mot 'H10', me renvoit ici 10 - 9 car mon tableau est un tableau de 10 case, donc de tab[O]-> tab[9]
    return {colonne:colonne, ligne:ligne};	//on retourne la ligne et la colonne eton nomme les variables. voir ligne(50 - 51 - 45 - 46) pourquoi le nommages peut etre utiles.
  }


  function getCodeCase(position){ // recupere la position par exemple H10
    var c=conversion(position); // utilise la fonction de conversion pour convertir le code H10 en deux entier utilisable pour mon tableau (voir fonction conversion)
    return plateau[c.ligne][c.colonne]; // on retourne la valeur qu'il y a dans la case du tableau [0,0,0,0,0,0,0,0,5,5] , admettons que la dernières cases correspond a la case H 10, donc la case tab[8][10], on obtiens donc le code 5
  }

  function setCodeCase(position,valeur){
    var c=conversion(position);
    plateau[c.ligne][c.colonne]=valeur; // change le contenu de la case  par exemple, dans le cas d'un touché de croiseur,
  }



  function majVueJeu(position,situation){// cette fonction est assez simple a comprendre. Ici on vas afficher les messages et modifier les couleurs.
    if(finPartie){
      alert(message[situation]+"\nVous avez coulé tous les navires en "+nbCoups+" coups");
      location.reload();
    }else{	
      if(situation != 6){
        nbCoups++;
      }
      $('#debug').prepend(message[situation] + '<br />');
    }
    var couleur;
    if (getCodeCase(position)==-6){
      couleur="#BBBBFF";
      document.getElementById(position).style.backgroundColor=couleur;
    }else{
      
      couleur="#FF0000";
      document.getElementById(position).style.backgroundColor=couleur;
    }
    	
  }



  function jouerCoup(position){
    
    var codeCase=getCodeCase(position); // On convertis l'ID qui est une chaine de caractères STRING(2) pour en retirer la colonne et la ligne, cette fonction renvoie un code, ce code serivira pour les messages et les couleurs message[0]="A l'eau !"; ....
 
    var situation=codeCase; 
    switch(codeCase){
      case 0: // dans le cas  ou le code case == 0, on met à jours la case de  la bonne couleurs. et on ecris dans la div  #debugg le messages ( à l'eau)
        setCodeCase(position,-6); // Envoie la situation -6 pour changer la case en bleu, et écrir à l'eau.
      break;
      case 1: case 2: case 3: case 4: case 5: // dans le cas ou l'on toujours un navires
        navires[codeCase]--; // var navires=[0,5,4,3,3,2]; dans le cas du croiseurs qui à le code au 5ème rang on vas donc retirer -1 au contenu de la case navire[5], j'aurais pu ici mettre 5 cases a mon tableau, et écrire navires[codeCase-1]-- aussi
        if(navires[codeCase]==0) // si le contenu de la case navire[5] est à 0, alors on change la situation pour dire a l'utilisateur que la bateau à été coulé
            {situation+=10;} // dans le cas ou il y'a a plus de code case correspondant au celui du même bateau, mettre la situation a codeCase (ex code case torpilleur = 2), 10 + 2 = torpilleur coulé
        setCodeCase(position,codeCase);// Ici on vas mettre à jour le code case en fonction  : le code sera forcement différent de -6 ou 6, pourquoi avoir choisis 6? si c'est 6, cases déjà joué, si c'est -6 à l'eau, si c'est autres choses, couleurs rouges, puis la position sert pour le messages dans le debugg

        touches++;
        if(touches==17){finPartie=true;}			
      break;
      default:
        situation=6;
    }
    majVueJeu(position,situation);
    console.log()
  }



  function placeBateau(ligneDepart,colonneDepart,vertical,code,longueur){
    var incrementLigne,incrementColonne;	
    var succes=true;
    if(vertical){
      incrementLigne=1;
      incrementColonne=0;
    }else{
      incrementLigne=0;
      incrementColonne=1;
    }
    for(var i=0;i<longueur;i++){ // gère un cas d'erreur si il y a déjà un bateau
      if(plateau[ligneDepart+i*incrementLigne][colonneDepart+i*incrementColonne]!=0){
        succes=false;
        break;		
      }
    }
    if(succes){
      for(var i=0;i<longueur;i++){ // met le code bateau (ex: torpilleur 2) au cases voulus.
        plateau[ligneDepart+i*incrementLigne][colonneDepart+i*incrementColonne]=code;
      }
    }

    return succes;
  }



  function positionHasardBateau(code,longueur){// math.random renvoit un chiffre entre 0 et 1, donc il faut le multiplier par le nombre de cases+1 et retirer la longueur du bateau pour etre sur de ne pas depasser le cadre
    var departLimite,depart;	
    var succes=false;
    while(!succes){
      departLimite=Math.floor(Math.random()*(11-longueur));
      depart=Math.floor(Math.random()*10);
      if(Math.random()<0.5){// fonction qui permet de determiner sur le bateau sera à l'horizontal ou vertical, si le chiffre est 0, 0.49999, le bateau sera à la verticale, sinon non.
        succes=placeBateau(departLimite,depart,true,code,longueur);
      }else{
        succes=placeBateau(depart,departLimite,false,code,longueur);
      }
    }
  }



  function placeBateaux(){ //permet de placer les bateaux
    for(var ligne=0;ligne<=9;ligne++){ //met tout le contenu du tableau plateau à 0
      plateau[ligne]=[0,0,0,0,0,0,0,0,0,0];
    }
    positionHasardBateau(5,2);	
    positionHasardBateau(4,3);
    positionHasardBateau(3,3);
    positionHasardBateau(2,4);
    positionHasardBateau(1,5);
  }



});






