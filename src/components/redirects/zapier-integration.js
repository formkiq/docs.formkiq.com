import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

export default function Redirect() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    history.replace('/docs/tutorials/event-and-integration-patterns/formkiq-document-api-with-zapier' + location.hash);
  }, []);

  return null;
}
