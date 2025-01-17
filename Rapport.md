# Compte Rendu TP Jukebox

## Binôme
- TAQUI Sofian
- BEN MAAOUIA Ahdi

## Choix de conception et de réalisation

Nous avons séparés les différentes parties de l'application en sections plus ou moins logiques. Les parties sont concernant la lecture en cours, gestion de la playlist et ajout de nouveaux morceaux. Chaque section a un rôle spécifique, ce qui permet une meilleure organisation et une meilleure comprehension dans le code. Nous avons utilisé "timeupdate" et "ended" pour suivre la progression de lecture d'une musique et ainsi pouvoir implémenter les repeat si nécessaire (et les automatiser).
Nous avons utilisé "<input type="range">" pour laisser une certaine interactivité avec l'utilisateur car en effet, l'utilisation de cette commande permet à celui-ci de voir la barre de lecture tout en pouvant choisir à quel moment retourner, en gros ça lui laisse le contrôle direct sur la lecture de son titre.

Concernant l'ajout des titres musicaux via l'explorateur de fichiers, nous avons mis un peu de temps à savoir comment faire mais on s'est aperçu que "<input type="file">" était suffisant pour répondre à ce besoin.
Nous avons fixé un format de temps avec la commande "formatTime()" afin d'améliorer la lisibilité du temps des titres et donc améliorer l'expérience utilisateur.

## Difficultés rencontrées (optionnel)
pour la barre de lecture, il nous a fallu créer et surtout penser à supprimer un listener afin de ne pas perdre de données.

## Extensions réalisées (optionnel)
Nous avons modifié la police du projet grâce à Google Fonts