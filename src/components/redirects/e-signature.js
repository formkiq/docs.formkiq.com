import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();
  
  useEffect(() => {
    history.replace('/docs/formkiq-modules/modules/e-signature' + location.hash);
  }, []);

  return null;
}