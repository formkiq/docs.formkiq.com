import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    history.replace('/docs/formkiq-modules/modules/document-generation' + location.hash);
  }, []);

  return null;
}