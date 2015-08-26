(function () {
	'use strict';

	angular.module('localization').run(['resources', function (resources) {
		resources['fr-CA'] = {
			HEADER_TRAFFIC: 'Trafic',
			HEADER_ADD: 'Ajouter une destination',

			MONDAY: 'lundi',
			TUESDAY: 'mardi',
			WEDNESDAY: 'mercredi',
			THURSDAY: 'jeudi',
			FRIDAY: 'vendredi',
			SATURDAY: 'samedi',
			SUNDAY: 'dimanche',

			JANUARY: 'janvier',
			FEBRUARY: 'février',
			MARCH: 'mars',
			APRIL: 'avril',
			MAY: 'mai',
			JUNE: 'juin',
			JULY: 'juillet',
			AUGUST: 'août',
			SEPTEMBER: 'septembre',
			OCTOBER: 'octobre',
			NOVEMBER: 'novembre',
			DECEMBER: 'décembre',

			'AM': 'am',
			'PM': 'pm',

			MAP_MODE: 'mode de carte',
			ADD_DESTINATION: 'ajouter une destination',
			MANAGE_DESTINATIONS: 'gérer des destinations',
			CENTER_MAP: 'centrer la carte sur votre maison',
			SELECT_DESTINATION: 'choisir une destination',
			BACK_TO_MAP: 'retour à la carte',

			BUTTON_ADD: 'Ajouter',
			BUTTON_HOME: 'Maison',
			BUTTON_NEXT: 'Suivant',
			BUTTON_SKIP: 'Sauter',
			BUTTON_ADD_DESTINATION: 'Ajouter destination',
			BUTTON_GO_TO_MAP: 'Accéder à la carte',
			BUTTON_SAVE_NAME: 'Sauvegarder le nom',
			BUTTON_CANCEL: 'Annuler',
			BUTTON_DELETE: 'Supprimer',
			BUTTON_OK: 'OK',
			BUTTON_QUIT: 'Quitter',

			WELCOME_INTRODUCTION_TITLE: 'Bienvenue à Eclipse Traffic',
			WELCOME_INTRODUCTION_TRAFFIC: 'Avec Eclipse Traffic, vous pouvez parcourir les conditions de circulation en temps réel.',
			WELCOME_INTRODUCTION_SAVE: 'Avec cette application facile à utiliser, vous pouvez également sauvegarder jusqu\'à quatre destinations pour accéder rapidement à vos itinéraires fréquents et les évaluer.',

			WELCOME_NAVIGATE_TITLE: 'Navigation sur la carte',
			WELCOME_NAVIGATE_HOWTO: 'Comment utiliser votre contrôleur Eclipse pour naviguer',
			WELCOME_NAVIGATE_PAN: 'Utilisez les touches fléchées pour vous déplacer sur la carte',
			WELCOME_NAVIGATE_ZOOM: 'Utilisez les touches Page précedente et Page suivante pour zoomer',

			WELCOME_SAVE_TITLE: 'Sauvegarder des destinations fréquentes',
			WELCOME_SAVE_TEXT: 'Sauvegarder une destination vers laquelle vous voyagez souvent pour voir facilement les conditions de circulation plus tard.',

			PREDEFINED_WORK: 'Travail',
			PREDEFINED_SCHOOL: 'Ecole',
			PREDEFINED_STORE: 'Magasin',
			PREDEFINED_FAMILY: 'Famille',
			PREDEFINED_TRAVEL: 'Voyage',

			CONDITION_UNKNOWN: 'Unknown conditions',
			CONDITION_GOOD: 'Trafic n\'est pas entravé',
			CONDITION_BUSY: 'Routes encombrées',
			CONDITION_SLOW: 'Circulation ralentie',
			CONDITION_DELAYS: 'Attendez-vous à des retards',

			NAVIGATION_INSTRUCTIONS: 'Zoomez et déplacez la carte pour trouver une destination. Appuyez sur "OK" pour la sélectionner.',

			PREDEFINED_TITLE: 'Nommez votre nouvelle destination',
			CUSTOM_LABEL_BUTTON: 'Créez une étiquette personnalisée',

			CUSTOM_LABEL_TITLE: 'Entrez votre étiquette personnalisée',
			TEXT_ENTER_HINT: 'Entrez le nom de la destination',

			CUSTOM_ICON_TITLE: 'Choisissez une icône',

			PREVIEW_TITLE: 'A quoi ça ressemble?',

			PREVIEW_ICON: 'Icône:',
			PREVIEW_LABEL: 'Etiquette:',

			DELETE_CONFIRM: 'Etes-vous sûr de vouloir supprimer',

			MESSAGE_LOADING: "Chargement en cours...",
			MESSAGE_SAVING: "Sauvegarde en cours...",

			"ERROR_UNKNOWN_PLATFORM": "La plate-forme est inconnue ou n'est pas supportée (TR-01)",
			"ERROR_PLATFORM_LOADING": "Problème de logiciel du serveur (TR-02)",
			"ERROR_REQUESTING_LANGUAGE": "Le système ne peut pas définir le langage courant (TR-03)",
			"ERROR_INITIALIZING_MAP": "Le système ne peut pas se connecter aux services Maps (TR-04)",
			"ERROR_LOADING_ROUTES": "Le système ne peut pas obtenir les itinéraires depuis le serveur (TR-05)",
			//"ERROR_DEFINE_LOCATION": "Le système ne peut pas définir votre emplacement (TR-06)",
			//"ERROR_SAVING_NEW_ROUTE": "Le système ne peut pas sauvegarder l'itinéraire (TR-08)",
			"ERROR_LOADING_DIRECTIONS": "Le système ne peut pas obtenir des itinéraires pour l'emplacement sélectionné depuis le serveur (TR-09)",
			"ERROR_SAVING_ROUTES": "Le système ne peut pas sauvegarder l'itinéraire (TR-10)",
			//"ERROR_REQUESTING_SUGGESTIONS": "Le système ne peut pas définir l'emplacement demandé (TR-11)"
		};
	}]);
})();