/**
 * Tronque un texte à une longueur maximale donnée.
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Formate une date pour l'affichage.
   */
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  /**
   * Vérifie si une URL est valide.
   */
  export const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  /**
   * Convertit un objet d'erreurs de validation en messages d'erreur.
   */
  export const getValidationErrors = (errors: Record<string, any>): Record<string, string> => {
    const result: Record<string, string> = {};
    
    Object.keys(errors).forEach(key => {
      if (errors[key] && errors[key].message) {
        result[key] = errors[key].message;
      }
    });
    
    return result;
  };