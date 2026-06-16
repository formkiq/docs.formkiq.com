import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    history.replace('/docs/tutorials/formkiq-cli/pre-hook' + location.hash);
  }, []);

  return null;
}
