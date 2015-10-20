//Fonction qui retourne un nombre aléatoire entre les deux valeurs fournies
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Constructeur de l'objet Joueur
function Joueur(posX, posY, arme, vie, color){
	this.posX = posX;
	this.posY = posY;
	this.arme = arme;
	this.vie = vie;
	this.color = color;
}

//Constructeur de l'objet Arme
function Arme(posX, posY, degats){
	this.posX = posX;
	this.posY = posY;
	this.degats = degats;
}

//Fonction recevant deux coordonnées, renvoie le DOM de la case correspondant aux coordonnées
function getter(posX, posY){
  var plateauHTML = document.getElementById('plateau');
  return plateauHTML.getElementsByClassName("ligne")[posX].getElementsByClassName("case")[posY];
}

var joueur1=null;
var joueur2=null;

var arme1=null;
var arme2=null;
var arme3=null;
var arme4=null;

//On créé un objet Game, il va nous aider à gérer le tour par tour
var game = {
	firstPlayerTurn : true
}

//Initialisation du tableau plateau
var plateau = [];

//Fonction qui vérifie si le déplacement est possible
function canPlay(c_x, c_y, x, y, otherPlayer){
	
	var advColor = game.firstPlayerTurn === 1 ? joueur1.color : joueur2.color; //On prends la couleur de l'adversaire
	
	if((c_x !== x) && (c_y !== y)) {return false;} // Vérification si clic : Diagonale
	if((c_x === x) && (c_y === y)) {return false;} //si clic : Lui même
	if(getter(x,y).style.backgroundColor === "black") {return false;} //si clic : Un mur
	
	var tmp_x, tmp_y;
	tmp_x = c_x;
	tmp_y = c_y;
	
	//On passe à la vérification case par case dans le cas horizontal et vertical
	
	if(x === c_x) //Dans le cas horizontal
	{
		if(y > c_y) //Dans le cas vers la droite
		{
			var diff = y - c_y;
			if(diff > 3){return false;} //Si le déplacement fait + de 3 cases
			
			while(tmp_y < y)
			{
				if(getter(x, tmp_y).style.backgroundColor === "black")
				{
					return false;
				}
				tmp_y++;
			}
		}
		
		else if(y < c_y)// Vers la gauche
		{
			var diff = c_y - y;
			if(diff > 3){return false;} //+ de 3 cases
			
			while(tmp_y > y)
			{
				if(getter(x, tmp_y).style.backgroundColor === "black")
				{
					return false;
				}
				tmp_y--;
			}
		}
	}
	
	else if(y === c_y) // Dans le cas vertical
	{
		if(x > c_x) // Vers le bas
		{
			var diff = x-c_x;
			if(diff > 3){return false;}//+ de 3 cases
			
			while(tmp_x < x)
			{
				if(getter(tmp_x, y).style.backgroundColor === "black")
				{
					return false;
				}
				tmp_x++;
			}
		}
		
		else if(x < c_x)//Vers le haut
		{
			var diff = c_x-x;
			if(diff > 3){return false;}//+ de 3 cases
			
			while(tmp_x > x)
			{
				if(getter(tmp_x, y).style.backgroundColor === "black")
				{
					return false;
				}
				tmp_x--;
			}
		}
	}
	return true; //Si tout va bien, on return true pour autoriser le déplacement
}

