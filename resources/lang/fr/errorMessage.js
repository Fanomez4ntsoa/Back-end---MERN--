module.exports = {
    default: 'Une erreur s\'est produite.',
    validations: 'Requête invalide.',
    auth: {
        password: 'Le mot de passe que vous avez saisi est invalide.',
        email: 'L\'adresse e-mail que vous avez saisie est invalide.'
    },
    user: {
        firstname: 'Veuillez saisir votre nom.',
        lastname: 'Veuillez saisir votre prénom',
        email: 'Veuillez saisir votre adresse email.',
        password: 'Veuillez saisir votre mot de passe.',
        already_exist : 'L\'adresse email saisie est déjà liée à un compte, veuillez vous connecter svp.',
        invalid_email: 'L\'adresse email soumis est invalide. Veuillez vérifier votre adresse email.',
        collection: 'Aucun utilisateur',
        not_found: 'Cette utilisateur n\'existe pas ou à été supprimer.',
        deleted: 'La suppression a échouer'
    },
    security: {
        confirm_password: 'La confirmation du mot de passe est requise lors de la mise à jour du mot de passe',
        confirm_password_match: 'Le mot de passe et le mot de passe de confirmation ne correspondent pas'
    }
};