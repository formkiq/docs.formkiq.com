import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    history.replace('/docs/add-on-modules/modules/onlyoffice-document-collaboration' + location.hash);
  }, []);

  return null;
}