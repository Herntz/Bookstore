exports.handler = async (event, context) => {
    try {
      // Vous pouvez ajouter du code ici pour effectuer des opérations ou des traitements supplémentaires si nécessaire.
      
      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from Netlify Function' }),
      };
      
      return response;
    } catch (error) {
      // Gérez les erreurs ici et renvoyez une réponse appropriée en cas d'erreur.
      console.error(error);
      
      const response = {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
      
      return response;
    }
  };
  