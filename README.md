# datastable-component v1.0.0

Composant React.js servant à afficher des données sous forme de tableau HTML.

![image](https://github.com/alebus84/datastable-component/assets/132705913/18a3095c-5eaf-4a54-8d3a-8b78c9c15275)

Environnement :
- IntelliJ IDEA 2023.1.3
- React.js 18.2.0
- TypeScript 4.9.5

Navigateurs testés :
- Microsoft Edge 114.0.1823.67
- Mozilla Firefox 115.0
- Google Chrome 114.0.5735.199

Ce composant possède les fonctionnalités automatiques suivantes :
- Ajustement de la taille du tableau par rapport à la fenêtre du navigateur au montage du composant.
- Pagination des données d'après une limite d'affichage de lignes prédéfinie.

Ce composant possède les fonctionnalités utilisateur suivantes :
- Redimensionnement des colonnes et sauvegarde des dimensions tant que le composant n'est pas démonté.
- Tri des colonnes par ordre alphanumérique croissant et décroissant.

Ce composant est entièrement autonome et réutilisable à volonté sauf pour le formatage des données. Pour qu'il fonctionne en l'état actuel, il est impératif que les données qui lui sont transmises soient formatées dans un template ou un composant parent, et dans un format spécifique (voir le schéma dans App.tsx). Attention, l'affichage des données ne prend en charge que des chaînes de caractères, et le tri des colonnes aussi. Le tri des colonnes prend également en compte la locale française (donc l'ordre alphanumérique français avec les accents).