//Fonction qui va gérer l'évènement du clic du joueur sur le plateau
function userClick(clickX, clickY)
{
	var nb_joueur = game.firstPlayerTurn ? "2" : "1";
	var nb_autre_joueur = game.firstPlayerTurn ? "1" : "2";
	
	var nextCell = getter(clickX, clickY);
	var currentPlayer = game.firstPlayerTurn === true ? joueur1 : joueur2;
	var otherPlayer = game.firstPlayerTurn === true ? joueur2 : joueur1;
	
	//On fait appelle à la fonction qui vérifie le déplacement. Si elle retourne TRUE, on rentre dans le switch
	if(canPlay(currentPlayer.posX, currentPlayer.posY, clickX, clickY, otherPlayer)){
		
		var currentCell = getter(currentPlayer.posX, currentPlayer.posY);
		
		switch(nextCell.style.backgroundColor){
			case "white" : //Le cas où le joueur clique sur une case vide
			
				currentCell.style.backgroundColor = "white";
				currentCell.innerHTML = "";
				plateau[currentPlayer.posX][currentPlayer.posY] = "";
				
				currentPlayer.posX = clickX;
				currentPlayer.posY = clickY;
				
				nextCell.style.backgroundColor = currentPlayer.color;
				nextCell.innerHTML = currentPlayer.arme + ", " + currentPlayer.vie;
				plateau[currentPlayer.posX][currentPlayer.posY] = currentPlayer;
				
				break;
			case "yellow" : // Le cas où le joueur clique sur une case où il y a une arme
			
				currentCell.style.backgroundColor = "yellow";
				currentCell.innerHTML = currentPlayer.arme;
				plateau[currentPlayer.posX][currentPlayer.posY] = plateau[clickX][clickY];
				
				currentPlayer.posX = clickX;
				currentPlayer.posY = clickY;
				
				nextCell.style.backgroundColor = currentPlayer.color;
				var arme_sol = plateau[clickX][clickY];
				currentPlayer.arme = arme_sol.degats;
				nextCell.innerHTML = currentPlayer.arme + ", " + currentPlayer.vie;
				plateau[currentPlayer.posX][currentPlayer.posY] = currentPlayer;
			
				break;
			default : //Le défault correspond au cas où le joueur clique sur l'autre joueur (combat !)
					plateau[clickX][clickY].vie = plateau[clickX][clickY].vie - currentPlayer.arme;
					nextCell.innerHTML = plateau[clickX][clickY].arme + ", " + plateau[clickX][clickY].vie;
					if(plateau[clickX][clickY].vie <= 0)
					{
						alert("Joueur" + nb_joueur + " a perdu ! Game over !");
						
					}
			break;
		}
		
		game.firstPlayerTurn = !game.firstPlayerTurn; //Au tour de l'autre joueur
		
	}
	
	//Si canPlay retourne FALSE, on affiche un message d'erreur
	else{
		alert("mauvaise case !");
	}
}

//On créé la fonction d'initialisation du jeu, elle s'occupera de créer tout les éléments au début.

function init() {
	var armes_list = []; //Tableau des armes
	var plateauHTML = document.getElementById('plateau'); // On récupère le plateau de jeu HTML

	// On va parcourir toutes les cases du tableau pour leur affecter le statut vide ou inaccessible
	for (var i = 0; i < 10; i++) {
		plateau[i] = [];
		for (var j = 0; j < 10; j++) {
				var cellule = plateauHTML.getElementsByClassName("ligne")[i].getElementsByClassName("case")[j];
				cellule.style.backgroundColor = "white";
				cellule.innerHTML = "";
		}
	}
	// Ensuite, on génère les murs aléatoirement. 15 suffiront.
	for(var k = 0; k < 15; k++){
		var randX = Math.floor(Math.random() *10);
		var randY = Math.floor(Math.random() *10);
		var cellule = getter(randX, randY);
		if(cellule.style.backgroundColor == "black")
		{
			k--;
		}
		else
		{
			cellule.style.backgroundColor = "black";
		}
	}
	
	//On génère les 4 armes
	for(var l = 0; l < 4; l++){
		var randX = Math.floor(Math.random() *10);
		var randY = Math.floor(Math.random() *10);
		var cellule = getter(randX, randY);
		if(cellule.style.backgroundColor == "black" || cellule.style.backgroundColor == "yellow")
		{
			l--;
		}
		else
		{
			var degats = getRandomIntInclusive(20,30);
			var arme = new Arme(randX, randY, degats);
			armes_list.push(arme);
			cellule.style.backgroundColor = "yellow";
			cellule.innerHTML = arme.degats;
			plateau[randX][randY] = arme;
		}
	}
	
	//Et enfin, on génère les deux joueurs
	
	//Joueur 1
	 do{
	  var randX = Math.floor(Math.random() *10);
	  var randY = Math.floor(Math.random() *10);
	  var cellule = getter(randX, randY);
	  
	 }while(cellule.style.backgroundColor != "white")
		 
	 var j1_X = randX;
	 var j1_Y = randY;
	 joueur1 = new Joueur(j1_X, j1_Y, 10, 100, "red");
	 cellule.style.backgroundColor = "red";
	 cellule.innerHTML = joueur1.arme + ", " + joueur1.vie;
	 plateau[j1_X][j1_Y] = joueur1;
	 
	 //Joueur 2
	 do{
	  var randX = Math.floor(Math.random() *10);
	  var randY = Math.floor(Math.random() *10);
	  var cellule = getter(randX, randY);
	  
	 }while(cellule.style.backgroundColor != "white")
	 
	 var j2_X = randX;
	 var j2_Y = randY;
	 joueur2 = new Joueur(j2_X, j2_Y, 10, 100, "blue");
	 cellule.style.backgroundColor = "blue";
	 cellule.innerHTML = joueur2.arme + ", " + joueur2.vie;
	 plateau[j2_X][j2_Y] = joueur2;
}